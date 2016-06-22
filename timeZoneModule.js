var timeZoneModule = function(io) {

    var self = this;

    self.determineUserTimeZone = function(utcOffset) {
        //utc offset is given in minutes.
        
        //no way around this, we're going to need a massive switch statement.
        
        switch(utcOffset) {
            case 720: {
              //Is this even possible?
              //Baker Island Time
              //BIT
              break;
          }
          case 660: {
              //Niue Time
              //NUT
              break;
          }
          case 600: {
              //Cook Island Time
              //CKT
              break;
          }
          case 540: {
              //Alaska Standard Time
              //AKST
              break;
          }
          case 480: {
              //Pacific Standard Time
              //PST
              break;
          }
          case 420: {
              //Mountain Standard Time
              //MST
              break;
          }
          case 360: {
              //Galapagos Time
              //GALT
              break;
          }
          case 300: {
              //Ecuador Time
              //ECT
              break;
          }
          case 240: {
              //Eastern Daylight Time
              //EDT
              break;
          }
          case 180: {
              //Argentina Time
              //ART
              break;
          }
          case 120: {
              //South Georgia and the South Sandwhich Islands (this sounds like a fucking novel lol)
              //GST
              break;
          }
          case 60: {
              //Cape Verde Time
              //CVT
              break;
          }
          case 0: {
              //Universal Coordinated Time
              //UTC
              break;
          }
          case -60: {
              //Central European Time
              //CET
              break;
          }
          case -120: {
              //Central African Time
              //CAT
              break;
          }
          case -180: {
              //East Africa Time
              //EAT
              break;
          }
          case -240: {
              //Azerbaijan Time
              //AZT
              break;
          }
          case -300: {
              //Heard and McDonald Island Time
              //HMT
              break;
          }
          case -360: {
              //Bangladesh Standard Time
              //BST
              break;
          }
          case -420: {
              //Christmas Island Time
              //CXT
              break;
          }
          case -480: {
              //ASEAN Common Time
              //ACT
              break;
          } 
          case -540: {
              //Japan Standard Time
              //JST
              break;
          } 
          case -600: {
              //Eastern Standard Time (Australia)
              //AEST
              break;
          }
          case -660: {
              //Lord Howe Summer Time
              //LHST
              break;
          }
          case 12: {
              //is this possible?
              break;
          }
          default: {
              //zone not found!  Could be one of those weird half zones?
              //is break needed?
              break;
          }
        }
    };


};


module.exports = timeZoneModule;













