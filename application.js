var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: "5mb", extended: true, parameterLimit:5000}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));



//load the database module, and allow for connections to be made.
var databaseModule = require('./database.js');
var database = new databaseModule(mysql);
database.acquireConnection();

var authenticationModule = require('./authentication.js');
var authenticationStrategies = new authenticationModule(app, passport, LocalStrategy, database);
authenticationStrategies.initializeAuthentication();


//used to track time for both heartbeat pusle in timeZoneModule but also chat spam.
var currentMicrosecond = new Date();

var totalVisitors = 0;
var numUsers = 0;
var allTimeHigh = 0;
var activeSockets = [];

//stop passing all this stuff around globally...make modules...please...
var bannedIPs = [];

var timeZoneUnit = require('./timeZoneModule.js');
var timeZoneModule = new timeZoneUnit(io);

//do a synchronous read of the stats file upon program initialization.
allTimeHigh = parseInt(fs.readFileSync('visitors.txt'));

database.fetchFirst("SELECT COUNT(*) AS totalVisitors FROM Stats", [], setVisitors);




//put this stuff into a module...
var mcCreeData;
var bullseyeData;

fs.readFile(__dirname + '/Assets/mccree.png', function(err, imageData) {
    if(err) {
        console.log("error reading input.");
        throw err;
    } else {
       mcCreeData = new Buffer(imageData).toString('base64');
    }
});

fs.readFile(__dirname + '/Assets/bullseye.JPG', function(err, imageData) {
    if(err) {
        console.log("error reading input.");
        throw err;
    } else {
        bullseyeData = new Buffer(imageData).toString('base64');
    }
});


console.log("All time high: " + allTimeHigh);

var point;

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log("authenticated!");
    console.log("body: " , req.body);
    delete req.user.UserID;
    res.send(req.user);
    //res.redirect('/users/' + req.user.username);
  });

app.get('/test', authenticationStrategies.ensureAuthenticated, function(req, res) {
    console.log("Good auth.");
});

app.get('/', function(req, res) {
  //res.sendFile(__dirname + '/www/index.html');
  console.log("THIS USER: " , req.connection.remoteAddress);
  //console.log("REQ CONNECTION: ", req.connection);
    console.log("Banned users: ", bannedIPs);
    
    isBanned(req.ip, function(banned) {
        if(banned) {     
           res.sendFile(__dirname + '/www/banned.html');
        } else {
            res.sendFile(__dirname + '/www/index.html');
        }
    });
});


app.get('/init', function(req, res) {
    var payload = [];
    payload.push(mcCreeData);
    payload.push(bullseyeData);
    res.status(200).send(payload);
});

app.get('/requestChatName/:name', function(req, res) {
    //for now, send back success.
    //addToActiveNames(req.params.name);
    res.status(200).send(req.params.name);
});


//put this in a module, PLEASE.
//also, is there a more efficient way to do this?
//this function is run EVERY time someone connects to the site, after all.
function isBanned(ip, callback) {
    var numUsersBanned = bannedIPs.length;
    for(var i = 0; i < numUsersBanned; i++) {
        console.log("Checking: " , ip , " against: ", bannedIPs[i].ip);
        if(bannedIPs[i].ip == ip) {
            //found the user, has their ban expired?
            if((new Date() / 1000) > bannedIPs[i].expiry) {
                //the ban has expired.
                bannedIPs.splice(i, 1);
                return callback(false);
            } else {
              //still banned!
              return callback(true);
            }
        }
    }
    //not on the banned list.
    return callback(false);
}

function addToBannedIPs(ip) {
    var newBannedUser = {};
    newBannedUser.ip = ip;
    console.log("Adding to banned users.");
    //save expiry of ban as UTC for simplicity
    newBannedUser.expiry = (new Date() / 1000) + 86400;
    bannedIPs.push(newBannedUser);
}

function setVisitors(data) {
    //error checking in database module?
    console.log("VISITORS: ", data);
    totalVisitors = data.totalVisitors;
}

function updatedVisitors(err, updatedID) {
    if (err) {
        console.log("err from visitor insert.", err);
    } else {
        totalVisitors++;
        io.emit('updateTotalVisitors', totalVisitors);
    }
}


io.on('connection', function(socket) {
    numUsers++;
    checkRecords();

    socket.mycustom = 'hi!';
    console.log("WOW: ",socket.mycustom);

    addToActiveSockets(socket.id);

    io.emit('updateNumGlobalUsers', numUsers);
    console.log("Cowboy connected. Total: " + numUsers);

    console.log("ALSO: " , socket.handshake.address);


    socket.on('join', function(utcOffset) {

        //utcOffset is supplied in minutes
        console.log("offset: ", utcOffset); 
        timeZoneModule.determineUserTimeZone(socket, utcOffset, function(zone, zoneCode){
            var initObj = {};
            initObj.timezone = zone;
            socket.emit('initialization',initObj);
            database.insertOrUpdate("INSERT INTO Stats (VisitorZone, NetworkIP) VALUES (?,?)", [zoneCode, socket.handshake.address], updatedVisitors);

            console.log("zone: " + zone);

            //find a way to update number of users upon leaving the timezone channel.
            io.emit('updateNumZoneUsers', io.sockets.adapter.rooms[zoneCode].length);

        });

    });

    socket.on('disconnect', function() {
        //console.log("DISCONNECT: ", socket);
        numUsers--;
        io.emit('updateNumGlobalUsers', numUsers); 
        removeFromActiveSockets(socket.id);
        console.log("Cowboy disconnected. Total: " + numUsers);
    });

    socket.on('banHammer', function() {
        //console.log("ALL: ", socket);
        var address = socket.handshake.address;
        console.log("Banned:" , address);
        addToBannedIPs(address);
    });

    socket.on('AllTargetsHit', function() {
        socket.emit('winner');
        socket.broadcast.emit('loser');
    });


    socket.on('message', function(msg) {
    console.log("AND: ",socket.mycustom);

        //incrementMessageCount(socket.id);
        io.emit('message', msg);
    });
});

function checkRecords() {
    if(numUsers > allTimeHigh) {
       console.log("NEW ALL TIME HIGH: " + allTimeHigh);
       io.emit('newRecord', numUsers);
       fs.writeFile('visitors.txt', numUsers.toString(),  function(err) {
           if (err) {
               return console.error(err);
           }        
        });
    }
}

function addToActiveSockets(socketID) {
    var newUser = {};
    newUser.socketID = socketID;
    newUser.messagesThisInterval = 0;
    activeSockets.push(newUser);
    console.log("active users: " + JSON.stringify(activeSockets));
}

function removeFromActiveSockets(socketID) {
    console.log("Removing: ", socketID, " at: ", activeSockets.indexOf(socketID));
    activeSockets.splice(activeSockets.indexOf(socketID), 1);
    //console.log("\n\nactive users: " + JSON.stringify(activeSockets));
}

function incrementMessageCount(socketID) {
    console.log("DATA: ", activeSockets.indexOf(socketID) );
    activeSockets[activeSockets.indexOf(socketID)].messagesThisInterval++;
}

//this function is dedicated to Corey
function monitorSpam() {
    var numSockets = activeSockets.length;

    for(var i = 0; i < numSockets; i++) {
        console.log("socket: ", activeSockets[i]);
    }
    console.log("\n\n\n");
}



//hearbeat tick of the entire application
setInterval(function () {
    currentMicrosecond = new Date();
    timeZoneModule.globalTimestampEmit(parseInt(currentMicrosecond / 1000));
    //monitorSpam();

    //setting an interval will put that function into Node's queue at the offset amount of milliseconds.
    //I'm picking something slightly less than one second because Node almost always has something in the queue
    //to process before getting to this function. From observation I've noticed this delay to be around 8 milliseconds.
    //This is why it is vital we take a new timestamp with new Date() each iteration. 
}, 992);


//project is ready, listen on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});

