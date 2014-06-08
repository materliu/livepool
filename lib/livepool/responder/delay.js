var responders = {
    combo: require('./combo'),
    local: require('./local'),
    qzmin: require('./qzmin'),
    remote: require('./remote'),
    route: require('./route'),
    template: require('./template')
};
var logger = require('../logger');
var config = require('../config');
var responder;

function delayResponder(handler, req, res, options) {
    options = options || {};
    var reqUrl = req.url;
    var delay = handler.respond.delay || 0;

    logger.log('delay[' + delay + ']: ' + reqUrl);

    setTimeout(function() {
        var handler = config.getHandler(req, false);
        if (handler && (responder = responders[handler.respond.type])) {
            // local replacement
            logger.log('delay: req handler [ ' + handler.respond.type.grey + ' ]: ' + reqUrl.grey);
            responder(handler, req, res, options);
        } else {
            // remote route
            responder = responders['route'];
            responder(null, req, res, options);
        }
    }, delay * 1000);
};

module.exports = delayResponder;
