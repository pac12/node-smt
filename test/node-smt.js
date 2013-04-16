require("should");

var smt = require('../lib/node-smt.js');

describe('Node SMT', function () {
  var smtObject;

  before(function () {
    smtObject = smt.init();
  });

  describe('Version check', function () {
    it ('should return 0.0.1', function () {
      smt.version.should.equal('0.0.1');
    });
  });

  describe('Can create a smt object', function () {
   it ('should return an smt object', function () {
     smtObject.should.be.a('object');
     smtObject.should.be.an.instanceOf(smt.Smt);
   });

   it ('should have a getLeagueList function', function () {
     smtObject.getLeagueList.should.be.a('function');
   });

   it ('should have a getTeamIdList function', function () {
     smtObject.getTeamIdList.should.be.a('function');
   });

   it ('should have a getRosterSet function', function () {
     smtObject.getRosterSet.should.be.a('function');
   });

   it ('should have a getDailySchedule function', function () {
     smtObject.getDailySchedule.should.be.a('function');
   });

   it ('should have a getGameScores function', function () {
     smtObject.getGameScores.should.be.a('function');
   });
  });

});

