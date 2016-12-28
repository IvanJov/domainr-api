"use strict";

import request from 'request';
import url from 'url';

/*******
Main domainr class
*******/
class domainr {
  constructor(mashapeKey) {
    if (!mashapeKey)
      throw new Error('Mashape key is required');

    this.mashapeKey = mashapeKey;
  }

  search(properties) {
    var queryKeys = ['defaults', 'location', 'quert', 'registrat'];

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

  status(domainArray){
    if (!Array.isArray(domainArray)) {
      return Promise.reject('Domains need to be sent as array for status function');
    }

    var queryObj = {};
    queryObj['mashape-key'] = this.mashapeKey;
    queryObj.domain = domainArray.join(',');

    return apiRequest('status', serialize(queryObj));
  }
}

/*******
 Private methods
*******/
var apiRequest = function (path, queryString, callback) {
  var urlObj  = {
    protocol: 'https',
    hostname: 'domainr.p.mashape.com',
    pathname: 'v2/' + path,
    search: '?' + queryString
  };

  return new Promise(function (resolve, reject) {
    request(url.format(urlObj), function (error, response, body) {
      if (error) {
        return reject(error);
      }

      resolve(JSON.parse(body));
    })
  });
};

var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

module.exports = domainr;