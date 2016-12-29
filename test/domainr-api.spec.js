const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const nock = require('nock');
const domainr = require('../src/domainr-api');

chai.use(chaiAsPromised);
const should = chai.should();

const searchData = require('./data/search');
const statusData = require('./data/status');
const registerData = require('./data/register');

before(function () {
  nock('https://domainr.p.mashape.com/')
    .get('/v2/search')
    .query(true)
    .reply(200, searchData);

  nock('https://domainr.p.mashape.com/')
    .get('/v2/status')
    .query(true)
    .reply(200, statusData);

  nock('https://domainr.p.mashape.com/', registerData)
    .get('/v2/register')
    .query(true)
    .reply(200, '<html><body></body></body></html>');
});

describe('Domainr-api', function() {
  it('should throw error if mashape key is not specified', function () {
    (function () {
      new domainr();
    }).should.throw('Mashape key is required');
  });

  describe('search', function () {
    it('should return error if query propery is not sent', function() {
      let searchObj = {
        location: 'de'
      };

      let domainrApi = new domainr('some-key');
      domainrApi
        .search(searchObj).should.be.rejectedWith('Query propery is required for search method');
    });

    it('should return error if some propery is not string', function() {
      let searchObj = {
        query: 'query',
        location: 1234
      };

      let domainrApi = new domainr('some-key');
      domainrApi
        .search(searchObj).should.be.rejectedWith('Properties for search function need to be string');
    });

    it('should return valid search object', function() {
      let searchObj = {
        defaults: 'club,coffee',
        location: 'de',
        query: 'acme cafe',
        registrar: 'namecheap.com'
      };

      let domainrApi = new domainr('some-key');
      domainrApi
        .search(searchObj).should.eventually.deep.equal(searchData);
    });
  });

  describe('status', function () {
    it('should return error if domains are not sent', function() {
      let domainrApi = new domainr('some-key');
      domainrApi
        .status().should.be.rejectedWith('Domain array is required for status method');
    });

    it('should return error if domains are not array', function() {
      let domains = 'ace.coffee';

      let domainrApi = new domainr('some-key');
      domainrApi
        .status(domains).should.be.rejectedWith('Domains need to be sent as array for status function');
    });

    it('should return error if there are more than 10 domains in array', function() {
      let domains = ['ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee', 'ace.coffee'];

      let domainrApi = new domainr('some-key');
      domainrApi
        .status(domains).should.be.rejectedWith('Domain array can have maximum 10 domains');
    });

    it('should return error if some domain is not string', function() {
      let domains = ['ace.coffee', 1234];

      let domainrApi = new domainr('some-key');
      domainrApi
        .status(domains).should.be.rejectedWith('All domains must be a string');
    });

    it('should return valid status object', function() {
      let domains = ['ace.coffee', 'acecafe.com', 'acecafe.net', 'acecafe.co', 'acecafe.io'];

      let domainrApi = new domainr('some-key');
      domainrApi
        .status(domains).should.eventually.deep.equal(statusData);
    });
  });

  describe('register', function () {
    it('should return error if domain is not sent', function() {
      let domainrApi = new domainr('some-key');
      domainrApi
        .register().should.be.rejectedWith('Domain is required');
    });

    it('should return error if domain is not string', function() {
      let domainrApi = new domainr('some-key');
      domainrApi
        .register(123).should.be.rejectedWith('Domain needs to be a string');
    });

    it('should return error if registrar is not string', function() {
      let domainrApi = new domainr('some-key');
      domainrApi
        .register('example.com', 1234).should.be.rejectedWith('Registrar must be a string');
    });

    it('should return valid location string', function() {
      let domainrApi = new domainr('some-key');
      domainrApi
        .status('acme.coffee').should.eventually.equal('example.com');
    });
  });
});