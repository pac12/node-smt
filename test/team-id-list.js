var should = require("should");
var nock = require("nock");
var smt = require('../lib/node-smt.js');

//nock.recorder.rec();

describe('TeamIdList', function () {
  var smtObject;

  describe('with bad connection', function () {
    before(function () {
      smtObject = smt.init('127.0.0.1', 20000);
    });

    it ('should pass error and no result to callback', function (done) {
      smtObject.getTeamIdList({LeagueId: 'NCAAF'}, function (err, result) {
        err.should.match(/Could not get Daily Schedule/);
        should.not.exist(result);
        done();
      });
    });
  });

  describe('with good connection', function () {
    var scope;
    before(function () {
      smtObject = smt.init('127.0.0.1', 40000);
      scope = nock('http://127.0.0.1:40000')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=TeamIdList&LeagueId=NCAAF')
        .replyWithFile(200, __dirname + '/replies/team-id-list-200.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=TeamIdList&LeagueId=TEST')
        .replyWithFile(200, __dirname + '/replies/team-id-list-bad.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=TeamIdList&LeagueId=BLAH')
        .replyWithFile(404, __dirname + '/replies/404.txt');
    });

    it ('should pass error and no result to callback when no LeagueId given', function (done) {
      smtObject.getTeamIdList({}, function (err, result) {
        err.should.match(/LeagueId is a required parameter/);
        should.not.exist(result);
        done();
      });
    });

    it ('should pass no error and a daily schedule as result on 200', function (done) {
      smtObject.getTeamIdList({LeagueId: 'NCAAF', Date: '2013-09-14', Conference: 'PAC12'}, function (err, result) {
        should.not.exist(err);
        result.should.be.a('object');
        result.TeamIdList.should.be.a('object');
        result.TeamIdList.TeamIdListEntry.should.be.an.instanceOf(Array);
        result.TeamIdList.TeamIdListEntry.should.includeEql({ SMTId: "OHST", DisplayName: "OHIO ST" });
        done();
      });
    });

    it ('should pass error and no result with bad xml', function (done) {
      smtObject.getTeamIdList({LeagueId: 'TEST'}, function (err, result) {
        err.should.match(/Parse error/);
        should.not.exist(result);
        done();
      });
    });

    it ('should pass error and no result on 404', function (done) {
      smtObject.getTeamIdList({LeagueId: 'BLAH'}, function (err, result) {
        err.should.match(/HTTP 404/);
        should.not.exist(result);
        done();
      });
    });

    after(function () {
      scope.done();
    });
  });

});

