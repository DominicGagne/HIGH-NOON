var Boilerplate = angular.module('Boilerplate.controllers',[])

.controller('NoonCtrl',function($scope, $route, $location, $mdDialog, $mdMedia, $mdSidenav, $mdToast, $http) {
    console.log("Loaded Noon Controller.");
    $scope.messages = [];
    $scope.messageToSend = '';
    $scope.timeTilNoon = 'LOADING...';
    $scope.overwatch = 'Assets/overwatchBack.jpg';

    $scope.user = null;
    $scope.client = null;

    $scope.loginPrompt = 'Login or Register to chat with other users!';
    $scope.chatPrompt = null;

    //this should be server side...
    $scope.targetsHit = 0;

    var warningsAboutSpam = 0;

    var noonAudio = new Audio('Assets/highNoon.mp3');
    var gunshot = new Audio('Assets/mccreeGunshot.mp3');
    var gunshotTwo = new Audio('Assets/mccreeGunshot.mp3');
    var familiar = new Audio('Assets/mccreeFamiliar.mp3');
    var whosATurkey = new Audio('Assets/whoIsTurkeyNow.mp3');
    var overTheLine = new Audio('Assets/jiveTurkey.mp3');
    var fiveSeconds = new Audio('Assets/fiveSeconds.mp3');
    var westWasWon = new Audio('Assets/westWasWon.mp3');


    var timeTilNoon;

    var socket = io();

    console.log("offset (minutes) client side: ",new Date().getTimezoneOffset());

    socket.emit('join', new Date().getTimezoneOffset());

    socket.on('secondHasPassed', function(timestamp) {
        $scope.$apply(function() {
            $scope.timeTilNoon = formatSeconds(timestamp);
        });
    });

    socket.on('initialization', function(initObject) {
        //more details to add here?  Add attributes to object.
        $scope.timezone = initObject.timezone;
    });

    socket.on('updateNumGlobalUsers', function(numUsers) {
        if(parseInt(numUsers) > 1) {
            $scope.globalCowboys = numUsers + " cowboys here globally.";
        } else {
            $scope.globalCowboys = numUsers + " cowboy here globally.";
        }
    });

    socket.on('updateNumZoneUsers', function(numUsers) {
        $scope.$apply(function() {
            $scope.zoneUsersMessage = numUsers + ' in your timezone.';
        });
    });

    socket.on('message', function(chatMsgObj) {
      if(! $mdSidenav('right').isOpen()) {
          //send toast!
          showMessageToast();
      }

        chatMsgObj.timestamp = Date.now();

        $scope.$apply(function() {
            $scope.messages.push(chatMsgObj);
        });
        var objDiv = document.getElementById("chat");
        objDiv.scrollTop = objDiv.scrollHeight;
    });

    socket.on('newRecord', function(allTimeHigh) {
        $scope.$apply(function() {
            $scope.newRecord = 'New all time high! ' + allTimeHigh + ' Cowboys!';
        });
    });

    socket.on('winner', function() {
        console.log("YOU ARE THE WINNER!");
        $scope.result = 'You won!';
        westWasWon.play();
    });

    socket.on('loser', function() {
        console.log("YOU LOST!");
        $scope.result = 'You lost!';
    });

    socket.on('updateTotalVisitors', function(totalVisitors) {
        $scope.$apply(function() {
            $scope.totalVisitors = totalVisitors;
        });
    });

    socket.on('spamWarning', function() {
        console.log("ALL WE KNOW OF SOCKET: ", socket.id);
        $http.get('/banstatus').then(function(response) {
              //success
        }, function(res){
              //failure
        });
        $mdSidenav('right').close();
        $scope.spamWarning = "You've been temporarily banned from chat. Your messages will not be processed."; 
    });

    initialization();
    function initialization() {
        $http.get('/init').then(initSuccess, initFailure);
    }

    function initSuccess(response) {
        console.log("initSuccess");
        $scope.mcCree = response.data[0];
        $scope.bullseye = response.data[1];
    }

    function initFailure() {
        //TODO
        console.log("initialization failure from server.");
    }


    function showMessageToast() {
        var toast = $mdToast.simple()
            .textContent('New Chat Message!')
            .action('VIEW')
            .highlightAction(false)
            .highlightClass('md-accent')
            .position('top left');
        $mdToast.show(toast).then(function(response) {
            if(response) {
                console.log("clicked view!");
                $mdSidenav('right').open();
            }
        });
  }




    function redirectSpammer() {
        socket.emit('banHammer');
        window.location = 'https://youtu.be/I-OW4SAZgXY?t=17s';
    }





    $scope.sendMessage = function() {
        if($scope.messageToSend) {
            var chatMsgObj = {};
            chatMsgObj.requestor = $scope.user.Username;
            chatMsgObj.message = $scope.messageToSend;
            console.log("SENDING: " + chatMsgObj.message);
            $scope.messageToSend = '';
            if($scope.user.SoundEffects) {
                gunshot.play();
            }
            socket.emit('message', chatMsgObj);
        }
    };


    $scope.openChat = function() {
        $mdSidenav('right').open();
        $mdToast.hide();
        if($scope.user.SoundEffects) {
            familiar.play();
        }
        var objDiv = document.getElementById("chat");
        objDiv.scrollTop = objDiv.scrollHeight;
    };

    $scope.viewSettings = function() {
        $mdSidenav('left').open();
    };

    $scope.toggleIndividualSetting = function(settingName, endpoint) {
        console.log("toggle sounds to: " , settingName, endpoint);
        $http.put('/updateToggleSettings', {"toggleSetting":formatToggleSettings($scope.user.Settings)}).then(function(response) {
            console.log("success from toggle sounds.");
        }, function(response) {
            console.log("error from server.");
            console.log(response);
        });
    };

    function formatBinaryToggle(soundEffects) {
        if(soundEffects) {
            return "1";
        } else {
            return "0";
        }
    }

    function unformatBinaryToggle(soundEffects) {
        if(soundEffects) {
            console.log("set to true!");
            return true;
        } else {
            console.log("set to false!");
            return false;
        }
    }

    $scope.login = function(client) {
        $http.post('/login', {"username":client.username, "password":client.password, "socketid":socket.id}).then(function(response) {
            console.log("logged in.");
            console.log(response);

            //temprary workaround, use tokens brah
            if(response.data.banned) {
                $scope.spamWarning = "You've been temporarily banned from chat. Your messages will not be processed.";
            } else {
                $scope.user = response.data;
                $scope.user.SoundEffects = unformatBinaryToggle($scope.user.SoundEffects);
                $scope.user.ChatToast = unformatBinaryToggle($scope.user.ChatToast);
                console.log("user:", $scope.user);
            }

        }, function(response) {
            $scope.loginPrompt = 'Incorrect Username or password.';
            $scope.client.password = '';
            console.log("error from server.");
            console.log(response);
        });
    };

    $scope.register = function(newUser) {
        console.log("clicked register.");
        $http.post('/register', {"username":newUser.username, "password":newUser.password, "utcoffset":new Date().getTimezoneOffset(), "socketid":socket.id}).then(function(response) {
            console.log("logged in.");
            console.log(response);
            $scope.user = response.data;
            $scope.user.SoundEffects = unformatBinaryToggle($scope.user.SoundEffects);
            $scope.user.ChatToast = unformatBinaryToggle($scope.user.ChatToast);
            console.log("user:", $scope.user);
        }, function(response) {
            console.log("error from server.");
            $scope.loginPrompt = 'Sorry, but that username has already been used.';
            $scope.newUser = {};
            console.log(response);
        });
    };

    $scope.logout = function() {
        $http.get('/logout').then(function(response) {
            console.log("Logged out.");
            console.log(response);
            $scope.showLogout = true;
            $scope.user = null;
            $scope.client = null;
        }, function(response) {
            console.log("error from server.");
            console.log(response);
        });
    };

    $scope.continueAsAnon = function() {
        $scope.showLogout = false;
    };

    $scope.test = function() {
        $http.get('/test').then(function(response) {
                console.log("passed.");
            }, function(response) {
                console.log("error from server.");
                console.log(response);
            });
    };



    $scope.closeChat = function() {
        console.log("Chat was closed");
        $mdSidenav('right').close();
    };

    $scope.closeSettings = function() {
        console.log("closing settings.");
        $mdSidenav('left').close();
    };

    $scope.targetHit = function() {
        console.log("Shot the target!");
        $scope.targetsHit++;
        if($scope.targetsHit > 4) {
            socket.emit('AllTargetsHit');
        }

        drawTarget();

        if($scope.user.SoundEffects) {
            if(!gunshot.paused) {
                gunshotTwo.play();
            } else {
               gunshot.play();
            }
        }
    };

    //save this for when they type explicit things. might want to be done client side?
    //lots of work for the server...
    //overTheLine.play();
    
    function rejectedFromChat() {
        
    }


    function formatSeconds(seconds) {
        var date = new Date(1970,0,1);
        date.setSeconds(seconds);
        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    socket.on('COUNTDOWN', function(){
        console.log("ITS COUNTDOWN TIME BRO!");
        fiveSeconds.play();
        setTimeout(function(){itsHighNoon();},5000);
    });

    //why don't we pass in the function name and compile on the fly? would prevent 'hackers'...
    socket.on('DISPLAYBULLSEYE', function(token){
        console.log("BULLSEYE TIME!");
        drawTarget();
    });

    function itsHighNoon() {
        noonAudio.play();
        $scope.displayMcCree = true;
    }

    function drawTarget() {
        $scope.displayMcCree = false;
        $scope.targetTime = true;
        $scope.vert = Math.floor((Math.random() * 90) + 10);
        $scope.hor = Math.floor((Math.random() * 90) + 10);
        console.log("vert: " , $scope.vert, " hor: " , $scope.hor);
    }


    $scope.resetPage = function() {
        console.log("resetting mccree");
        $scope.targetsHit = 0;
        $scope.result = false;
        $scope.targetTime = false;
    };


});
