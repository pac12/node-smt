var
  http = require('http'),
  qs = require('querystring'),
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
    var options = this.getHttpOptions({
      feed: 'AllSport',
      type: 'LeagueList',
    });
    this.performHttpGet(options, callback).on('error', function(err) {
      return callback('Could not get League List: ' + err.message);
    });
  },

  getTeamIdList: function (params, callback) {
    if (!params.LeagueId) {
      return callback('LeagueId is a required parameter');
    }
    var options = this.getHttpOptions({
      feed: 'AllSport',
      type: 'TeamIdList',
      LeagueId: params.LeagueId,
    });
    this.performHttpGet(options, callback).on('error', function(err) {
      return callback('Could not get Daily Schedule: ' + err.message);
    });
  },

  getRosterSet: function () {},

  getDailySchedule: function (params, callback) {
    if (!params.LeagueId) {
      return callback('LeagueId is a required parameter');
    }
    var options = this.getHttpOptions({
      feed: 'AllSport',
      type: 'DailySchedule',
      LeagueId: params.LeagueId,
      Date: typeof params.Date !== 'undefined' ? params.Date : null,
      Conference: typeof params.Conference !== 'undefined' ? params.Conference : null,
    });
    this.performHttpGet(options, callback).on('error', function(err) {
      return callback('Could not get Daily Schedule: ' + err.message);
    });
  },

  getGameScores: function () {},

  getHttpOptions: function (params) {
    for(var key in params) {
      if(!params[key]) delete params[key];
    }
    var options = {
      hostname: this.hostname,
      port: this.port,
      path: this.path + '?' + qs.stringify(params),
    }
    return options;
  },

  performHttpGet: function (options, callback) {
    var parser = this.parser;
    parser.reset();
    return http.get(options, function(res) {
      //console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (body) {
        //console.log('BODY: ' + body);
        if (200 !== res.statusCode) {
          return callback('Get Daily Schedule returned HTTP ' + res.statusCode);
        }
        parser.parseString(body, function (err, result) {
          if (err) {
            return callback('Parse error: ' + err);
          }
          return callback(null, result);
        });
      });
    });
  },
};

exports.Smt = Smt;

exports.init = function (ipAddress, port) {
  return new Smt(ipAddress, port);
};

exports.version = '0.0.1';
