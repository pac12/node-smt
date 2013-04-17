var
  http = require('http'),
  Smt
;

Smt = function (ipAddress, port) {
  if (!ipAddress) { throw new Error('You must provide an ipAddress'); }

  this.hostname = ipAddress;
  this.port = typeof port === 'number' ? port : 80;
  this.path = '/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso';
};

Smt.prototype = {

  getLeagueList: function (callback) {
    var options = this.getHttpOptions('?feed=AllSport&type=LeagueList');
    http.get(options, function(res) {
      //console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        //console.log('BODY: ' + chunk);
        callback(null, chunk);
      });
    }).on('error', function(err) {
      callback('Could not get League List: ' + err.message);
    });
  },

  getTeamIdList: function () {},

  getRosterSet: function () {},

  getDailySchedule: function () {},

  getGameScores: function () {},

  getHttpOptions: function (pathAddition) {
    var options = {
      hostname: this.hostname,
      port: this.port,
      path: this.path + pathAddition,
    }
    return options;
  }
};

exports.Smt = Smt;

exports.init = function (ipAddress, port) {
  return new Smt(ipAddress, port);
};

exports.version = '0.0.1';
