require("should");

var smt = require('../lib/node-smt.js');

describe('Node SMT', function () {
  var smtObject;

  before(function () {
    smtObject = smt.init('127.0.0.1');
  });

  describe('Version check', function () {
    it ('should return 0.0.1', function () {
      smt.version.should.equal('0.0.1');
    });
  });

  describe('Cannot create without ipAddress', function () {
    it ('should throw error', function () {
      (function () { smt.init(); }).should.throwError(/You must provide an ipAddress/);
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

  describe('Object creates correct base url', function () {
    it ('should default to port 80', function () {
      var smtObject = smt.init('127.0.0.1');
      smtObject.getHttpOptions().hostname.should.equal('127.0.0.1');
      smtObject.getHttpOptions().port.should.equal(80);
    });

    it ('should default to port 80 when port not numeric', function () {
      var smtObject = smt.init('127.0.0.1', 'not a number');
      smtObject.getHttpOptions().hostname.should.equal('127.0.0.1');
      smtObject.getHttpOptions().port.should.equal(80);
    });

    it ('should allow override of port', function () {
      var smtObject = smt.init('127.0.0.1', 8080);
      smtObject.getHttpOptions().hostname.should.equal('127.0.0.1');
      smtObject.getHttpOptions().port.should.equal(8080);
    });
  });

});

