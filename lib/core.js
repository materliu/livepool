var http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    net = require('net'),
    path = require('path'),
    _ = require('underscore'),
    zlib = require('zlib');

var responders = require('./livepool/responder');

var httpServer, httpsServer, https2http;

var livepool = module.exports = {};
livepool.verson = '0.0.3';
livepool.startTime = (new Date()).getTime();
var liveapp, uiapp;

var config = liveRequire('config'),
    logger = liveRequire('logger'),
    util = liveRequire('util'),
    eventCenter = liveRequire('event'),
    request = liveRequire('request'),
    notify = liveRequire('notify'),
    response = liveRequire('response');

var global = config.global,
    httpPort = global.http,
    httpsPort = global.https,
    uiport = global.uiport,
    proxyAgent = global.proxy || '',
    proxyAgent = proxyAgent.split(':'),
    localName = '127.0.0.1';

// var randomToken = Math.floor(Math.random()*10+1);
var idx = 0;
// var sessionId;

var proxy2Liveapp = new httpProxy.createProxyServer({
    target: {
        host: localName,
        port: uiport
    }
});

function publish(source, methodName, newMethodName) {
    livepool[newMethodName || methodName] = source[methodName].bind(source);
}

function liveRequire(module) {
    return livepool[module] = require('./livepool/' + module);
}

livepool.run = function() {
    logger.log('livepool'.cyan + ' is running, port: ' + String(httpPort).cyan);

    // 加载替换和路由规则
    config.init(eventCenter);
    config.loadRules();

    // 初始化webui
    runLiveApp();

    var options = {
        key: fs.readFileSync('keys/key.pem'),
        cert: fs.readFileSync('keys/cert.pem')
    };

    httpServer = http.createServer(function(req, res) {
        var reqInfo = request.getReqInfo(req);
        var handler = config.getHandler(reqInfo);
        var reqUrl = reqInfo.url;
        var hostname = reqInfo.headers.host.split(':')[0];

        var sid = ++idx;
        notify.request(sid, req, res);

        if (!res.socket || res.socket.destroyed) {
            console.warn('client socket closed,oop!');
            return res.end();
        }

        res.on('pipe', function(readStream) {
            readStream.on('data', function(chunk) {
                chunks.push(chunk);
                res.write(chunk);
            });
            readStream.on('end', function() {
                var headers = readStream.headers || [];
                var buffer = Buffer.concat(chunks);
                var encoding = headers['content-encoding'];
                if (encoding == 'gzip') {
                    zlib.gunzip(buffer, function(err, decoded) {
                        callback(err, decoded && decoded.toString('binary'));
                    });
                } else if (encoding == 'deflate') {
                    zlib.inflate(buffer, function(err, decoded) {
                        callback(err, decoded && decoded.toString('binary'));
                    });
                } else {
                    callback(null, buffer.toString('binary'));
                }
            });
        });

        if (reqUrl.match(/127.0.0.1:8002/)) {
            // uiapp
            proxy2Liveapp.web(req, res);
        } else if ((hostname != 'localhost') && handler && (responder = responders[handler.respond.type])) {
            // local replacement
            logger.log('req handler [ ' + handler.respond.type.grey + ' ]: ' + reqUrl.grey);
            responder(handler, req, res);
        } else {
            // remote route
            responder = responders['route'];
            responder(null, req, res);
        }

        var chunks = [];
        var callback = function(err, body) {
            notify.response(sid, req, res, body);
        };


    }).listen(httpPort);

    httpsServer = https.createServer(options, function(req, res) {
        console.log('https request proxied...');
        var proxy = httpProxy.createProxyServer({});
        proxy.web(req, res, {
            target: req.url,
            ssl: options
        });
    }).listen(httpsPort);

    // proxyHttps();
    // proxyWebSocket();
};

// proxy https request from httpServer to httpsServer, stolen form nproxy

function proxyHttps() {
    httpServer.on('connect', function(req, socket, upgradeHead) {
        // console.log(req.method)
        var netClient = net.createConnection(httpsPort);

        netClient.on('connect', function() {
            logger.info('connect to https server successfully!');
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

function proxyWebSocket() {
    httpServer.on('upgrade', function(req, socket, head) {
        console.log('upgrade');
        console.log(req.url)
        if (req.url.match(/127.0.0.1:8002/)) {
            // hack for express router & http-proxy
            req.url = req.url.replace('http://127.0.0.1:8002', 'ws://127.0.0.1:8002');
            proxy2Liveapp.ws(req, socket, head);
        }
    });
}

function runLiveApp() {
    liveapp = require('./webui/liveapp');
    uiapp = liveapp.app;
}

livepool.stop = function() {
    if (httpSever) {
        httpSever.close();
    }
};

livepool.run();

// var pro = require('child_process');
// pro.exec('ulimit -n 2048');
// pro.exec('ulimit -u 2048');

// process.stdin.resume();
// process.stdin.setEncoding('utf8');

// process.stdin.on('data', function (chunk){
//     if(chunk == "stop\r\n"){
//         livepool.stop();
//         process.exit(1);
//     }
// });

// process.stdin.on('end', function () {
//     process.stdout.write('end');
// });
