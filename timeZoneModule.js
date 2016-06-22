var timeZoneModule = function(io) {

    var self = this;

    self.determineUserTimeZone = function(socket, utcOffset) {

        console.log("utcOffset (minute): ", utcOffset);
        //utc offset is given in minutes.
        
        //no way around this, we're going to need a massive switch statement.
        
        switch(utcOffset) {
            case 720: {
              //Is this even possible?

              //Baker Island Time
              //BIT
              socket.join('BIT');
              return 'BIT';
          }
          case 660: {
              //Niue Time
              //NUT
              socket.join('NUT');
              return 'NUT';
          }
          case 600: {
              //Cook Island Time
              //CKT
              socket.join('CKT');
              return 'CKT';
          }
          case 540: {
              //Alaska Standard Time
              //AKST
              socket.join('AKST');
              return 'AKST';
          }
          case 480: {
              //Pacific Standard Time
              //PST
              socket.join('PST');
              return 'PST';
          }
          case 420: {
              //Mountain Standard Time
              //MST
              socket.join('MST');
              return 'MST';
          }
          case 360: {
              //Galapagos Time
              //GALT
              socket.join('GALT');
              return 'GALT';
          }
          case 300: {
              //Ecuador Time
              //ECT
              socket.join('ECT');
              return 'ECT';
          }
          case 240: {
              //Eastern Daylight Time
              //EDT
              console.log("Joined EDT.");
              socket.join('EDT');
              return 'EDT';
          }
          case 180: {
              //Argentina Time
              //ART
              socket.join('ART');
              return 'ART';
          }
          case 120: {
              //South Georgia and the South Sandwhich Islands (this sounds like a damn novel lol)
              //GST
              socket.join('GST');
              return 'GST';
          }
          case 60: {
              //Cape Verde Time
              //CVT
              socket.join('CVT');
              return 'CVT';
          }
          case 0: {
              //Universal Coordinated Time
              //UTC
              socket.join('UTC');
              return 'UTC';
          }
          case -60: {
              //Central European Time
              //CET
              socket.join('CET');
              return 'CET';
          }
          case -120: {
              //Central African Time
              //CAT
              socket.join('CAT');
              return 'CAT';
          }
          case -180: {
              //East Africa Time
              //EAT
              socket.join('EAT');
              return 'EAT';
          }
          case -240: {
              //Azerbaijan Time
              //AZT
              socket.join('AZT');
              return 'AZT';
          }
          case -300: {
              //Heard and McDonald Island Time
              //HMT
              socket.join('HMT');
              return 'HMT';
          }
          case -360: {
              //Bangladesh Standard Time
              //BST
              socket.join('BST');
              return 'BST';
          }
          case -420: {
              //Christmas Island Time
              //CXT
              socket.join('CXT');
              return 'CXT';
          }
          case -480: {
              //ASEAN Common Time
              //ACT
              socket.join('ACT');
              return 'ACT';
          } 
          case -540: {
              //Japan Standard Time
              //JST
              socket.join('JST');
              return 'JST';
          } 
          case -600: {
              //Eastern Standard Time (Australia)
              //AEST
              socket.join('AEST');
              return 'AEST';
          }
          case -660: {
              //Lord Howe Summer Time
              //LHST
              socket.join('LHST');
              return 'LHST';
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













