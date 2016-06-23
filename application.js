var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var numUsers = 0;
var allTimeHigh = 0;
var activeNames = [];

//stop passing all this stuff around globally...make modules...please...
var bannedIPs = [];

var timeZoneUnit = require('./timeZoneModule.js');
var timeZoneModule = new timeZoneUnit(io);

//do a synchronous read of the stats file upon program initialization.
allTimeHigh = parseInt(fs.readFileSync('visitors.txt'));

console.log("All time high: " + allTimeHigh);

var point;
app.get('/', function(req, res) {
  console.log("THIS USER: " , req.connection.remoteAddress);
    console.log("Banned users: ", bannedIPs);
    isBanned(req.ip, function(banned) {
        if(banned) {     
           res.sendFile(__dirname + '/www/banned.html');
        } else {
            res.sendFile(__dirname + '/www/index.html');
        }
    }); 
});

app.get('/requestChatName/:name', function(req, res) {
    //for now, send back success.
    addToActiveNames(req.params.name);
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
    //save expiry of ban as UTC for simplicity
    newBannedUser.expiry = (new Date() / 1000) + 86400;
    bannedIPs.push(newBannedUser);
}


io.on('connection', function(socket) {
    numUsers++;
    checkRecords();

    io.emit('updateNumGlobalUsers', numUsers);
    console.log("Cowboy connected. Total: " + numUsers);

    socket.on('join', function(utcOffset) {
        //utcOffset is supplied in minutes
        console.log("offset: ", utcOffset); 
        timeZoneModule.determineUserTimeZone(socket, utcOffset, function(zone, zoneCode){
            console.log("zone: " + zone);
            socket.emit('initialization',zone);
            console.log("zone: " + zone);

            io.emit('updateNumZoneUsers', io.sockets.adapter.rooms[zoneCode].length);
            console.log("zone: " + zone);

        });

    });

    socket.on('disconnect', function() {
        console.log("DISCONNECT: ", socket.rooms);
        numUsers--;
        io.emit('updateNumGlobalUsers', numUsers); 
        console.log("Cowboy disconnected. Total: " + numUsers);
    });

    socket.on('banHammer', function() {
        console.log("ALL: ", socket);
        var address = socket.handshake.address;
        console.log("Banned:" , address);
        addToBannedIPs(address);
    });


    socket.on('message', function(msg) {
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

function addToActiveNames(userName) {
    activeNames.push(userName);
    console.log("active users: " + JSON.stringify(activeNames));
}

function removeFromActiveNames(userName) {
    activeNames.splice(userName, 1);
    console.log("active users: " + JSON.stringify(activeNames));
}

setInterval(function () {
    timeZoneModule.globalTimestampEmit(parseInt(new Date() / 1000));
}, 1000);


//project is ready, listen on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});

