var url = require('url'),
    fs = require('fs'),
    dns = require('dns');

var httpProxy = require('http-proxy');
var httpProxyAgent = require('http-proxy-agent');

var config = require('../config'),
    liveRequest = require('../request'),
    logger = require('../logger'),
    notify = require('../notify'),
    templateResponder = require('./template');

var global = config.global;

function routeResponder(router, req, res, options) {
    var proxyHost = '';
    var reqInfo = liveRequest.getReqInfo(req);
    router = router || config.getRouter(reqInfo);
    if (router) {
        // directly proxy
        if (router.action == '-') {
            goProxy(req, res, null, options);
        } else {
            // proxy to specified server
            goProxy(req, res, router.action, options);
        }
    } else {
        // directly proxy
        goProxy(req, res, null, options);
    }
};

function goProxy(req, res, router, options) {
    var host, port, hostIp;
    if (router) {
        host = router.split(':')[0];
        port = router.split(':')[1] || '80';
    }
    var urlObj = url.parse(req.url);
    urlObj.host = host || urlObj.hostname;
    urlObj.port = port || urlObj.port;

    // TODO req.connect.remoteAddress -> 127.0.0.1
    // hack -> use dns resolve to get ip of hostname
    // known issue: multi ip don't know which one is used for socket connection
    var re = /(d+).(d+).(d+).(d+)/g;
    if (re.test(urlObj.host)) {
        notify.hostIp(options.sid, req, res, [urlObj.host]);
    } else {
        dns.resolve4(urlObj.host, function(err, address) {
            if (err) throw err;
            notify.hostIp(options.sid, req, res, address);
        });
    }

    // logger.log('req proxied, host:' + host + ', port:' + port + ', url:' + req.url);
    var proxy = httpProxy.createProxyServer({});
    var proxyOptions = {
        target: {
            host: urlObj.host,
            port: urlObj.port
        }
    };
    // TODO: router with a proxy agent has errors
    // router ip should be visit without proxy agent
    if (!router && global.proxy) {
        proxyOptions.agent = httpProxyAgent(global.proxy);
    }
    proxy.web(req, res, proxyOptions, function(e) {
        console.log('[proxy error]: ' + req.url);
        console.log(e.stack);
        res.statusCode = 404;
        templateResponder('404_Plain.dat', req, res);
    });
};

module.exports = routeResponder;
