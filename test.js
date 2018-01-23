const test = require('ava');
const fpe = require('.');

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

test('nested', t => {
    t.deepEqual(fpe(options), {
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
    });
});

test('raw', t => {
    t.deepEqual(fpe.raw(options), {
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
    });
});

test('errors', t => {
    t.throws(() => fpe([
        {name: 'foo'},
        {name: 'foo'},
    ]));
    t.throws(() => fpe([
        {name: 'foo'},
        {name: 'foo.bar'},
    ]));
    t.throws(() => fpe([
        {
            name: 'foo',
            key: 'SIMPLE',
            type: 'number',
        },
    ]));
    t.throws(() => fpe([
        {
            name: 'foo',
            key: 'SIMPLE',
            type: 'boolean',
        },
    ]));
    t.throws(() => fpe([
        {
            name: 'foo',
            key: 'SIMPLE',
            type: ['bar', 'baz'],
        },
    ]));
    t.throws(() => fpe([
        {
            name: 'foo',
            key: 'SIMPLE',
            type: /^wrong$/,
        },
    ]));
    t.throws(() => fpe([
        {
            name: 'foo',
            key: 'SIMPLE',
            type: 'wrong',
        },
    ]));
});
