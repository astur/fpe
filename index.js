const {validKeys, unflatten} = require('ofl');
const _ = require('easytype');
const ce = require('c-e');

const MatchError = ce('MatchError', TypeError);
const EnumError = ce('EnumError', TypeError);
const NumberTypeError = ce('NumberTypeError', TypeError);
const BooleanTypeError = ce('BooleanTypeError', TypeError);

const conv = (value, type) => {
    type = ({
        Array: () => ['enum', type],
        RegExp: () => ['match', type],
    }[_(type)] || (() => [type, null]))();

    return ({
        string: () => value,
        number: () => {
            const v = +value;
            if(isNaN(v)) throw new NumberTypeError(`Wrong number value: ${value}`);
            return v;
        },
        boolean: () => {
            if(['true', 'ok', 'on', 'yes'].includes(value)) return true;
            if(['false', 'null', 'off', 'no'].includes(value)) return false;
            throw new BooleanTypeError(`Wrong boolean value: ${value}`);
        },
        enum: () => {
            if(type[1].includes(value)) return value;
            throw new EnumError(`Invalid value: ${value}`);
        },
        match: () => {
            if(type[1].test(value)) return value;
            throw new MatchError(`Invalid value: ${value}`);
        },
    }[type[0] || 'string'] || (() => {
            throw new TypeError(`Wrong type: ${type[0]}`);
        })
    )();
};

const fpe = (options, raw) => {
    const result = {};
    validKeys(options.map(v => v.name));
    options.forEach((v, i, a) => {
        if(!_.isArray(v.key)) v.key = [v.key];
        v.key = v.key.find(k => process.env[k]);
        if(v.key){
            result[v.name] = conv(process.env[v.key], v.type);
        }
    });
    return raw ? result : unflatten(result);
};

module.exports = options => fpe(options, false);
module.exports.raw = options => fpe(options, true);
