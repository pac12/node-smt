var Smt;

Smt = function (ipAddress, port) {
  if (!ipAddress) { throw new Error('You must provide an ipAddress'); }
  port = typeof port === 'number' ? port : 80;

};

Smt.prototype = {

  getLeagueList: function () {},

  getTeamIdList: function () {},

  getRosterSet: function () {},

  getDailySchedule: function () {},

  getGameScores: function () {},
};

exports.Smt = Smt;

exports.init = function (ipAddress, port) {
  return new Smt(ipAddress, port);
};

exports.version = '0.0.1';
