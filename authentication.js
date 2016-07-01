var authenticationModule  = function(app, passport, LocalStrategy, database, passwordHash) {
    
    var self = this;

    self.initializeAuthentication = function() {

		passport.use(new LocalStrategy(
		    function(username, password, done) {
		    	console.log("\n\nsearching for user...\n\n");
		    	console.log("Have user: ", username, " and pass: ", password);
		        database.fetchFirst("SELECT * FROM User WHERE Username = ?", [username], function (userRecord) {
		            if (!userRecord) { 
		            	console.log("No user found!");
		            	return done(null, false); 
		            }
		            if (!validatePassword(userRecord, password)) { 
		            	console.log("User exists, but wrong password!");
		            	return done(null, false); 
		            }
		            console.log("Sucessfully authenticated!");
		        return done(null, userRecord);
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


    function validatePassword(userRecord, password) {
    	return passwordHash.verify(password, userRecord.Password);
    }

};

module.exports = authenticationModule;
