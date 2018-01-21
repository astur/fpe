const {validKeys, flatten} = require('ofl');

const conv = (value, type) => value;

const fpe = (options, raw) => {
    const result = {};
    validKeys(options.map(v => v.name));
    options.forEach((v, i, a) => {
        if(v.key in process.env){
            result[v.name] = conv(process.env[v.key], v.type);
        }
    });
    return raw ? result : flatten(result);
};

module.exports = options => fpe(options, false);
module.exports.raw = options => fpe(options, true);
