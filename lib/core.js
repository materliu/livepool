var http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy'),
    fs = require('fs'),
    net = require('net'),
    path = require('path'),
    _ = require('underscore'),
    zlib = require('zlib');

/**
 * self module requirement
 * @param  {string} module module name
 * @return {object}        livepool singleton
 */

function liveRequire(module) {
    return livepool[module] = require('./livepool/' + module);
};

// livepool module init
var livepool = module.exports = {};
livepool.verson = '0.6.6';
livepool.startTime = (new Date()).getTime();

// self module require
var config = liveRequire('config'),
    logger = liveRequire('logger'),
    util = liveRequire('util'),
    eventCenter = liveRequire('event'),
    request = liveRequire('request'),
    notify = liveRequire('notify'),
    proxy = liveRequire('proxy'),
    response = liveRequire('response');

var responders = require('./livepool/responder');

var global = config.global,
    httpPort = global.http,
    httpsPort = global.https,
    uiport = global.uiport,
    proxyAgent = global.proxy || '',
    proxyAgent = proxyAgent.split(':'),
    localName = '127.0.0.1';

// global 
var httpServer, httpsServer, https2http;
var liveapp;
// request session id seed
var idx = 0;

// var options = {
//     key: fs.readFileSync('keys/key.pem'),
//     cert: fs.readFileSync('keys/cert.pem')
// };

var proxy2Liveapp = new httpProxy.createProxyServer({
    target: {
        host: localName,
        port: uiport
    }
});

function runLiveApp() {
    liveapp = require('./webui/liveapp').app.run();
};

function loadPlugins() {
    require('./plugins/nocache').run(livepool);
};

livepool.run = function() {
    logger.writeline();
    logger.log('livepool'.cyan + ' is running, port: ' + String(httpPort).cyan);

    // 加载替换和路由规则
    config.loadRules();

    // 加载插件
    loadPlugins();

    // 初始化webui
    runLiveApp();

    // 设置系统全局代理
    if (config.settings.proxy) {
        proxy.setProxy(httpPort);
    }

    // http proxy server
    httpServer = http.createServer(function(req, res) {
        var reqInfo = request.getReqInfo(req);
        var handler = config.getHandler(reqInfo);
        var reqUrl = reqInfo.url;
        var hostname = reqInfo.headers.host.split(':')[0];
        var sid = ++idx;
        var chunks = [];

        // notify req
        notify.request(sid, req, res);
        response.getResInfo(res);
        // parse post body
        if (req.method == 'POST') {
            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                notify.reqBody(sid, req, res, body);
            });
        }

        res.on('pipe', function(readStream) {
            // readStream = response.getResInfo(readStream);
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
            // ui app
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

        var callback = function(err, body) {
            notify.response(sid, req, res, body);
        };

    });
    httpServer.setMaxListeners(0);
    httpServer.listen(httpPort);

    // https 
    // httpServer.on('connect', function(req, socket, head) {
    //     console.log()
    //     var domain = require('domain').create();

    //     domain.on('error', function(err) {
    //         console.log(err.stack)
    //     });

    //     domain.add(req);
    //     domain.add(socket);
    //     domain.add(head);

    //     domain.run(function() {
    //         var session = new Session(self, req, socket, head);
    //         session.trigger('connect');
    //     });
    // })

    // // websocket 
    // httpServer.on('upgrade', function(req, socket, head) {
    //     var session = new Session(self, req, socket, head);
    //     session.trigger('upgrade');
    // });

    // https proxy server
    // httpsServer = https.createServer(options, function(req, res) {
    //     console.log('https request proxied...');
    //     var proxy = httpProxy.createProxyServer({});
    //     proxy.web(req, res, {
    //         target: req.url,
    //         ssl: options
    //     });
    // }).listen(httpsPort);

    // proxyHttps();
    // proxyWebSocket();
};

// proxy https request from httpServer to httpsServer, stolen form nproxy
// function proxyHttps() {
//     // relay https to http proxy server 
//     httpServer.on('connect', function(req, socket, upgradeHead) {
//         // console.log(req.method)
//         var netClient = net.createConnection(httpsPort);

//         netClient.on('connect', function() {
//             logger.info('connect to https server successfully!');
//             socket.write("HTTP/1.1 200 Connection established\r\nProxy-agent: Netscape-Proxy/1.1\r\n\r\n");
//         });

//         socket.on('data', function(chunk) {
//             netClient.write(chunk);
//         });
//         socket.on('end', function() {
//             netClient.end();
//         });
//         socket.on('close', function() {
//             netClient.end();
//         });
//         socket.on('error', function(err) {
//             logger.error('socket error ' + err.message);
//             netClient.end();
//         });

//         netClient.on('data', function(chunk) {
//             socket.write(chunk);
//         });
//         netClient.on('end', function() {
//             socket.end();
//         });
//         netClient.on('close', function() {
//             socket.end();
//         });
//         netClient.on('error', function(err) {
//             logger.error('netClient error ' + err.message);
//             socket.end();
//         });

//     });
// };

// function proxyWebSocket() {
//     // relay websocket to http proxy server
//     httpServer.on('upgrade', function(req, socket, head) {
//         console.log('upgrade');
//         console.log(req.url)
//         if (req.url.match(/127.0.0.1:8002/)) {
//             // hack for express router & http-proxy
//             req.url = req.url.replace('http://127.0.0.1:8002', 'ws://127.0.0.1:8002');
//             proxy2Liveapp.ws(req, socket, head);
//         }
//     });
// };

// stop server
livepool.stop = function() {
    if (httpSever) {
        httpSever.close();
    }
};

livepool.run();
