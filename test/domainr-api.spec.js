const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const nock = require('nock');
const domainr = require('../src/domainr-api');

chai.use(chaiAsPromised);
const should = chai.should();

const searchData = require('./data/search');
const statusData = require('./data/status');

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
      new domainr();
    }).should.throw('Mashape key is required');
  });

  describe('search', function () {
    it('should return error if some propery is not string', function() {
      let searchObj = {
        quert: 1234
      };

      let domainrApi = new domainr('some-key');
      domainrApi
        .search(searchObj).should.be.rejectedWith('Properties for search function need to be string');
    });

    it('should return valid search object', function() {
      let searchObj = {
        defaults: 'club,coffee',
        location: 'de',
        quert: 'acme cafe',
        registrat: 'namecheap.com'
      };

      let domainrApi = new domainr('some-key');
      domainrApi
        .search(searchObj).should.eventually.deep.equal(searchData);
    });
  });

  describe('status', function () {
    it('should return error if domains are not array', function() {
      let domains = 'ace.coffee';

      let domainrApi = new domainr('some-key');
      domainrApi
        .status(domains).should.be.rejectedWith('Domains need to be sent as array for status function');
    });

    it('should return valid status object', function() {
      let domains = ['ace.coffee', 'acecafe.com', 'acecafe.net', 'acecafe.co', 'acecafe.io'];

      let domainrApi = new domainr('some-key');
      domainrApi
        .status(domains).should.eventually.deep.equal(statusData);
    });
  });
});