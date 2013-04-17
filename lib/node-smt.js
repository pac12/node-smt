var
  http = require('http'),
  Smt,
  xml2js = require('xml2js')
;

Smt = function (ipAddress, port) {
  if (!ipAddress) { throw new Error('You must provide an ipAddress'); }

  this.hostname = ipAddress;
  this.port = typeof port === 'number' ? port : 80;
  this.path = '/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso';
  this.parser = new xml2js.Parser({
    trim: true,
    normalize: true,
    mergeAttrs: true,
  });
};

Smt.prototype = {

  getLeagueList: function (callback) {
    var parser = this.parser;
    parser.reset();
    var options = this.getHttpOptions('?feed=AllSport&type=LeagueList');
    http.get(options, function(res) {
      //console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (body) {
        //console.log('BODY: ' + body);
        if (200 !== res.statusCode) {
          return callback('Get League List returned HTTP ' + res.statusCode);
        }
        parser.parseString(body, function (err, result) {
          if (err) {
            return callback('Parse error: ' + err);
          }
          return callback(null, result);
        });
      });
    }).on('error', function(err) {
      return callback('Could not get League List: ' + err.message);
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
