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
    before(function () {
      smtObject = smt.init('127.0.0.1', 40000);
      nock('http://127.0.0.1:40000')
        .get('/GEMWebExchange/GEMWebExchange.svc/sportsmediaxml.lasso?feed=AllSport&type=LeagueList')
        .reply(
          200,
          "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<LeagueList>\r\n\t<LeagueListEntry LeagueId=\"NCAAB\" Sport=\"BASKETBALL\" />\r\n\t<LeagueListEntry LeagueId=\"NCAABASE\" Sport=\"BASEBALL\" />\r\n\t<LeagueListEntry LeagueId=\"NCAAF\" Sport=\"FOOTBALL\" />\r\n\t<LeagueListEntry LeagueId=\"NCAAW\" Sport=\"BASKETBALL\" />\r\n\t<LeagueListEntry LeagueId=\"NCAAMSOC\" Sport=\"SOCCER\" />\r\n\t<LeagueListEntry LeagueId=\"NCAAWSOC\" Sport=\"SOCCER\" />\r\n\t<LeagueListEntry LeagueId=\"NCAAFH\" Sport=\"FIELD_HOCKEY\" />\r\n\t<LeagueListEntry LeagueId=\"NCAASOFT\" Sport=\"BASEBALL\" />\r\n\t<LeagueListEntry LeagueId=\"NCAAMVB\" Sport=\"VOLLEYBALL\" />\r\n\t<LeagueListEntry LeagueId=\"NCAAWVB\" Sport=\"VOLLEYBALL\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAB\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAABASE\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAF\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAH\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAW\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAMSOC\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAWSOC\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAFH\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAMLAX\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAWLAX\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAASOFT\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAMVB\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAWVB\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAMWP\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"MNCAAWWP\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"TEST\" Sport=\"GENERIC\" />\r\n\t<LeagueListEntry LeagueId=\"TEST2\" Sport=\"GENERIC\" />\r\n</LeagueList>",
          {
            date: 'Wed, 17 Apr 2013 18:41:29 GMT',
            server: 'Apache/2.0.64 (Win32)',
            'keep-alive': 'timeout=15, max=100',
            connection: 'Keep-Alive',
            'transfer-encoding': 'chunked',
            'content-type': 'text/xml; charset=utf-8'
          }
        );
    });

    it ('should return json league list as result on 200', function (done) {
      smtObject.getLeagueList(function (err, result) {
        should.not.exist(err);
        result.should.match(/BASKETBALL/);
        done();
      });
    });
  });

});

