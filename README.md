# domainr-api

This is simple and lightweight NodeJS wrapper for Domainr API hosted on [mashape.com](mashape.com). For using this library, you will need Mashape Key ([How to get free mashape key?](http://docs.mashape.com/api-keys))
You will be able to use 10000 request for free each month!

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