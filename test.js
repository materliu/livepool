var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    httpProxy = require('http-proxy');

var net = require('net');

var options = {
  https: {
    key: fs.readFileSync('keys/CA.crt', 'utf8'),
    cert: fs.readFileSync('keys/cacert.pem', 'utf8')
  }
};

// var server = require('http').createServer(function(req, res) {
//   var proxy = httpProxy.createProxyServer({});
//   proxy.web(req, res, {
//     target: req.url
//   });
// }).listen(8090);

// proxyHttps();

// // proxy https request from httpServer to httpsServer, stolen form nproxy
// function proxyHttps() {
//     server.on('connect', function(req, socket, upgradeHead) {
//         console.log(req.method)
//         var netClient = net.createConnection(8091);

//         netClient.on('connect', function() {
//             // logger.info('connect to https server successfully!');
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
//             // logger.error('socket error ' + err.message);
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
//             // logger.error('netClient error ' + err.message);
//             socket.end();
//         });

//     });
// };

// var httpsServer = https.createServer(options.https, function (req, res){
//     console.log('https request proxied...');
//     // https2http.proxyRequest(req, res);
//       var proxy = httpProxy.createProxyServer({});
//   proxy.web(req, res, {
//     target: req.url,
//     ssl: options.https
//   });
// }).listen(8091);

// server.on('connect', function(req, res, head){
//   // var proxy = httpProxy.createProxyServer({});
//   // proxy.web(req, res, {
//   //   target: req.url,
//   //   ssl: options.ssl
//   // });
  
// });

// httpProxy.createProxyServer({
//   target:'http://localhost:9000',
//   // ssl:options.https,
//   // ws:true,
//   // secure:true
// }).listen(8090);
// http.createServer(function (req, res) {
//   console.log(req.url);
//   // res.writeHead(200, { 'Content-Type': 'text/plain' });
//   // res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
//   // res.end();
//   var proxy = httpProxy.createProxyServer({});
//   proxy.web(req, res, {
//     target: req.url
//   });
// }).listen(9000);

var http = require('http'),
    httpProxy = require('http-proxy');
//
// Create your proxy server and set the target in the options.
//
httpProxy.createProxyServer({target:'http://localhost:9000'}).listen(8090);

//
// Create your target server
//
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);

process.on('uncaughtException', function(err) {
    console.log('uncaughtException: ' + (err.stack || err));
});