# fpe

Makes config object (flat or nested) from environment variables (`process.env`).

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm i fpe
```

## Usage

```js
const fpe = require('fpe');

const nestedConfigObject = fpe(options);
const flatConfigObject = fpe.raw(options);
```

`fpe.raw` function do the same as `fpe` function, but returns raw flat object without unflattening.

`options` is the only parameter. It must be an array of options. Each option is object with three fields:

* `name` - name of config variable in flat object (for example `'production.mongo.port'`).
* `key` - name of variable in `process.env`. Or array of names, so first defined variable will be used. Same env variable may be set to many config variables.
* `type` (optional) - type of env variable. It may be one of this (defaults to 'string'):
  * `'string'` - fpe uses env variable as is.
  * `'number'` - fpe converts env variable to number or throws error.
  * `'boolean'` - fpe uses `true` if env variable is 'true', 'ok', 'on' or 'yes'; uses `false` if env variable is 'false', 'null', 'off' or 'no'. Otherwise throws error.
  * `array of strings` - fpe uses env variable if it is in array. Otherwise throws error.
  * `regexp` - fpe uses env variable if it matches regexp. Otherwise throws error.

## Example

```js
const fpe = require('fpe');

process.env.SIMPLE = 'simple';
process.env.STRING = 'string';
process.env.INT = '123';
process.env.FLOAT = '123.456';
process.env.TRUE = 'ok';
process.env.FALSE = 'null';

const options = [
    {
        name: 'simple.single',
        key: 'SIMPLE',
    },
    {
        name: 'simple.multi',
        key: ['__SIMPLE', 'SIMPLE', 'SIMPLE__'],
    },
    {
        name: 'primitive.string',
        key: 'STRING',
        type: 'string',
    },
    {
        name: 'primitive.int',
        key: 'INT',
        type: 'number',
    },
    {
        name: 'primitive.float',
        key: 'FLOAT',
        type: 'number',
    },
    {
        name: 'primitive.true',
        key: 'TRUE',
        type: 'boolean',
    },
    {
        name: 'primitive.false',
        key: 'FALSE',
        type: 'boolean',
    },
    {
        name: 'match.first',
        key: 'SIMPLE',
        type: /^si/,
    },
    {
        name: 'match.last',
        key: 'SIMPLE',
        type: /le$/,
    },
    {
        name: 'enum',
        key: 'SIMPLE',
        type: ['__simple', 'simple', 'simple__'],
    },
];

fpe(options); //returns this:

/*
{
    simple: {
        single: 'simple',
        multi: 'simple',
    },
    primitive: {
        string: 'string',
        int: 123,
        float: 123.456,
        true: true,
        false: false,
    },
    match: {
        first: 'simple',
        last: 'simple',
    },
    enum: 'simple',
}
*/

fpe.raw(options); //returns this:
/*
{
    'simple.single': 'simple',
    'simple.multi': 'simple',
    'primitive.string': 'string',
    'primitive.int': 123,
    'primitive.float': 123.456,
    'primitive.true': true,
    'primitive.false': false,
    'match.first': 'simple',
    'match.last': 'simple',
    enum: 'simple',
}
*/
```

## License

MIT

[npm-url]: https://npmjs.org/package/fpe
[npm-image]: https://badge.fury.io/js/fpe.svg
[travis-url]: https://travis-ci.org/astur/fpe
[travis-image]: https://travis-ci.org/astur/fpe.svg?branch=master