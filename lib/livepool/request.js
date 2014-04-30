var ev = require('./event');

exports.getReqInfo = function(req) {
    ev.emit('beforeRequest', req);
    return req;
};
