
var config = require('../config'),
    request = request('../request');

var proxy = new httpProxy.RoutingProxy();

var global = config.global,
    proxyAgent = global.proxy || '',
    proxyAgent = proxyAgent.split(':');

function routeResponder(router, req, res){
    logger.log('req proxied: ' + reqUrl.grey);
    
    var host = req.headers.host;
    var reqInfo = request.getReqInfo(req);
    router = router || config.getRouter(reqInfo);
    
    if(router){
        // proxy to specified server
        if(router)
    }else{
        // directly proxy
        goProxy(req, res, proxyAgent[0], proxyAgent[1]);
        proxy.proxyRequest(req, res, {
            host: proxyAgent[0] || host,
            port: proxyAgent[1] || 80
        });    
    }
};

function goProxy = function(req, res, host, port){

};

module.exports = routeResponder;