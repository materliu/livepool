
var config = require('../config'),
    request = require('../request'),
    logger = require('../logger'),
    notify = require('../notify');
var reqestUtil = require('request');

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
var Buffer = require('buffer').Buffer;

function goProxy(req, res, host, port){
    var dhost = req.headers.host.split(':');
    host = proxyAgent[0] || host || dhost[0] || '127.0.0.1';
    port = proxyAgent[1] || port || dhost[1] || 80;
    logger.log('req proxied, host:' + host + ', port:' + port + ', url:' + req.url);
    var proxy = httpProxy.createProxyServer({});
    proxy.web(req, res, {
        target: {
            host: host,
            port: port
        }
    }, function(e){
        console.log('http-proxy proxied error!');
    });

//     var options = {
//       url: req.url,
//       method: req.method,
//       headers: req.headers
//     }
//     var buffers = [];

//     if(req.method === 'POST'){
//       req.on('data', function(chunk){
//         buffers.push(chunk);
//       });

//       req.on('end', function(){
//         options.data = Buffer.concat(buffers);
//         reqestUtil.post(options, function(err, proxyRes, body){
//           _forwardHandler(err, body, proxyRes, res);
//         });
//       });
//     }else{
//       reqestUtil.get(options, function(err, proxyRes, body){
//         _forwardHandler(err, body, proxyRes, res)
//       }); 
//     }
};

function _forwardHandler(err, body, proxyRes, res){
  if(err){
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(proxyRes.statusCode, proxyRes.headers);
  res.write(body);
  res.end();
}

module.exports = routeResponder;