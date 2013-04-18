var should = require("should");
var nock = require("nock");
var smt = require('../lib/node-smt.js');

//nock.recorder.rec();

describe('GameScores', function () {
  var smtObject;

  describe('with bad connection', function () {
    before(function () {
      smtObject = smt.init('127.0.0.1', 20000);
    });

    it ('should pass error and no result to callback', function (done) {
      smtObject.getGameScores({LeagueId: 'NCAAF'}, function (err, result) {
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
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=GameScores&LeagueId=NCAABASE&Date=2013-09-10&Conference=PAC12')
        .replyWithFile(200, __dirname + '/replies/game-scores-200.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=GameScores&LeagueId=NCAABASE')
        .replyWithFile(200, __dirname + '/replies/game-scores-200-empty.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=GameScores&LeagueId=TEST')
        .replyWithFile(200, __dirname + '/replies/game-scores-bad.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=GameScores&LeagueId=BLAH')
        .replyWithFile(404, __dirname + '/replies/404.txt');
    });

    it ('should pass error and no result to callback when no LeagueId given', function (done) {
      smtObject.getTeamIdList({}, function (err, result) {
        err.should.match(/LeagueId is a required parameter/);
        should.not.exist(result);
        done();
      });
    });

    it ('should pass no error and game scores as result on 200', function (done) {
      smtObject.getGameScores({LeagueId: 'NCAABASE', Date: '2013-09-10', Conference: 'PAC12'}, function (err, result) {
        should.not.exist(err);
        result.should.be.a('object');
        result.GameScores.should.be.a('object');
        result.GameScores.Game.should.be.an.instanceOf(Array);
        result.GameScores.Game[0].should.be.a('object');
        result.GameScores.Game[0].GlobalGameId.should.be.a('string');
        result.GameScores.Game[0].GameContext.should.be.an.instanceOf(Array);
        result.GameScores.Game[0].GameContext[0].AwayScore.should.be.a('string');
        result.GameScores.Game[0].GameContext[0].HomeScore.should.be.a('string');
        done();
      });
    });

    it ('should pass no error and empty game scores on 200 no events', function (done) {
      smtObject.getGameScores({LeagueId: 'NCAABASE'}, function (err, result) {
        should.not.exist(err);
        result.should.be.a('object');
        result.GameScores.should.be.a('object');
        should.not.exist(result.GameScores.Game);
        done();
      });
    });

    it ('should pass error and no result with bad xml', function (done) {
      smtObject.getGameScores({LeagueId: 'TEST'}, function (err, result) {
        err.should.match(/Parse error/);
        should.not.exist(result);
        done();
      });
    });

    it ('should pass error and no result on 404', function (done) {
      smtObject.getGameScores({LeagueId: 'BLAH'}, function (err, result) {
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

