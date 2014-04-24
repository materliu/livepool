var url = require('url'),
    fs = require('fs');

var httpProxy = require('http-proxy');
var httpProxyAgent = require('http-proxy-agent');

var config = require('../config'),
    liveRequest = require('../request'),
    logger = require('../logger'),
    notify = require('../notify'),
    templateResponder = require('./template');

var global = config.global;

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
        host = router.split(':')[0];
        port = router.split(':')[1] || '80';
    }
    var urlObj = url.parse(req.url);
    urlObj.host = host || urlObj.host;
    urlObj.port = port || urlObj.port;
    // logger.log('req proxied, host:' + host + ', port:' + port + ', url:' + req.url);
    var proxy = httpProxy.createProxyServer({});
    var options = {
        target: {
            host: urlObj.host,
            port: urlObj.port
        }
    };
    // TODO: router with a proxy agent has errors
    // router ip should be visit without proxy agent
    if (!router && global.proxy) {
        options.agent = httpProxyAgent(global.proxy);
    }
    proxy.web(req, res, options, function(e) {
        console.log('[proxy error]: ' + req.url);
        console.log(e.stack);
        res.statusCode = 404;
        templateResponder('404_Plain.dat', req, res);
    });
};

module.exports = routeResponder;
