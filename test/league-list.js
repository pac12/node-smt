var should = require("should");
var nock = require("nock");
var smt = require('../lib/node-smt.js');

//nock.recorder.rec();

describe('LeagueList', function () {
  var smtObject;

  describe('with bad connection', function () {
    before(function () {
      smtObject = smt.init('127.0.0.1', 20000);
    });

    it('should pass error and no result to callback', function (done) {
      smtObject.getLeagueList(function (err, result) {
        err.should.match(/Could not get League List/);
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
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=LeagueList')
        .replyWithFile(200, __dirname + '/replies/league-list-200.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=LeagueList')
        .replyWithFile(200, __dirname + '/replies/league-list-bad.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=LeagueList')
        .replyWithFile(404, __dirname + '/replies/404.txt');
    });

    it('should pass no error and a league list as result on 200', function (done) {
      smtObject.getLeagueList(function (err, result) {
        should.not.exist(err);
        result.should.be.a('object');
        result.LeagueList.should.be.a('object');
        result.LeagueList.LeagueListEntry.should.be.an.instanceOf(Array);
        result.LeagueList.LeagueListEntry.should.includeEql({ LeagueId: 'NCAAF', Sport: 'FOOTBALL' });
        done();
      });
    });

    it('should pass error and no result with bad xml', function (done) {
      smtObject.getLeagueList(function (err, result) {
        err.should.match(/Parse error/);
        should.not.exist(result);
        done();
      });
    });

    it('should pass error and no result on 404', function (done) {
      smtObject.getLeagueList(function (err, result) {
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

