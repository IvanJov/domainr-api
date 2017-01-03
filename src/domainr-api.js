"use strict";

import request from 'request';
import url from 'url';

/*******************************
Main domainr class
********************************/

class domainr {
  constructor(mashapeKey) {
    if (!mashapeKey)
      throw new Error('Mashape key is required');

    this.mashapeKey = mashapeKey;
  }

  search(properties) {
    const queryKeys = ['defaults', 'location', 'query', 'registrar'];

    if(!properties.query || typeof properties.query != 'string') {
      return Promise.reject('Query propery is required for search method');
    }

    let badData = Object.keys(properties).filter(key => typeof properties[key] != 'string');
    if (badData.length > 0) {
      return Promise.reject('Properties for search function need to be string');
    }

    let queryObj = {};
    queryObj['mashape-key'] = this.mashapeKey;

    queryKeys.forEach(val => {
      if (!properties[val]) {
        return true;
      }

      queryObj[val] = properties[val];
    });

    return new Promise((resolve, reject) => {
      apiRequest(this.mashapeKey, 'search', queryObj)
        .then((data) => {
          resolve(data.search);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  status(domainArray){
    if(!domainArray) {
      return Promise.reject('Domain array is required for status method');
    }

    if (!Array.isArray(domainArray)) {
      return Promise.reject('Domains need to be sent as array for status function');
    }

    if (domainArray.length > 10) {
      return Promise.reject('Domain array can have maximum 10 domains');
    }

    let notString = domainArray.filter(domain => typeof domain != 'string');
    if (notString.length > 0) {
      return Promise.reject('All domains must be a string');
    }

    return new Promise((resolve, reject) => {
      apiRequest(this.mashapeKey, 'status', {domain: domainArray.join(',')})
        .then((data) => {
          resolve(data.status);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  register(domain, registrar) {
    if(!domain) {
      return Promise.reject('Domain is required');
    }

    if(typeof domain != 'string') {
      return Promise.reject('Domain needs to be a string');
    }

    if(registrar && typeof registrar != 'string') {
      return Promise.reject('Registrar must be a string');
    }

    var requestObject = {domain};
    if (registrar)
      requestObject.registrar = registrar;

    return new Promise((resolve, reject) => {
      apiRequest(this.mashapeKey, 'register', requestObject)
        .then((response) => {
          if(response.headers.location)
            return resolve(response.headers.location);

          resolve(response.request.uri.href);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}


/*******************************
 Private methods
 *******************************/
const apiRequest = function (key, path, query) {
  query['mashape-key'] = key;

  let urlObj  = {
    protocol: 'https',
    hostname: 'domainr.p.mashape.com',
    pathname: 'v2/' + path,
    search: '?' + serialize(query)
  };

  return new Promise((resolve, reject) => {
    request.get(url.format(urlObj), (error, response, body) => {
      if (error) {
        return reject(error);
      }

      if(path != 'register') {
        body = JSON.parse(body);
        if (body.error) {
          return reject(body.error.message);
        }

        resolve(body);
      }

      resolve(response);
    })
  });
};

const serialize = function(obj) {
  let str = [];
  Object.keys(obj).forEach(key => {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  });

  return str.join("&");
};

module.exports = domainr;