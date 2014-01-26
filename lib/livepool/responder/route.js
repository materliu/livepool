
var config = require('../config'),
    request = require('../request'),
    logger = require('../logger');

var httpProxy = require('http-proxy');

var global = config.global,
    proxyAgent = global.proxy || '',
    proxyAgent = proxyAgent.split(':');

function routeResponder(router, req, res){
    
    var proxyHost = '';
    var reqInfo = request.getReqInfo(req);
    router = router || config.getRouter(reqInfo);
    if(router){
        // proxy to specified server
        // directly proxy
        if(router.action == '-'){
            goProxy(req, res);
        }else{
            proxyHost = router.action.split(':');
            goProxy(req, res, proxyHost[0], proxyHost[1]);
        }
    }else{
        // directly proxy
        goProxy(req, res);
    }
};

function goProxy(req, res, host, port){
    var dhost = req.headers.host.split(':');
    host = proxyAgent[0] || host || dhost[0] || '127.0.0.1';
    port = proxyAgent[1] || port || dhost[1] || 80;
    logger.log('req proxied, host:' + host + ', port:' + port + ', url:' + req.url);
    // proxy.proxyRequest(req, res, {
    //     host: host,
    //     port: port
    // });
    var proxy = httpProxy.createProxyServer({});
    proxy.web(req, res, {
        target: {
            host: host,
            port: port
        }
    });
};

module.exports = routeResponder;