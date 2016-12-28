var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var nock = require('nock');
var domainrApi = require('../src/domainr-api');

chai.use(chaiAsPromised);
var should = chai.should();

var searchData = require('./data/search');
var statusData = require('./data/status');

before(function () {
  nock('https://domainr.p.mashape.com/')
    .get('/v2/search')
    .query(true)
    .reply(200, searchData);

  nock('https://domainr.p.mashape.com/')
    .get('/v2/status')
    .query(true)
    .reply(200, statusData);
});

describe('Domainr-api', function() {
  it('should throw error if mashape key is not specified', function () {
    (function () {
      new domainrApi();
    }).should.throw('Mashape key is required');
  });

  describe('search', function () {
    it('should return error if some propery is not string', function() {
      var searchObj = {
        quert: 1234
      };

      var domainr = new domainrApi('some-key');
      domainr
        .search(searchObj).should.be.rejectedWith('Properties for search function need to be string');
    });

    it('should return valid search object', function() {
      var searchObj = {
        defaults: 'club,coffee',
        location: 'de',
        quert: 'acme cafe',
        registrat: 'namecheap.com'
      };

      var domainr = new domainrApi('some-key');
      domainr
        .search(searchObj).should.eventually.deep.equal(searchData);
    });
  });

  describe('status', function () {
    it('should return error if domains are not array', function() {
      var domains = 'ace.coffee';

      var domainr = new domainrApi('some-key');
      domainr
        .status(domains).should.be.rejectedWith('Domains need to be sent as array for status function');
    });

    it('should return valid status object', function() {
      var domains = ['ace.coffee', 'acecafe.com', 'acecafe.net', 'acecafe.co', 'acecafe.io'];

      var domainr = new domainrApi('some-key');
      domainr
        .status(domains).should.eventually.deep.equal(statusData);
    });
  });
});