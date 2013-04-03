
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

    // httpSever = http.createServer(function(req, res){
    //     var project1 = require('./rules/project1');
    //         host = req.headers.host,
    //         hostRouter = _.clone(defaultRouter);

    //     _.extend(hostRouter, config.hostRouter);
        
    //     if(hostRouter && hostRouter[host]){
    //         var url = req.url, 
    //             mapRules = config.mapRules, i;

    //         if(!forwardList.exec(url) &&  ~(i = testRules(req.url, config.mapRules))){
    //             console.log('[%s] request %s', req.connection.remoteAddress, url);
    //             var map = mapRules[i];
    //             isHttpType(map.target) ? 
    //                 httpHanlder(req, res, map) : localHanlder(req, res, map)
    //         }else{
    //             var target = hostRouter[host].split(':');
    //             proxy.proxyRequest(req, res, {
    //                 host: target[0] || "127.0.0.1",
    //                 port: target[1] || 80
    //             });
    //         }
    //     }else{
    //         res.end('Please add this domain router in the config file first.');
    //     }
    //     res.writeHead(200, { 'Content-Type': 'text/plain' });
    //     res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
    //     res.end();
    // });
    // httpSever.listen(httpPort);

    httpProxy.createServer(function (req, res, proxy) {
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
        res.end();
        
        // proxy.proxyRequest(req, res, {
        //     host: 'localhost',
        //     port: 9000
        // });
    }).listen(8000);

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
