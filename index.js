const {validKeys, unflatten} = require('ofl');
const _ = require('easytype');

const conv = (value, type) => value;

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
