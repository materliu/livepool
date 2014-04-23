var httpProxy = require('http-proxy');
var request = require('request');

var config = require('../config'),
    liveRequest = require('../request'),
    logger = require('../logger'),
    notify = require('../notify'),
    templateResponder = require('./template'),
    url = require('url'),
    fs = require('fs');

var global = config.global,
    proxyAgent = global.proxy || '',
    proxyAgent = proxyAgent.split(':');

var r = null;
if (global.proxy) {
    r = request.defaults({
        'proxy': global.proxy
    });
}

function routeResponder(router, req, res) {
    var proxyHost = '';
    var reqInfo = liveRequest.getReqInfo(req);
    router = router || config.getRouter(reqInfo);
    if (router) {
        // directly proxy
        if (router.action == '-') {
            goProxy(req, res);
        } else {
            // proxy to specified server
            goProxy(req, res, router.action);
        }
    } else {
        // directly proxy
        goProxy(req, res);
    }
};

function goProxy(req, res, router) {
    var host, port;
    if (router) {
        host = proxy.split(':')[0];
        port = proxy.split(':')[1];
    }
    var urlObj = url.parse(req.url);
    urlObj.host = proxyAgent[0] || host || urlObj.host;
    urlObj.port = proxyAgent[1] || port || urlObj.port;
    // req.url = urlObj.protocol + '//' + proxyAgent[0] + urlObj.path;
    // logger.log('req proxied, host:' + host + ', port:' + port + ', url:' + req.url);
    var proxy = httpProxy.createProxyServer({});
    proxy.web(req, res, {
        target: urlObj
    }, function(e) {
        console.log('[proxy error]: ' + req.url);
        console.log(e.stack);
        res.statusCode = 404;
        templateResponder('404_Plain.dat', req, res);
    });

    // var body = '';
    // req.on('data', function(data) {
    //     body += data;
    // });
    // req.on('end', function() {
    //     var options = {
    //         url: req.url,
    //         method: req.method,
    //         headers: req.headers,
    //         body: body
    //     };
    //     r(options).pipe(res);
    // });
};

module.exports = routeResponder;
