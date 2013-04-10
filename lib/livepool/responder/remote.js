var http = require('http'),
    url = require('url'),
    Buffer = require('buffer').Buffer;
    logger = require('../logger');

function remoteResponder(handler, req, res) {

    var reqUrl = url.parse(handler.action);
    var buffers = [];
    var options = {
        hostname: reqUrl.hostname,
        port: 80,
        path: reqUrl.pathname,
        method: 'GET'
    };

    var request = http.request(options, function(response) {
        response.on('data', function(chunk) {
            buffers.push(chunk);
        });

        response.on('end', function(){
            res.writeHead(200, response.headers);
            res.write(Buffer.concat(buffers));
            res.end();
        });
    });

    request.on('error', function(e) {
        logger.log('problem with request: ' + e.message);
    });

    request.end();
}

module.exports = remoteResponder;
