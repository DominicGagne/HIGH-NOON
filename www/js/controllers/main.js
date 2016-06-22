var Boilerplate = angular.module('Boilerplate.controllers',[])

.controller('NoonCtrl',function($scope, $route, $location, $mdDialog, $mdMedia, $mdSidenav, $mdToast, $http) {
    console.log("Loaded Noon Controller.");

    $scope.messages = [];
    $scope.messageToSend = '';
    $scope.potentialChatName = '';

    var noonAudio = new Audio('Assets/highNoon.mp3');
    var gunshot = new Audio('Assets/mccreeGunshot.mp3');
    var familiar = new Audio('Assets/mccreeFamiliar.mp3');
    var whosATurkey = new Audio('Assets/whoIsTurkeyNow.mp3');
    var overTheLine = new Audio('Assets/jiveTurkey.mp3');

    var timeTilNoon;

    var socket = io();

    socket.emit('join', new Date().getTimezoneOffset());

        $scope.temp = parseInt(new Date() / 1000);

        var setOffset = (new Date().getTimezoneOffset()) * 60;
        var secondsElapsedSinceNoon;
        
        $scope.temp = $scope.temp - setOffset;

        $scope.temp = $scope.temp + 43200;
        $scope.secondsElapsedSinceNoon = $scope.temp % 86400;

    socket.on('secondHasPassed', function(timestamp) {
        $scope.$apply(function() {
            $scope.newCount = formatSeconds(timestamp);     
            console.log("secondHasPassed: " , timestamp);
        });
    });

    socket.on('updateNumUsers', function(numUsers) {
        if(parseInt(numUsers) > 1) {
            document.getElementById("numUsers").innerHTML = numUsers + " cowboys here now.";
        } else {
            document.getElementById("numUsers").innerHTML = numUsers + " cowboy here now.";
        }
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
    $scope.sendMessage = function() {
        if($scope.messageToSend) {
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
    };

    $scope.requestChatName = function() {
        $http.get('/requestChatName/' + $scope.potentialChatName).then(joinChat, rejectedFromChat);
    };

    $scope.closeChat = function() {
         $mdSidenav('right').close();
    };

    function joinChat(response) {
        $scope.chatName = response.data;
        overTheLine.play();
    }
    
    function rejectedFromChat() {
        
    }


    function init() {
	document.getElementById("timeTilNoon").innerHTML = 'LOADING...';

	var current = parseInt(new Date() / 1000);
	var offset = (new Date().getTimezoneOffset()) * 60;
        var secondsElapsedSinceNoon;
        
        current = current - offset;

        //you're drunk, don't get too bold, Ballmer.
        current = current + 43200;
        secondsElapsedSinceNoon = current % 86400;
        //end drunk

        /*
        if((current % 129600) > 86400) {
            console.log("BEFORE NOON");
            secondsElapsedSinceNoon = current % 86400;
        } else {
            secondsElapsedSinceNoon = current % 43200;
            console.log("AFTER NOON");
            timeTilNoon = 86400 - secondsElapsedSinceNoon;
        }
        */

        timeTilNoon = 86400 - secondsElapsedSinceNoon;

        console.log("SECONDS ELAPSED SINCE NOON: " + secondsElapsedSinceNoon);  

        console.log("CURRENT (raw): " + current);

	console.log("LOCAL OFFSET: " + offset);
	console.log("YOUR TIME : " + formatSeconds(current));
	console.log("current: " + formatSeconds(current));
	console.log("SINCE NOON: " + secondsElapsedSinceNoon);
	console.log("UNTIL NOON: " + timeTilNoon);
	console.log("it will be noon at: " + (parseInt(new Date() / 1000) + parseInt(timeTilNoon)));
    }


    function formatSeconds(seconds) {
        var date = new Date(1970,0,1);
        date.setSeconds(seconds);
        return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    }

    function resetMcree() {
        document.getElementById("mccree").src="";
    }


    function updateTime() {
	setTimeout(function(){ 
	document.getElementById("timeTilNoon").innerHTML = formatSeconds(timeTilNoon);

	timeTilNoon--;
	console.log(timeTilNoon);

	    if(timeTilNoon == 0) {
	        document.getElementById("mccree").src="Assets/mccree.png";
                noonAudio.play();
                //re-init for tomorrow
                init();

                //display McCree's image for 3 seconds, then dissapear until tomorrow.
                setTimeout(function(){
            	resetMcree();
            }, 2600);
	    }

	    updateTime();
        }, 1000);
    }

    init();
    updateTime();





});
