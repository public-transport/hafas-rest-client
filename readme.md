# hafas-rest-client

**[WIP] Client for [HAFAS](https://de.wikipedia.org/wiki/HAFAS) `rest.exe` public transport APIs.**

[![npm version](https://img.shields.io/npm/v/@public-transport/hafas-rest-client.svg)](https://www.npmjs.com/package/@public-transport/hafas-rest-client)
[![build status](https://api.travis-ci.org/public-transport/hafas-rest-client.svg?branch=master)](https://travis-ci.org/public-transport/hafas-rest-client)
![ISC-licensed](https://img.shields.io/github/license/public-transport/hafas-rest-client.svg)
![minimum Node.js version](https://img.shields.io/node/v/hafas-rest-client.svg)

*Note:* [`hafas-client`](https://github.com/public-transport/hafas-client) is a client for `mgate.exe` HAFAS APIs (a.k.a. "mobile APIs").

## Background

See [`hafas-client`'s background info](https://github.com/public-transport/hafas-client/blob/5/readme.md#background).

## Installation

```shell
npm install @public-transport/hafas-rest-client
```

## Usage

**WIP, TODO.**

Supported methods (so far):

- `journeys(origin, destination, [opt])` - get journeys between locations
- `refreshJourney(refreshToken, [opt])` - fetch up-to-date/more details of a `journey`
- `trip(tripId, [opt])` - fetch up-to-date/more details of a `trip`
- `dataInfo()` - get information about the HAFAS instance (e.g. a list of operators and sub-products)

## Related

See [`hafas-client`'s related repos](https://github.com/public-transport/hafas-client/blob/5/readme.md#related).

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/public-transport/hafas-rest-client/issues).
