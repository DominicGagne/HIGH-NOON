var Boilerplate = angular.module('Boilerplate.controllers',[])

.controller('NoonCtrl',function($scope, $route, $location, $mdDialog, $mdMedia, $mdSidenav, $mdToast, $http) {
    console.log("Loaded Noon Controller.");
    $scope.messages = [];
    $scope.messageToSend = '';
    $scope.potentialChatName = '';
    $scope.timeTilNoon = 'LOADING...';
    $scope.overwatch = 'Assets/overwatchBack.jpg';

    $scope.chatPrompt = null;

    var messagesSentThisInterval = 0;
    var warningsAboutSpam = 0;

    var noonAudio = new Audio('Assets/highNoon.mp3');
    var gunshot = new Audio('Assets/mccreeGunshot.mp3');
    var familiar = new Audio('Assets/mccreeFamiliar.mp3');
    var whosATurkey = new Audio('Assets/whoIsTurkeyNow.mp3');
    var overTheLine = new Audio('Assets/jiveTurkey.mp3');
    var fiveSeconds = new Audio('Assets/fiveSeconds.mp3');


    var timeTilNoon;

    var socket = io();

    console.log("offset (minutes) client side: ",new Date().getTimezoneOffset());

    socket.emit('join', new Date().getTimezoneOffset());

    socket.on('secondHasPassed', function(timestamp) {
        $scope.$apply(function() {
            $scope.timeTilNoon = formatSeconds(timestamp);
            console.log("secondHasPassed: " , timestamp);
        });
    });

    socket.on('initialization', function(initObject) {
        //more details to add here?  Add attributes to object.
        $scope.timezone = initObject;
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
          console.log("deploy toast!");
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



    function monitorSpam() {
        console.log("Monitoring spam...");
        if(messagesSentThisInterval > 2) {
            console.log("TOO MANY!");
            warningsAboutSpam++;
            checkWarningsAboutSpam();

            $scope.chatPrompt = 'Easy there, tiger. Too many messages.';
            messagesSentThisInterval = 0;

            //they literally get a timeout if they send too many messages.
            setTimeout(function(){cooldownForSpammers();}, 15000);
        } 
    }

    function resetChatInterval() {
        console.log("RESETTING CHAT INTERVAL");
        messagesSentThisInterval = 0;
        console.log("IS OPEN: " + $mdSidenav('right').isOpen());
        if($mdSidenav('right').isOpen()) {
            setTimeout(function() {
                resetChatInterval();
            }, 3000);
        }
    }

    function checkWarningsAboutSpam() {
        if(warningsAboutSpam > 2) {
            //three strikes, you're out!
            whosATurkey.play();
            setTimeout(function(){redirectSpammer();},2100);
        }
    }

    function redirectSpammer() {
        socket.emit('banHammer');
        window.location = 'https://youtu.be/I-OW4SAZgXY?t=17s';
    }

    //this function is dedicated to Chris
    //it is called after the spammer gets a 15 seconds timeout to reset their chatPrompt
    function cooldownForSpammers() {
        $scope.chatPrompt = null;

    }




    $scope.sendMessage = function() {
        if($scope.messageToSend) {
            messagesSentThisInterval++;
            monitorSpam();
            var chatMsgObj = {};
            chatMsgObj.requestor = $scope.chatName;
            chatMsgObj.message = $scope.messageToSend;
            console.log("SENDING: " + chatMsgObj.message);
            $scope.messageToSend = '';
            gunshot.play();
            socket.emit('message', chatMsgObj);
        }
    };


    $scope.openChat = function() {
        $mdSidenav('right').open();
        $mdToast.hide();
        familiar.play();
        var objDiv = document.getElementById("chat");
        objDiv.scrollTop = objDiv.scrollHeight;
        resetChatInterval();
    };

    $scope.requestChatName = function() {
        $http.get('/requestChatName/' + $scope.potentialChatName).then(joinChat, rejectedFromChat);
    };

    $scope.closeChat = function() {
        console.log("Chat was closed");
        $mdSidenav('right').close();
    };

    function joinChat(response) {
        $scope.chatName = response.data;
        overTheLine.play();
    }
    
    function rejectedFromChat() {
        
    }


    function formatSeconds(seconds) {
        var date = new Date(1970,0,1);
        date.setSeconds(seconds);
        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    socket.on('HIGHNOON', function(){
        console.log("ITS HIGH NOON BRO!");
        fiveSeconds.play();
        setTimeout(function(){itsHighNoon();},5000);
    });

    function itsHighNoon() {
        noonAudio.play();
        $scope.mcCree = 'Assets/mccree.png';
        setTimeout(function(){resetMcree();},2200);
    }

    function resetMcree() {
        //document.getElementById("mccree").src="";
        console.log("resetting mccree");
        $scope.mcCree = null;
    }


});
