# domainr-api

[![npm version](https://badge.fury.io/js/domainr-api.svg)](https://badge.fury.io/js/domainr-api)
[![Build Status](https://travis-ci.org/IvanJov/domainr-api.svg?branch=master)](https://travis-ci.org/IvanJov/domainr-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is simple and lightweight NodeJS wrapper for Domainr API V2. 

1. [Requirements](#requirements)
2. [Instalation](#instalation)
3. [Usage](#usage)
    1. [Initialization](#initialization)
    2. [Search method](#search-method)
    3. [Status method](#status-method)
4. [Official documentation](#official-documentation)
5. [Author](#author)

## Requirements

For using this library, you will need Mashape Key ([How to get free mashape key?](http://docs.mashape.com/api-keys)).
You will can use 10000 request for free each month!

Package requires NodeJS version >= 4.0.0

## Installation

To install `domainr-api`, run:
```
npm install domainr-api --save
```

## Usage

Domainr-api class comes with two main methods. Methods always return a promise.

Methods are:
* search
* status

### Initialization
To initialize domainr-api class, you need to pass your Mashape key. 
```js
let domainrApi = new domainr('some-key');
```

### Search method

Search method let's you search for domain. You will get `results` array with some domain recommendations.

It accepts these arguments:

| Parameter	| Required | Description | Example |
| --------- | -------- | ----------- | ------- |
| query     | Yes | Term(s) to search against. | acme cafe |
| location  | No | Optionally override the IP location detection for country-code zones, with a two-character country code. | de |
| registrar | No | The domain name of a specific registrar to filter results by that registrar’s supported list of extensions (optional). | namecheap.com |
| defaults  | No | Optional comma-separated list of default zones to include in the response. | bike,cab |

#### Example request:
```js
let searchObj = {
    defaults: 'club,coffee',
    location: 'de',
    query: 'acme cafe',
    registrar: 'namecheap.com'
};

let domainrApi = new domainr('some-key');
domainrApi
  .search(searchObj)
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

#### Data returned
```
{
  "results": [
    {
      "domain": "acme.coffee",
      "host": "",
      "subdomain": "acme.",
      "zone": "coffee",
      "path": "",
      "registerURL": "https://api.domainr.com/v2/register?&domain=acme.coffee&registrar=namecheap.com&source=api"
    },
    {
      "domain": "acme.kitchen",
      "host": "",
      "subdomain": "acme.",
      "zone": "kitchen",
      "path": "",
      "registerURL": "https://api.domainr.com/v2/register?&domain=acme.kitchen&registrar=namecheap.com&source=api"
    },
    {
      "domain": "acme.restaurant",
      "host": "",
      "subdomain": "acme.",
      "zone": "restaurant",
      "path": "",
      "registerURL": "https://api.domainr.com/v2/register?&domain=acme.restaurant&registrar=namecheap.com&source=api"
    },
    {
      "domain": "acmecafe.de",
      "host": "",
      "subdomain": "acmecafe.",
      "zone": "de",
      "path": "",
      "registerURL": "https://api.domainr.com/v2/register?&domain=acmecafe.de&registrar=namecheap.com&source=api"
    },
    {
      "domain": "acmecafe.com",
      "host": "",
      "subdomain": "acmecafe.",
      "zone": "com",
      "path": "",
      "registerURL": "https://api.domainr.com/v2/register?&domain=acmecafe.com&registrar=namecheap.com&source=api"
    },
    {
      "domain": "acmecafe.net",
      "host": "",
      "subdomain": "acmecafe.",
      "zone": "net",
      "path": "",
      "registerURL": "https://api.domainr.com/v2/register?&domain=acmecafe.net&registrar=namecheap.com&source=api"
    },
    {
      "domain": "acmecafe.org",
      "host": "",
      "subdomain": "acmecafe.",
      "zone": "org",
      "path": "",
      "registerURL": "https://api.domainr.com/v2/register?&domain=acmecafe.org&registrar=namecheap.com&source=api"
    }
  ]
}
```

### Status method

Status method gives you status for each domain you send in array. You will get `status` array with domain information.
It has limit to 10 domains per call.

It accepts these arguments:

| Parameter	| Required | Description | Example |
| --------- | -------- | ----------- | ------- |
| domains     | Yes | Array of domains to check | ['acme.coffee', 'acmecafe.com'] |

#### Example request:
```js
let domains = ['ace.coffee', 'acecafe.com', 'acecafe.net', 'acecafe.co', 'acecafe.io'];

let domainrApi = new domainr('some-key');
domainrApi
  .status(domains)
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

#### Data returned
```
{
  "status": [
    {
      "domain": "acecafe.net",
      "zone": "net",
      "status": "active",
      "summary": "active"
    },
    {
      "domain": "acecafe.com",
      "zone": "com",
      "status": "active",
      "summary": "active"
    },
    {
      "domain": "acecafe.co",
      "zone": "co",
      "status": "active",
      "summary": "active"
    },
    {
      "domain": "ace.coffee",
      "zone": "coffee",
      "status": "undelegated active",
      "summary": "active"
    },
    {
      "domain": "acecafe.io",
      "zone": "io",
      "status": "undelegated inactive",
      "summary": "inactive"
    }
  ]
}
```

## Official documentation
Official Domainr documentation can be found on: [http://domainr.build/docs](http://domainr.build/docs)

## Author

Author of the package is [Ivan Jovanovic](http://ivanjov.com/).