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

    it ('should pass error and no result to callback', function (done) {
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
        .replyWithFile(200, __dirname + '/replies/league-list-200.txt');
    });

    it ('should return json league list as result on 200', function (done) {
      smtObject.getLeagueList(function (err, result) {
        should.not.exist(err);
        result.should.match(/BASKETBALL/);
        done();
      });
    });

    after(function () {
      scope.done();
    });
  });

});

