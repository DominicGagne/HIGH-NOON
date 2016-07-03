var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var passwordHash = require('password-hash');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: "5mb", extended: true, parameterLimit:5000}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));


//temporary workaround.
var bannedSockets = [];

//load the database module, and allow for connections to be made.
var databaseModule = require('./database.js');
var database = new databaseModule(mysql);
database.acquireConnection();

var authenticationModule = require('./authentication.js');
var authenticationStrategies = new authenticationModule(app, passport, LocalStrategy, database, passwordHash);
authenticationStrategies.initializeAuthentication();


//used to track time for both heartbeat pusle in timeZoneModule but also chat spam.
var currentMicrosecond = new Date();

var totalVisitors = 0;
var numUsers = 0;
var allTimeHigh = 0;

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
    console.log("authenticated!");
    console.log("body: " , req.body);
    if(userIsBanned(req.user)) {
        res.send({banned:"banned"});
    } else {
        res.send(sanitizeUserForClient(req.user));
    }
});

function userIsBanned(user) {
    if(parseInt(user.BannedUntil) > parseInt(currentMicrosecond / 1000)) {
        //user still banned.
        return true;
    } else {
        return false;
    }
}

app.post('/register', function(req, res) {
    if(!req.body.username || !req.body.password || !req.body.utcoffset || !req.body.socketid) {
        res.status(400).send("Badly formatted request.");
    } else {
        console.log("PASS: ", req.body.password);
        database.insertOrUpdate("INSERT INTO User (Username, Password) VALUES (?, ?)", [req.body.username, passwordHash.generate(req.body.password)], function(err, userInsertID) {
            if(err) {
                console.log("error inserting new user.");
                res.status(503).send();
            } else {
                console.log("sucess inserting new user.ID: ", userInsertID);
                database.insertOrUpdate("INSERT INTO ChatTokens (UserID) VALUES (?)", [userInsertID], function(err, insertID) {
                    if(err) {
                        console.log("error creating new record in Token table.");
                        throw err;
                    } else {
                        console.log("created record in token table successfully. id: ", insertID);
                            database.insertOrUpdate("INSERT INTO Settings (UserID, UTCOffset) VALUES (?, ?)", [userInsertID, req.body.utcoffset], function(err, settingsInsertID) {
                            //jesus these callbacks...
                            if(err) {
                                console.log("error inserting into settings  table for userid: ", settingsInsertID);
                                throw err;
                            } else {
                                console.log("inserted into settings table successfully.");

                                authenticationStrategies.insertChatToken(userInsertID, function() {
                                    //MODULARIZE THESE GODDAMNED CALLBACKS!
                                    database.fetchFirst("SELECT * FROM User INNER JOIN Settings ON Settings.UserID = User.UserID WHERE User.Username = ?", [req.body.username], function (userRecord) {
                                        console.log("found user record, logging in: ", userRecord);

                                        //it seems this req.login methods simply serializes the user, does not call the Local Strategy.
                                        req.login(userRecord, function(err) {
                                            if(err) {
                                                console.log("ERROR with login after register.");
                                                throw err;
                                            } else {
                                                res.send(sanitizeUserForClient(req.user));
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

app.get('/test', authenticationStrategies.ensureAuthenticated, function(req, res) {
    console.log("Good auth.");
});

app.get('/chattoken', authenticationStrategies.ensureAuthenticated, function(req, res) {
    //the local strategy has already linked the user to a 
    //socket and created a chat token for them.
    //pass the serialized chat token back to the user.
    //on requests to chat 'message', check socket.chatAuth.
    //if false, check to see that their supplied chat token 
    //is the same as what was serialized.
    //if it was, set socket.chatAuth = true
    //on subsequent requests to 'message' check socket.chatAuth, will last for the duration of their session.
    //what if they change their socketID? is it possible? Don't think we need to worry about that.

    database.fetchFirst("SELECT Token FROM chattokens INNER JOIN User ON chattokens.UserID = User.UserID WHERE User.UserID = ? ", [req.user.UserID], function(TokenObj) {
        console.log("Token", TokenObj);
        if(TokenObj.Token) {
            res.status(200).send(TokenObj.Token);
        } else {
            //no chat token found, why would this be the case?
            res.status(503).send();
        }
    });
});



//instead of a ban status, lets have the user make a request when they open the chat,
//which will pass back a token that is required to chat. required during that hour? each
//time someone logs in generate a token and store it until they request open chat.
app.get('/banstatus', authenticationStrategies.ensureAuthenticated, function(req, res) {
    console.log("Banning request: ", req);
    banAccount(req);
});

//very temporary. replace with function requiring token to chat.
function banAccount(req) {
    var socketToBan = req.user.socketid;

    for(var i = 0; i < bannedSockets.length; i++) {
        console.log("observing...");
        console.log("socket to ban: ",socketToBan, " at i: ", bannedSockets[i]);
        if(socketToBan == bannedSockets[i]) {
            //ban this user.
            setPersistentUserBan(req.user.UserID);
        }
    }
}


function setPersistentUserBan(userID) {
    var bannedUntil = (currentMicrosecond / 1000) + 86400;
    database.insertOrUpdate("UPDATE User SET BannedUntil = ? WHERE UserID = ?", [bannedUntil.toString(), userID], function(err, insertID) {
        if(err) {
            console.log("Error updating persistent ban user!");
        } else {
            console.log("user persistently banned.");
        }
    });
}


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


//for toggles, lets write an app.route collection of endpoints.
//eg, /toggleSetting/:settingID
//this would also make things easier with a setting table in the db.
//
//OR have a single request that updates everything in the settings table when you update one single setting? 
//I like that...
//
//one for toggle, one for more complex operations like chaning username.
app.put('/updateToggleSettings', authenticationStrategies.ensureAuthenticated, function(req, res) {
    console.log("USER(I think): ", req.user.UserID);
    if(! req.body.userSettings) {
        res.status(400).send("Badly formatted request.");
    } else {
        console.log("USER WANTS TO: ", req.body.userSettings);
        database.insertOrUpdate("UPDATE Settings SET SoundEffects = ?, ToastEffects = ? WHERE UserID = ?", [parseInt(req.body.userSettings.SoundEffects), parseInt(req.body.userSettings.ChatToast), req.user.UserID], function(err, insertID) {
            if(err) {
                console.log("Error!");
                throw err;
            } else {
                console.log("success updating toggle sounds.");
            }
        });
        res.send("0");
    }
});

app.get('/requestChatName/:name', function(req, res) {
    //for now, send back success.
    //addToActiveNames(req.params.name);
    res.status(200).send(req.params.name);
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err){
        //wait for session to be destroyed and redirect user home.
        res.status(200).send();
    });
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

    socket.messagesThisInterval = 0;
    socket.lastChatTimestamp = parseInt(new Date() / 1000);
    socket.timesSpammedWhileBanned = 0;

    console.log("SOCKET INFO: ", socket.id);

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

        console.log("socket chatAuth: ", socket.chatAuth);

        if(!socket.chatAuth) {
            //token has not yet been authenticated.
            authenticateChatToken(msg, function(tokenIsValid) {
                if(tokenIsValid) {
                    //this request is valid, they have supplied a correct token.
                    processAuthorizedMessage(socket, msg);
                } else {
                    //request is invalid, user likely tampered with token.
                }
            });
        } else {
            processAuthorizedMessage(socket, msg);
        }
    });
});

function processAuthorizedMessage(socket, msg) {
    console.log("processing authorized message.");
    monitorSpam(socket);

    if(! isSocketBanned(socket)) {
        //before we emit 'msg', we need to sanitize! dont' want to
        //pass back their chat token to all other users!
        io.emit('message', msg);
    } else {
        socket.timesSpammedWhileBanned++;
        console.log("pushing to bannedSockets: ", socket.id.substring(2));
        bannedSockets.push(socket.id.substring(2));
        socket.emit('spamWarning');
    }
}

function authenticateChatToken(msg, callback) {
    console.log("NEED TO AUTH: ", msg);
    var requestor = msg.requestor;
    database.fetchFirst("SELECT Token FROM ChatTokens INNER JOIN User on ChatTokens.UserID = User.UserID WHERE User.Username = ?", [requestor], function(databaseToken) {
        console.log("DEBUG: db: ", databaseToken.Token, " user token: ", msg.chatToken);
        if(databaseToken.Token == msg.chatToken) {
            //the message bearer has supplied to correct chat token, authorise them.
            console.log("Authorized via chat token.");
            callback(true);
        } else {
            console.log("Not authorized to chat.");
            callback(false);
        }
    });
}


//we don't want to pass back sensitive user info!
//however, we also don't want to modify the session object for the user.
//so I'll copy the important info over and leave the session object untounched.
function sanitizeUserForClient(passportUserObject) {
    //Should really consider renaming these attributes for the client side object.
    //After all, they are now just names of tables in the database. Not a good thing.
    var sanitized = {};
    sanitized.settings = {};
    sanitized.scoreTracker = {};

    sanitized.Username = passportUserObject.Username;

    sanitized.settings.SoundEffects = passportUserObject.SoundEffects;
    sanitized.settings.ChatToast = passportUserObject.ToastEffects;

    sanitized.scoreTracker.NumWins = passportUserObject.NumWins;
    sanitized.scoreTracker.TotalPoints = passportUserObject.TotalPoints;

    return sanitized;
}


//this function is dedicated to Corey
function monitorSpam(socket) {
    socket.messagesThisInterval++;
    console.log("messagesThisInterval: ", socket.messagesThisInterval);

    console.log("timesSpammedWhileBanned: ", socket.timesSpammedWhileBanned);

    var currentTimestamp = parseInt(currentMicrosecond / 1000);

    //check every three messages to see if they are spamming.
    if(socket.messagesThisInterval > 2) {
        console.log("More than three messages, checking for spam.");
        console.log("MATH: ", (currentTimestamp - socket.lastChatTimestamp));
        if((currentTimestamp - socket.lastChatTimestamp) < 6) {
            //they've sent 3 messages in 5 seconds. BANNED
            socket.bannedFromChatUntil = currentTimestamp + 10;
            banUserFromChat(socket.id);
        } else {
            //three messages in more than 2 seconds.
            socket.messagesThisInterval = 0;
            socket.lastChatTimestamp = currentTimestamp;
        }
    }
}

function isSocketBanned(socket) {
    var currentTimestamp = parseInt(currentMicrosecond / 1000);

    if(currentTimestamp < socket.bannedFromChatUntil) {
        console.log("user is still banned!");
        return true;
    } else {
        console.log("user is not banned.");
        return false;
    }
}

function banUserFromChat(socketid) {
    console.log("WILL NOW BAN: ", socketid);
}



//hearbeat tick of the entire application
setInterval(function () {
    currentMicrosecond = new Date();
    timeZoneModule.globalTimestampEmit(parseInt(currentMicrosecond / 1000));

    //setting an interval will put that function into Node's queue at the offset amount of milliseconds.
    //I'm picking something slightly less than one second because Node almost always has something in the queue
    //to process before getting to this function. From observation I've noticed this delay to be around 8 milliseconds.
    //This is why it is vital we take a new timestamp with new Date() each iteration. 
}, 992);


//project is ready, listen on port 3000.
http.listen(3000, function(){
  console.log('listening on *:3000');
});

