"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*******
Main domainr class
*******/
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

      var badData = Object.values(properties).filter(function (prop) {
        return typeof prop != 'string';
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

      return apiRequest('search', serialize(queryObj));
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

      var queryObj = {};
      queryObj['mashape-key'] = this.mashapeKey;
      queryObj.domain = domainArray.join(',');

      return apiRequest('status', serialize(queryObj));
    }
  }]);

  return domainr;
}();

/*******
 Private methods
*******/


var apiRequest = function apiRequest(path, queryString, callback) {
  var urlObj = {
    protocol: 'https',
    hostname: 'domainr.p.mashape.com',
    pathname: 'v2/' + path,
    search: '?' + queryString
  };

  return new Promise(function (resolve, reject) {
    _request2.default.get(_url2.default.format(urlObj), function (error, response, body) {
      if (error) {
        return reject(error);
      }

      resolve(JSON.parse(body));
    });
  });
};

var serialize = function serialize(obj) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }return str.join("&");
};

module.exports = domainr;