"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*******************************
Main domainr class
********************************/

var domainr = function () {
  function domainr(mashapeKey) {
    _classCallCheck(this, domainr);

    if (!mashapeKey) throw new Error('Mashape key is required');

    this.mashapeKey = mashapeKey;
  }

  _createClass(domainr, [{
    key: 'search',
    value: function search(properties) {
      var queryKeys = ['defaults', 'location', 'query', 'registrar'];

      if (!properties.query || typeof properties.query != 'string') {
        return Promise.reject('Query propery is required for search method');
      }

      var badData = Object.keys(properties).filter(function (key) {
        return typeof properties[key] != 'string';
      });
      if (badData.length > 0) {
        return Promise.reject('Properties for search function need to be string');
      }

      var queryObj = {};
      queryObj['mashape-key'] = this.mashapeKey;

      queryKeys.forEach(function (val) {
        if (!properties[val]) {
          return true;
        }

        queryObj[val] = properties[val];
      });

      return apiRequest(this.mashapeKey, 'search', queryObj);
    }
  }, {
    key: 'status',
    value: function status(domainArray) {
      if (!domainArray) {
        return Promise.reject('Domain array is required for status method');
      }

      if (!Array.isArray(domainArray)) {
        return Promise.reject('Domains need to be sent as array for status function');
      }

      if (domainArray.length > 10) {
        return Promise.reject('Domain array can have maximum 10 domains');
      }

      var notString = domainArray.filter(function (domain) {
        return typeof domain != 'string';
      });
      if (notString.length > 0) {
        return Promise.reject('All domains must be a string');
      }

      return apiRequest(this.mashapeKey, 'status', { domain: domainArray.join(',') });
    }
  }, {
    key: 'register',
    value: function register(domain) {
      var _this = this;

      if (!domain) {
        return Promise.reject('Domain is required');
      }

      if (typeof domain != 'string') {
        return Promise.reject('Domain needs to be a string');
      }

      return new Promise(function (resolve, reject) {
        apiRequest(_this.mashapeKey, 'register', { domain: domain }).then(function (response) {
          if (response.headers.location) return resolve(response.headers.location);

          resolve(response.request.uri.href);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }]);

  return domainr;
}();

/*******************************
 Private methods
 *******************************/


var apiRequest = function apiRequest(key, path, query) {
  query['mashape-key'] = key;

  var urlObj = {
    protocol: 'https',
    hostname: 'domainr.p.mashape.com',
    pathname: 'v2/' + path,
    search: '?' + serialize(query)
  };

  return new Promise(function (resolve, reject) {
    _request2.default.get(_url2.default.format(urlObj), function (error, response, body) {
      if (error) {
        return reject(error);
      }

      if (path != 'register') {
        body = JSON.parse(body);
        if (body.error) {
          return reject(body.error.message);
        }

        resolve(body);
      }

      resolve(response);
    });
  });
};

var serialize = function serialize(obj) {
  var str = [];
  Object.keys(obj).forEach(function (key) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  });

  return str.join("&");
};

module.exports = domainr;