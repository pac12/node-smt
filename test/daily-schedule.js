var should = require("should");
var nock = require("nock");
var smt = require('../lib/node-smt.js');

//nock.recorder.rec();

describe('DailySchedule', function () {
  var smtObject;

  describe('with bad connection', function () {
    before(function () {
      smtObject = smt.init('127.0.0.1', 20000);
    });

    it ('should pass error and no result to callback', function (done) {
      smtObject.getDailySchedule({LeagueId: 'NCAAF'}, function (err, result) {
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
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=DailySchedule&LeagueId=NCAAF&Date=2013-09-14&Conference=PAC12')
        .replyWithFile(200, __dirname + '/replies/daily-schedule-200.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=DailySchedule&LeagueId=NCAABASE')
        .replyWithFile(200, __dirname + '/replies/daily-schedule-200-empty.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=DailySchedule&LeagueId=TEST')
        .replyWithFile(200, __dirname + '/replies/daily-schedule-bad.txt')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=DailySchedule&LeagueId=BLAH')
        .replyWithFile(404, __dirname + '/replies/404.txt');
    });

    it ('should pass no error and a daily schedule as result on 200', function (done) {
      smtObject.getDailySchedule({LeagueId: 'NCAAF', Date: '2013-09-14', Conference: 'PAC12'}, function (err, result) {
        should.not.exist(err);
        result.should.be.a('object');
        result.DailySchedule.should.be.a('object');
        result.DailySchedule.Game.should.be.an.instanceOf(Array);
        result.DailySchedule.Game[0].should.be.a('object');
        result.DailySchedule.Game[0].Team.should.be.an.instanceOf(Array);
        result.DailySchedule.Game[0].Team.should.have.length(2);
        result.DailySchedule.Game[0].Team[0].should.include({ DisplayName: "THEE Ohio State University" }); // LET'S GO BUCKS!!
        done();
      });
    });

    it ('should pass no error and an empty daily schedule on 200 no events', function (done) {
      smtObject.getDailySchedule({LeagueId: 'NCAABASE'}, function (err, result) {
        should.not.exist(err);
        result.should.be.a('object');
        result.DailySchedule.should.be.a('object');
        should.not.exist(result.DailySchedule.Game);
        done();
      });
    });

    it ('should pass error and no result with bad xml', function (done) {
      smtObject.getDailySchedule({}, function (err, result) {
        err.should.match(/Parse error/);
        should.not.exist(result);
        done();
      });
    });

    it ('should pass error and no result on 404', function (done) {
      smtObject.getDailySchedule({}, function (err, result) {
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

