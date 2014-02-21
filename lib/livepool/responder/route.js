
var config = require('../config'),
    request = require('../request'),
    logger = require('../logger'),
    notify = require('../notify');

var httpProxy = require('http-proxy');
var fs = require('fs');
// var stream503 = fs.createReadStream(__dirname + '/../../template/503_ProxyError.dat');

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
var Buffer = require('buffer').Buffer;

function goProxy(req, res, host, port){
    var dhost = req.headers.host.split(':');
    host = proxyAgent[0] || host || dhost[0] || '127.0.0.1';
    port = proxyAgent[1] || port || dhost[1] || 80;
    // logger.log('req proxied, host:' + host + ', port:' + port + ', url:' + req.url);
    var proxy = httpProxy.createProxyServer({});
    proxy.web(req, res, {
        target: {
            host: host,
            port: port
        }
    }, function(e){
        console.log(host);console.log(port)
        console.log('[proxy error]: ' + req.url);
        console.log(e);
        res.statusCode = 503;
        res.write('proxy error!');
        res.end();
    });
};

module.exports = routeResponder;