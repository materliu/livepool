
var http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy'),
    proxy = new httpProxy.RoutingProxy(),
    fs = require('fs'),
    net = require('net'),
    url = require('url'),
    _ = require('underscore');

var path = require('path')

var httpServer, httpsServer, https2http;

var livepool = module.exports = {};
livepool.verson = '0.0.1';
livepool.startTime = (new Date()).getTime();

var config = liveRequire('config'),
    logger = liveRequire('logger'),
    util = liveRequire('util'),
    eventCenter = liveRequire('event');

var global = config.global,
    httpPort = global.http,
    httpsPort = global.https,
    proxyAgent = global.proxy || '',
    proxyAgent = proxyAgent.split(':'),
    localName = 'localhost';

function publish(source, methodName, newMethodName) {
    livepool[newMethodName || methodName] = source[methodName].bind(source);
}

function liveRequire(module){
    return livepool[module] = require('./livepool/' + module);
}

livepool.run = function (){
    logger.writeline();
    logger.log('livepool'.cyan + ' is running, port: ' + String(httpPort).cyan);

    var options = {
        key: fs.readFileSync('keys/key.pem'),
        cert: fs.readFileSync('keys/cert.pem')
    };

    var project1 = require('./rules/project1');
    var handler = project1.handler;
    var arr = [];
    var tmp = _.each(handler, function(item){
        item.match = item.match || '';
        var split = item.match.split(/\s+/);
        _.each(split, function(s){
            arr.push({
                base: project1.base,
                match: s.replace(/\./g, '\\.').replace(/\*/g, '.*'),
                action: item.action,
                enabled: item.enabled
            });
        });
    });
    console.log('arr:', arr);
    httpServer = http.createServer(function (req, res){
        var host = req.headers.host;
        var reqUrl = url.parse(req.url);
        var pathname = reqUrl.pathname;

        var find = _.find(arr, function(item){
            return new RegExp(item.match).test(req.url);
        });
        if(find){
            var filepath = path.resolve(find.base, pathname.substring(1));
            console.log(filepath);
            if(fs.existsSync(filepath)){
                var responder = require('./livepool/responder/local');
                responder(filepath, req, res);
            }else{
                proxy.proxyRequest(req, res, {
                    host: proxyAgent[0] || host,
                    port: proxyAgent[1] || 80
                });
            }
        }else{
            proxy.proxyRequest(req, res, {
                host: proxyAgent[0] || host,
                port: proxyAgent[1] || 80
            });
        }
        
        
    }).listen(httpPort);

    https2http = new httpProxy.HttpProxy({
        target: {
            host: localName,
            port: httpPort
        }
    });

    httpsServer = https.createServer(options, function (req, res){
        console.log('https request proxied...');
        https2http.proxyRequest(req, res);
    }).listen(httpsPort);

    proxyHttps();
};

// proxy https request from httpServer to httpsServer, stolen form nproxy
function proxyHttps() {
    httpServer.on('connect', function(req, socket, upgradeHead) {
        var netClient = net.createConnection(httpsPort);

        netClient.on('connect', function() {
            // logger.info('connect to https server successfully!');
            socket.write("HTTP/1.1 200 Connection established\r\nProxy-agent: Netscape-Proxy/1.1\r\n\r\n");
        });

        socket.on('data', function(chunk) {
            netClient.write(chunk);
        });
        socket.on('end', function() {
            netClient.end();
        });
        socket.on('close', function() {
            netClient.end();
        });
        socket.on('error', function(err) {
            logger.error('socket error ' + err.message);
            netClient.end();
        });

        netClient.on('data', function(chunk) {
            socket.write(chunk);
        });
        netClient.on('end', function() {
            socket.end();
        });
        netClient.on('close', function() {
            socket.end();
        });
        netClient.on('error', function(err) {
            logger.error('netClient error ' + err.message);
            socket.end();
        });

    });
};

livepool.stop = function (){
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
