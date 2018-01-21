const {validKeys, unflatten} = require('ofl');
const _ = require('easytype');

const conv = (value, type) => {
    type = ({
        Array: () => ['enum', type],
        RegExp: () => ['match', type],
    }[_(type)] || (() => [type, null]))();

    return ({
        string: () => value,
        number: () => +value,
        boolean: () => !!value,
        enum: () => type[1].includes(value) ? value : 'ENUM ERROR!',
        match: () => type[1].test(value) ? value : 'MATCH ERROR!',
    }[type[0] || 'string'] || (() => 'WRONG TYPE!'))();
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
