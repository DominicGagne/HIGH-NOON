var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var numUsers = 0;
var allTimeHigh = 0;
var activeNames = [];

var timeZoneUnit = require('./timeZoneModule.js');
var timeZoneModule = new timeZoneUnit(io);

var timestamp = parseInt(new Date() / 1000);

//do a synchronous read of the stats file upon program initialization.
allTimeHigh = parseInt(fs.readFileSync('visitors.txt'));

console.log("All time high: " + allTimeHigh);

var point;
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/www/index.html');
});

app.get('/requestChatName/:name', function(req, res) {
    //for now, send back success.
    addToActiveNames(req.params.name);
    res.status(200).send(req.params.name);
});


io.on('connection', function(socket) {
    numUsers++;
    checkRecords();
    
    io.emit('updateNumUsers', numUsers);
    console.log("Cowboy connected. Total: " + numUsers);

    socket.on('join', function(utcOffset) {
        //utcOffset is supplied in minutes
        console.log("offset: ", utcOffset); 
        socket.emit('secondHasPassed',timeZoneModule.determineUserTimeZone(utcOffset));
        assignTimeZone(socket, utcOffset);       
    });

    socket.on('disconnect', function() {
        numUsers--;
        io.emit('updateNumUsers', numUsers); 
        console.log("Cowboy disconnected. Total: " + numUsers);
    });

    


    socket.on('message', function(msg) {
        io.emit('message', msg);
    });
});

function assignTimeZone(socket, utcOffset) {
    if(utcOffset == 240) {
        console.log("EST!");
        socket.join('EST');
    }
}


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


timestamp = timestamp - (240 * 60);
timestamp = timestamp + 43200;

var sinceNoon;
sinceNoon = timestamp % 86400;
var untilNoon = 86400 - sinceNoon;

setInterval(function () {
    untilNoon--;
    
    globalTimestampEmit();
}, 1000);


//project is ready, listen on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});

