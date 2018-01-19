const test = require('ava');
const fpe = require('.');

test('fpe', t => {
    t.true(true);
    t.is(fpe, fpe);
});
