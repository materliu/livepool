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
livepool.verson = '0.7.1';
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

var ssl = {
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
};

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
        var responder;
        var reqInfo = request.getReqInfo(req);
        var handler = config.getHandler(reqInfo);
        var reqUrl = reqInfo.url;
        var hostname = reqInfo.headers.host.split(':')[0];
        var sid = ++idx;
        var chunks = [];
        var options = {
            sid: sid
        };
        var callback = function(err, body) {
            notify.response(sid, req, res, body);
        };

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
            responder(handler, req, res, options);
        } else {
            // remote route
            responder = responders['route'];
            responder(null, req, res, options);
        }

    });
    httpServer.setMaxListeners(0);
    httpServer.listen(httpPort);

    // directly forward https request
    // TODO support https responders
    httpServer.on('connect', function(req, cltSocket, head) {
        // connect to an origin server
        var srvUrl = require('url').parse('http://' + req.url);
        var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function() {
            cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                'Proxy-agent: LivePool-Proxy\r\n' +
                '\r\n');
            srvSocket.write(head);
            srvSocket.pipe(cltSocket);
            cltSocket.pipe(srvSocket);
        });
    });

    // directly forward websocket 
    // TODO support websocket responders
    httpServer.on('upgrade', function(req, socket, head) {
        socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
            'Upgrade: WebSocket\r\n' +
            'Connection: Upgrade\r\n' +
            '\r\n');

        socket.pipe(socket); // echo back
    });
};

// stop server
livepool.stop = function() {
    if (httpSever) {
        httpSever.close();
    }
};

livepool.run();
