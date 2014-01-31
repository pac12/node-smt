var
  request = require('request'),
  qs = require('querystring'),
  Smt,
  xml2js = require('xml2js')
;

Smt = function (ipAddress, port) {
  if (!ipAddress) { throw new Error('You must provide an ipAddress'); }
  port = parseInt(port, 10);

  this.hostname = ipAddress;
  this.port = typeof port === 'number' && port > 0 ? port : 80;
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
    this.performHttpGet(options, callback);
  },

  getTeamIdList: function (params, callback) {
    if (!params || !params.LeagueId) {
      return callback('LeagueId is a required parameter');
    }
    var options = this.getHttpOptions({
      feed: 'AllSport',
      type: 'TeamIdList',
      LeagueId: params.LeagueId,
    });
    this.performHttpGet(options, callback);
  },

  getRosterSet: function (params, callback) {
    return callback('getRosterSet not implemented');
  },

  getDailySchedule: function (params, callback) {
    if (!params || !params.LeagueId) {
      return callback('LeagueId is a required parameter');
    }
    var options = this.getHttpOptions({
      feed: 'AllSport',
      type: 'DailySchedule',
      LeagueId: params.LeagueId,
      Date: typeof params.Date !== 'undefined' ? params.Date : null,
      Conference: typeof params.Conference !== 'undefined' ? params.Conference : null,
    });
    this.performHttpGet(options, callback);
  },

  getGameScores: function (params, callback) {
    if (!params || !params.LeagueId) {
      return callback('LeagueId is a required parameter');
    }
    var options = this.getHttpOptions({
      feed: 'AllSport',
      type: 'GameScores',
      LeagueId: params.LeagueId,
      Date: typeof params.Date !== 'undefined' ? params.Date : null,
      Conference: typeof params.Conference !== 'undefined' ? params.Conference : null,
    });
    this.performHttpGet(options, callback);
  },

  getHttpOptions: function (params) {
    for (var key in params) {
      if (!params[key]) delete params[key];
    }
    var options = {
      uri: 'http://' + this.hostname + ':' + this.port + this.path,
      qs: params,
      timeout: 30000,
    };
    return options;
  },

  performHttpGet: function (options, callback) {
    var parser = this.parser;
    parser.reset();
    request.get(options, function (error, response, body) {
      if (error) {
        return callback('Could not get ' + options.qs.type + ': ' + error.message);
      }

      if (response.statusCode != 200) {
        return callback('Get Daily Schedule returned HTTP ' + response.statusCode);
      }

      parser.parseString(body, function (err, result) {
        if (err) {
          return callback('Parse error: ' + err);
        }
        return callback(null, result);
      });
    });
  },
};

exports.Smt = Smt;

exports.init = function (ipAddress, port) {
  return new Smt(ipAddress, port);
};

exports.version = '0.0.1';
