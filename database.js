var databaseModule = function(mysql) {

    process.stdout.write("Initializing DatabaseModule...");

    var self = this;

    var fs = require('fs'), ini = require('ini');

    //parse our databse configuration file.
    var config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));
    
    //config object for the database.
    var connection = mysql.createConnection({
        host: config.database.host,
        database: config.database.database,
        user: config.database.user,
        password: config.database.password,
    });  

    /**
     * [Acquires a connection to the database.]
     * @return {[None.]} ['connection' object will be able to interact with
     * the database if this function succeeds.]
     */
    self.acquireConnection = function() {
        connection.connect(function(err) {
            if(err) {
                console.log("Could not connect to db!");
            } else {
                //'connection' object is now active.
                console.log("Connected to the database.");
            }
        });    
    };


    self.fetchAll = function(queryString, args, callback) {
        connection.query(queryString, args, function(err, rows, fields) {
            //this err stuff needs to be fixed on all these calls.
            if (err) throw err;
            callback(rows);
        });
    };


    self.fetchFirst = function(queryString, args, callback) {
        connection.query(queryString, args, function(err, rows, fields) {
            //this err stuff needs to be fixed on all these calls to throw the errorhanlding routine that was written.
            if (err) throw err;
            callback(rows[0]);
        });
    };


    self.insertOrUpdate = function(queryString, args, callback) {
        console.log("QUERY " + queryString);
        connection.query(queryString, args, function(err, rows, fields) {
            if (err) {
                //throw error, callback will see insert or update failed.
                callback(err, null);
            } else {
                console.log("Updated ID: " + JSON.stringify(rows.insertId));
                //no error, do not set error flag.
                callback(false, rows.insertId);
            }
        });
    };

    console.log("done.");
};


//allow this entire file  to be exported to application.js 
module.exports = databaseModule;

