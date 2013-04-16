var smt;

Smt = function () {};

Smt.prototype = {

  getLeagueList: function () {},

  getTeamIdList: function () {},

  getRosterSet: function () {},

  getDailySchedule: function () {},

  getGameScores: function () {},
};

exports.init = function () {
  return new Smt();
}

exports.version = '0.0.1';
