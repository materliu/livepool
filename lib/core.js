var http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy'),
    proxy = new httpProxy.RoutingProxy(),
    fs = require('fs'),
    net = require('net'),
    httpServer, httpsServer, https2http;

var livepool = module.exports = {};
livepool.verson = '0.0.1';
livepool.startTime = (new Date()).getTime();

var config = liveRequire('config'),
    logger = liveRequire('logger'),
    util = liveRequire('util');

var httpPort = config.http,
    httpsPort = config.https,
    proxyPort = config.proxy;

var localServer = 'localhost';
    

function publish(source, methodName, newMethodName) {
    livepool[newMethodName || methodName] = source[methodName].bind(source);
}

function liveRequire(module) {
    return livepool[module] = require('./livepool/' + module);
}

livepool.run = function() {
    var options = {
        https: {
            key: fs.readFileSync('lib/keys/key.pem', 'utf8'),
            cert: fs.readFileSync('lib/keys/cert.pem', 'utf8')
        }
    };

    logger.writeline();
    logger.log('livepool'.cyan + ' is running, port: ' + String(httpPort).cyan);

    https2http = new httpProxy.HttpProxy({
        target:{
            host: localServer,
            port: httpPort
        }
    });

    httpServer = http.createServer(function(req, res) {
        var project1 = require('./rules/project1');
            host = req.headers.host,
        //     hostRouter = _.clone(defaultRouter);

        // _.extend(hostRouter, config.hostRouter);
        console.log(req.url)
        proxy.proxyRequest(req, res, {
            host: host || localServer,
            port: 80
        });
        // if(hostRouter && hostRouter[host]){
        //     var url = req.url, 
        //         mapRules = config.mapRules, i;

        //     if(!forwardList.exec(url) &&  ~(i = testRules(req.url, config.mapRules))){
        //         console.log('[%s] request %s', req.connection.remoteAddress, url);
        //         var map = mapRules[i];
        //         isHttpType(map.target) ? 
        //             httpHanlder(req, res, map) : localHanlder(req, res, map)
        //     }else{
        //         var target = hostRouter[host].split(':');
        //         proxy.proxyRequest(req, res, {
        //             host: target[0] || "127.0.0.1",
        //             port: target[1] || 80
        //         });
        //     }
        // }else{
        //     res.end('Please add this domain router in the config file first.');
        // }
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain'
        // });
        // res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
        // res.end();
    });
    httpServer.listen(httpPort);

    httpsServer = https.createServer(options.https, function(req, res) {
        https2http.proxyRequest(req, res);
    });
    httpsServer.listen(httpsPort);

    proxyHttps();

};

function proxyHttps() {
    httpServer.on('connect', function(req, socket, upgradeHead) {
        var netClient = net.createConnection(8001);

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

livepool.stop = function() {
    if (httpSever) {
        httpSever.close();
    }
};

livepool.run();

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
    if(chunk == "stop\r\n") {
        livepool.stop();
        process.exit(1);
    }
});

process.stdin.on('end', function() {
    process.stdout.write('end');
});
