var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var numUsers = 0;
var allTimeHigh = 0;

//do a synchronous read of the stats file upon program initialization.
allTimeHigh = parseInt(fs.readFileSync('visitors.txt'));

console.log("All time high: " + allTimeHigh);

var point;
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/www/index.html');
});

app.get('/requestChatName/:name', function(req, res) {
    //for now, send back success.
    res.status(200).send(req.params.name)
});


io.on('connection', function(socket) {
    numUsers++;
    checkRecords();
    io.emit('updateNumUsers', numUsers);
    console.log("Cowboy connected. Total: " + numUsers);

    socket.on('disconnect', function() {
        numUsers--;
        io.emit('updateNumUsers', numUsers); 
        console.log("Cowboy disconnected. Total: " + numUsers);
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


//project is ready, listen on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});
