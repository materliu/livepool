var config = require('../config'),
    request = require('../request'),
    logger = require('../logger'),
    notify = require('../notify'),
    url = require('url');

var templateResponder = require('./template');

var httpProxy = require('http-proxy');
var fs = require('fs');
// var stream503 = fs.createReadStream(__dirname + '/../../template/503_ProxyError.dat');

var global = config.global,
    proxyAgent = global.proxy || '',
    proxyAgent = proxyAgent.split(':');

function routeResponder(router, req, res) {

    var proxyHost = '';
    var reqInfo = request.getReqInfo(req);
    router = router || config.getRouter(reqInfo);
    if (router) {
        // proxy to specified server
        // directly proxy
        if (router.action == '-') {
            goProxy(req, res);
        } else {
            proxyHost = router.action.split(':');
            goProxy(req, res, proxyHost[0], proxyHost[1]);
        }
    } else {
        // directly proxy
        goProxy(req, res);
    }
};

var dns = require('dns');
// dns error
// https://github.com/joyent/node/issues/5545

function goProxy(req, res, host, port) {
    // var dhost = req.headers.host.split(':');
    var urlObj = url.parse(req.url);
    urlObj.host = proxyAgent[0] || host || urlObj.host;
    urlObj.port = proxyAgent[1] || port || urlObj.port;
    // logger.log('req proxied, host:' + host + ', port:' + port + ', url:' + req.url);
    var proxy = httpProxy.createProxyServer({});
    // Error: connect EMFILE
    // ulimit -a
    // http://stackoverflow.com/questions/34588/how-do-i-change-the-number-of-open-files-limit-in-linux
    // http://cnodejs.org/topic/4fb7d90506f43b56112e545e
    // http://www.blakerobertson.com/devlog/2014/1/11/how-to-determine-whats-causing-error-connect-emfile-nodejs.html
    var proxying = function(address) {
        urlObj.host = address;
        urlObj.hostname = address;
        // req.headers['host'] = address;
        proxy.web(req, res, {
            target: urlObj,
            agent: false
        }, function(e) {
            console.log('[proxy error]: ' + req.url);
            console.log(e.stack);
            res.statusCode = 404;
            templateResponder('404_Plain.dat', req, res);
        });
    };

    // ip: not to dns resolve4
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //正则表达式     
    if (re.test(urlObj.hostname)) {
        proxying.apply(this, [urlObj.hostname]);
    } else {
        dns.resolve4(urlObj.hostname, function(e, addresses) {
            if (e) {
                dns.resolve4(urlObj.hostname, function(e, addresses) {
                    if (e) {
                        throw e;
                    } else {
                        proxying.apply(this, [addresses[0]]);
                    }
                });
            } else {
                proxying.apply(this, [addresses[0]]);
            }
        });
    }
};

module.exports = routeResponder;
