var timeZoneModule = function(io) {

    var self = this;

    self.initializeZoneUsers = function() {
        var globalUserTracker = {};
        globalUserTracker.BIT = 0;
        globalUserTracker.NUT = 0;
        globalUserTracker.CKT = 0;
        globalUserTracker.AKST = 0;
        globalUserTracker.PST = 0;
        globalUserTracker.MST = 0;
        globalUserTracker.GALT = 0;
        globalUserTracker.ECT = 0;
        globalUserTracker.EDT = 0;
        globalUserTracker.ART = 0;
        globalUserTracker.GST = 0;
        globalUserTracker.CVT = 0;
        globalUserTracker.UTC = 0;
        globalUserTracker.CET = 0;
        globalUserTracker.CAT = 0;
        globalUserTracker.EAT = 0;
        globalUserTracker.AZT = 0;
        globalUserTracker.HMT = 0;
        globalUserTracker.BST = 0;
        globalUserTracker.CXT = 0;
        globalUserTracker.ACT = 0;
        globalUserTracker.JST = 0;
        globalUserTracker.AEST = 0;
        globalUserTracker.LHST = 0;

        return globalUserTracker;
    };

    self.determineUserTimeZone = function(socket, io, utcOffset) {

        console.log("utcOffset (minute): ", utcOffset);
        //utc offset is given in minutes.
        
        //no way around this, we're going to need a massive switch statement.
        
        switch(utcOffset) {
            case 720: {
              //Is this even possible?

              //Baker Island Time
              //BIT
              socket.join('BIT');
              return 'Baker Island Time';
          }
          case 660: {
              //Niue Time
              //NUT
              socket.join('NUT');
              return 'Niue Time';
          }
          case 600: {
              //Cook Island Time
              //CKT
              socket.join('CKT');
              return 'Cook Island Time';
          }
          case 540: {
              //Alaska Standard Time
              //AKST
              socket.join('AKST');
              return 'Alaska Standard Time';
          }
          case 480: {
              //Pacific Standard Time
              //PST
              socket.join('PST');
              return 'Pacific Standard Time';
          }
          case 420: {
              //Mountain Standard Time
              //MST
              socket.join('MST');
              return 'Mountain Standard Time';
          }
          case 360: {
              //Galapagos Time
              //GALT
              socket.join('GALT');
              return 'Galapagos Time';
          }
          case 300: {
              //Ecuador Time
              //ECT
              socket.join('ECT');
              return 'Ecuador Time';
          }
          case 240: {
              //Eastern Daylight Time
              //EDT
              console.log("Joined EDT.");
              socket.join('EDT');
              return 'Eastern Time';
          }
          case 180: {
              //Argentina Time
              //ART
              socket.join('ART');
              return 'Argentina Time';
          }
          case 120: {
              //South Georgia and the South Sandwich Islands (this sounds like a damn novel lol)
              //GST
              socket.join('GST');
              return 'South Georgia and the South Sandwich Islands';
          }
          case 60: {
              //Cape Verde Time
              //CVT
              socket.join('CVT');
              return 'Cape Verde Time';
          }
          case 0: {
              //Universal Coordinated Time
              //UTC
              socket.join('UTC');
              return 'Universal Coordinated Time';
          }
          case -60: {
              //Central European Time
              //CET
              socket.join('CET');
              return 'Central European Time';
          }
          case -120: {
              //Central African Time
              //CAT
              socket.join('CAT');
              return 'Heure Avancée d\'Europe Centrale';
          }
          case -180: {
              //East Africa Time
              //EAT
              socket.join('EAT');
              return 'East African Time';
          }
          case -240: {
              //Azerbaijan Time
              //AZT
              socket.join('AZT');
              return 'Azerbaijan Time';
          }
          case -300: {
              //Heard and McDonald Island Time
              //HMT
              socket.join('HMT');
              return 'Heard and McDonald Island Time';
          }
          case -360: {
              //Bangladesh Standard Time
              //BST
              socket.join('BST');
              return 'Bangladesh Standard Time';
          }
          case -420: {
              //Christmas Island Time
              //CXT
              socket.join('CXT');
              return 'Christmas Island Time';
          }
          case -480: {
              //ASEAN Common Time
              //ACT
              socket.join('ACT');
              return 'ASEAN Common Time';
          } 
          case -540: {
              //Japan Standard Time
              //JST
              socket.join('JST');
              return 'Japan Standard Time';
          } 
          case -600: {
              //Eastern Standard Time (Australia)
              //AEST
              socket.join('AEST');
              return 'Australian Eastern Standard Time';
          }
          case -660: {
              //Lord Howe Summer Time
              //LHST
              socket.join('LHST');
              return 'Lord Howe Summer Time';
          }
          case 12: {
              //is this possible?
              return null;
          }
          default: {
              //zone not found!  Could be one of those weird half zones?
              //is break needed?
              return null;
          }
        }
    };



    //timststamp for UTCin seconds.  Emit offset to all timezones.
    self.globalTimestampEmit = function(timestampUTC) {
           
            console.log("Server side UTC timestamp: ", timestampUTC);

            //Is BIT timezone even possible?  Not the same as UTC?
            io.to('BIT').emit('secondHasPassed', secondsTilNoon(timestampUTC, 43200));
            io.to('NUT').emit('secondHasPassed', secondsTilNoon(timestampUTC, 39600));
            io.to('CKT').emit('secondHasPassed', secondsTilNoon(timestampUTC, 36000));
            io.to('AKST').emit('secondHasPassed', secondsTilNoon(timestampUTC, 32400));
            io.to('PST').emit('secondHasPassed', secondsTilNoon(timestampUTC, 28800));
            io.to('MST').emit('secondHasPassed', secondsTilNoon(timestampUTC, 25200));
            io.to('GALT').emit('secondHasPassed', secondsTilNoon(timestampUTC, 21600));
            io.to('ECT').emit('secondHasPassed', secondsTilNoon(timestampUTC, 18000));
            io.to('EDT').emit('secondHasPassed', secondsTilNoon(timestampUTC, 14400));
            io.to('ART').emit('secondHasPassed', secondsTilNoon(timestampUTC, 10800));
            io.to('GST').emit('secondHasPassed', secondsTilNoon(timestampUTC, 7200));
            io.to('CVT').emit('secondHasPassed', secondsTilNoon(timestampUTC, 3600));
            io.to('UTC').emit('secondHasPassed', secondsTilNoon(timestampUTC));
            io.to('CET').emit('secondHasPassed', secondsTilNoon(timestampUTC, -3600));
            io.to('CAT').emit('secondHasPassed', secondsTilNoon(timestampUTC, -7200));
            io.to('EAT').emit('secondHasPassed', secondsTilNoon(timestampUTC, -10800));
            io.to('AZT').emit('secondHasPassed', secondsTilNoon(timestampUTC, -14400));
            io.to('HMT').emit('secondHasPassed', secondsTilNoon(timestampUTC, -18000));
            io.to('BST').emit('secondHasPassed', secondsTilNoon(timestampUTC, -21600));
            io.to('CXT').emit('secondHasPassed', secondsTilNoon(timestampUTC, -25200));
            io.to('ACT').emit('secondHasPassed', secondsTilNoon(timestampUTC, -28800));
            io.to('JST').emit('secondHasPassed', secondsTilNoon(timestampUTC, -32400));
            io.to('AEST').emit('secondHasPassed', secondsTilNoon(timestampUTC, -36000));
            io.to('LHST').emit('secondHasPassed', secondsTilNoon(timestampUTC, -39600));
    };


    function secondsTilNoon(timestampUTC, timeZoneOffset) {
        //account for timezone offset
        timestampUTC = timestampUTC - timeZoneOffset;

        //adjust timestamp to be 'zeroed' at noon, not midnight.
        timestampUTC = timestampUTC + 43200;
        
        //subtract seconds in a day by how many seconds have passed since the last noon (modulo)
        //this will give us the amount of seconds until the next noon in that timezone.
        return 86400 - (timestampUTC % 86400);

    }


};


module.exports = timeZoneModule;













