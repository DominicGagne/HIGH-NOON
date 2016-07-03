var authenticationModule  = function(app, passport, LocalStrategy, database, passwordHash) {
    
    var self = this;

    self.initializeAuthentication = function() {

		passport.use(new LocalStrategy(
			{passReqToCallback: true},
		    function(req, username, password, done) {
		    	console.log("REQUEST BODY: ", req.body);
		    	if(! req.body.socketid) {
    		        //badly formatted request, cannot link this authenticated user to a socket.
    		        //do not authenticate.
    		        return done(null, false);
		    	}
		    	console.log("\n\nsearching for user...\n\n");
		    	console.log("Have user: ", username, " and pass: ", password);
		        database.fetchFirst("SELECT * FROM User INNER JOIN Settings ON Settings.UserID = User.UserID WHERE User.Username = ?", [username], function (userRecord) {
		            if (!userRecord) { 
		            	console.log("No user found!");
		            	return done(null, false); 
		            }
		            if (!validatePassword(userRecord, password)) { 
		            	console.log("User exists, but wrong password!");
		            	return done(null, false); 
		            }
		            console.log("Sucessfully authenticated!");

		        //attach socket to identify this user.
		    	userRecord.socketid = req.body.socketid;

		    	//generate a chat token this user will use to 
		    	//authenticate chat messages during this session.
		    	
		    	//does it make sense to attach this information to the user's session?
		    	//if we are storing it in the database...
		    	//userRecord.chatToken = generateChatToken();


		    	self.insertChatToken(userRecord.UserID, function() {
		    		console.log("send userRecord to be serialized.");
		    		//send userRecord to be serialized.
		            return done(null, userRecord);
		    	});
		    });
		  }
		));


		passport.serializeUser(function(user, done) {
            //custom user serialization
            console.log("SERIALIZATION in progress.");
            console.log("USER: " + JSON.stringify(user)); 
            done(null, user); 
        });        

        passport.deserializeUser(function(user, done) {
            // placeholder for custom user deserialization.
            // first argument is for errors
            console.log("\n\n\nde - serialization in progress.");
            console.log("USER: " + JSON.stringify(user));

            done(null, user);
        });


        // Initialize Passport and restore authentication state, if any, from the
        // session.
        app.use(passport.initialize());
        app.use(passport.session());

    };

    self.ensureAuthenticated = function(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.status(403).send("Not authenticated.");
    };

    //generates random 5 digit hex number, returned as string.
    function generateChatToken() {
        var hex = Math.floor(Math.random() * 1000000) + 100000;
        return hex.toString(16).substring(0,5);
    }

    self.insertChatToken = function(userID, callback) {
    	var token = generateChatToken();
    	database.insertOrUpdate("UPDATE ChatTokens SET Token = ? WHERE UserID = ?", [token, userID], function(err, insertID) {
    		if(err) {
    			console.log("Could not insert new chat token.");
    			throw err;
    		} else {
    			console.log("chat token inserted.");
    			callback();
    		}
    	});
    };


    function validatePassword(userRecord, password) {
    	return passwordHash.verify(password, userRecord.Password);
    }

};

module.exports = authenticationModule;
