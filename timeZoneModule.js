var timeZoneModule = function(io) {

    var self = this;

    //all timezones, ordered from greatest positive UTC offset to greatest negative UTC offset.
    var oderedTimeZones = [];

    primaryInitialization();

    function primaryInitialization() {
        oderedTimeZones.push(initializeTimeZoneObject('Baker Island Time', 'BIT', 720));
        oderedTimeZones.push(initializeTimeZoneObject('Niue Time', 'NUT', 660));
        oderedTimeZones.push(initializeTimeZoneObject('Cook Island Time', 'CKT', 600));
        oderedTimeZones.push(initializeTimeZoneObject('Alaska Standard Time', 'AKST', 540));
        oderedTimeZones.push(initializeTimeZoneObject('Pacific Standard Time', 'PST', 480));
        oderedTimeZones.push(initializeTimeZoneObject('Pacific Daylight Time', 'PDT', 420));
        oderedTimeZones.push(initializeTimeZoneObject('Mountain Time', 'MNT', 360));
        oderedTimeZones.push(initializeTimeZoneObject('Central Time', 'ECT', 300));
        oderedTimeZones.push(initializeTimeZoneObject('Eastern Time', 'EDT', 240));
        oderedTimeZones.push(initializeTimeZoneObject('Atlantic Time', 'ALT', 180));
        oderedTimeZones.push(initializeTimeZoneObject('South Georgia and the South Sandwich Islands', 'GST', 120));
        oderedTimeZones.push(initializeTimeZoneObject('Cape Verde Time', 'CVT', 60));
        oderedTimeZones.push(initializeTimeZoneObject('Universal Coordinated Time', 'UTC', 0));
        oderedTimeZones.push(initializeTimeZoneObject('Central European Time', 'CET', -60));
        oderedTimeZones.push(initializeTimeZoneObject('Heure Avancée d\'Europe Centrale', 'CAT', -120));
        oderedTimeZones.push(initializeTimeZoneObject('East African Time', 'EAT', - 180));
        oderedTimeZones.push(initializeTimeZoneObject('Azerbaijan Time', 'AZT', -240));
        oderedTimeZones.push(initializeTimeZoneObject('Heard and McDonald Island Time', 'HMT', -300));
        oderedTimeZones.push(initializeTimeZoneObject('Bangladesh Standard Time', 'BST', -360));
        oderedTimeZones.push(initializeTimeZoneObject('Christmas Island Time', 'CXT', -420));
        oderedTimeZones.push(initializeTimeZoneObject('China Standard Time', 'CHST', -480));
        oderedTimeZones.push(initializeTimeZoneObject('Japan Standard Time', 'JST', -540));
        oderedTimeZones.push(initializeTimeZoneObject('Australian Eastern Time', 'AEST', -600));
        oderedTimeZones.push(initializeTimeZoneObject('Lord Howe Summer Time', 'LHST', -660));
        oderedTimeZones.push(initializeTimeZoneObject('New Zealand Time', 'NZT', -720));
    }

    function initializeTimeZoneObject(zoneName, zoneCode, offset) {
        var newZone = {};
        newZone.name = zoneName;
        newZone.code = zoneCode;
        newZone.offset = offset;
        return newZone;
    }

    self.determineUserTimeZone = function(socket, utcOffset, callback) {
        var i = 0;
        for(i = 0; i < 25; i++) {
                if(utcOffset == oderedTimeZones[i].offset) {
                //found their timezone.
                socket.join(oderedTimeZones[i].code);
                return callback(oderedTimeZones[i].name, oderedTimeZones[i].code);
            }
        }
        //no zone found for this user.
        return callback(null);
    };


    //timststamp for UTC in seconds.  Emit offset to all timezones.
    self.globalTimestampEmit = function(timestampUTC) {
           
            //need to check HIGH NOON

            var i = 0;
            var offset = 43200;
            for(i = 0; i < 25; i++) {
                //console.log("Name: ", oderedTimeZones[i].name, " code: ", oderedTimeZones[i].code);
                io.to(oderedTimeZones[i].code).emit('secondHasPassed', 
                findSecondsTilNoon(timestampUTC, offset, oderedTimeZones[i].code));
                offset = offset - 3600;
            }
    };


    function findSecondsTilNoon(timestampUTC, timeZoneOffset, channel) {
        var secondsTilNoon;
        //account for timezone offset
        timestampUTC = timestampUTC - timeZoneOffset;

        //adjust timestamp to be 'zeroed' at noon, not midnight.
        timestampUTC = timestampUTC + 43200;
        
        //subtract seconds in a day by how many seconds have passed since the last noon (modulo)
        //this will give us the amount of seconds until the next noon in that timezone.
        secondsTilNoon = 86400 - (timestampUTC % 86400);
            
            if(secondsTilNoon % 20 == 0) io.to(channel).emit('HIGHNOON');

        if(secondsTilNoon == 5) {
            io.to(channel).emit('HIGHNOON');
        }
        return secondsTilNoon;

    }


};


module.exports = timeZoneModule;

