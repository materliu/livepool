var http = require('http'),
    url = require('url'),
    Buffer = require('buffer').Buffer,
    logger = require('../logger');

function remoteResponder(handler, req, res, options) {

    var reqUrl = url.parse(handler.action);
    var buffers = [];
    var options = {
        hostname: reqUrl.hostname,
        port: 80,
        path: reqUrl.pathname,
        method: 'GET'
    };

    var request = http.request(options, function(response) {
        response.pipe(res);
    });

    request.on('error', function(e) {
        logger.log('problem with request: ' + e.message);
    });

    request.end();
}

module.exports = remoteResponder;
