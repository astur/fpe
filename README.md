# fpe

Custom flatten config object from subset of `process.env`

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm i fpe
```

## Usage

```js
const conf = require('fpe')([
    {
        name: 'nodeEnv',
        key: 'NODE_ENV',
        type: ['development', 'staging', 'production', 'testing'],
    },
    {
        name: 'db.mongo',
        key: ['MONGO_STRING', 'MONGO_URI', 'MONGO_URL'],
        type: 'string',
    },
]);
console.log(conf.nodeEnv);
console.log(conf.db.mongo); //nested object

// or in 'raw' mode:

const conf = require('fpe').raw([
    {
        name: 'nodeEnv',
        key: 'NODE_ENV',
        type: ['development', 'staging', 'production', 'testing'],
    },
    {
        name: 'db.mongo',
        key: ['MONGO_STRING', 'MONGO_URI', 'MONGO_URL'],
        type: 'string',
    },
]);
console.log(conf.nodeEnv);
console.log(conf['db.mongo']); //flat object in raw mode
```

## License

MIT

[npm-url]: https://npmjs.org/package/fpe
[npm-image]: https://badge.fury.io/js/fpe.svg
[travis-url]: https://travis-ci.org/astur/fpe
[travis-image]: https://travis-ci.org/astur/fpe.svg?branch=master