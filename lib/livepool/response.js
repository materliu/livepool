var ev = require('./event');
exports.getResInfo = function(res) {
    ev.emit('beforeResponse', res);
    return res;
};
