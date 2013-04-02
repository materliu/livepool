
var http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = new httpProxy.RoutingProxy(),
    httpSever;

var livepool = module.exports = {};
livepool.verson = '0.0.1';
livepool.startTime = (new Date()).getTime();

var config = liveRequire('config'),
    logger = liveRequire('logger'),
    util = liveRequire('util');

function publish(source, methodName, newMethodName) {
    livepool[newMethodName || methodName] = source[methodName].bind(source);
}

function liveRequire(module){
    return livepool[module] = require('./livepool/' + module);
}

livepool.run = function(){
    var httpPort = config.http,
        proxyPort = config.proxy;

    logger.writeline();
    logger.log('livepool'.cyan + ' is running, port: ' + String(httpPort).cyan);

    httpSever = http.createServer(function(req, res){
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
        res.end();
    });
    httpSever.listen(httpPort);
};

livepool.stop = function(){
    if(httpSever){
        httpSever.close();
    }
};

livepool.run();

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk){
    if(chunk == "stop\r\n"){
        livepool.stop();
        process.exit(1);
    }
});

process.stdin.on('end', function () {
    process.stdout.write('end');
});
