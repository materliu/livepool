
var liveapp = require('../webui/liveapp'),
    config = require('./config'),
    url = require('url'),
    mime = require('mime'),
    path = require('path'),
    fs = require('fs');

var socket, sid;
var queue = [];

var ticker = setInterval(function(){
    if(queue.length){
        socket = liveapp.socket;
        if(socket){
            socket.emit('proxy', queue);
            queue = [];
        }
    }
}, 2000);

exports.request = function(id, req, res){
    socket = liveapp.socket;
    if(socket){
        var urlObject = url.parse(req.url);
        sid = socket.id + '_' + id;
        queue.push({
            type: 'req',
            rows: [{
                id: sid,
                idx: id,
                result: '-',
                protocol: urlObject.protocol.replace(':', '').toUpperCase(),
                host: req.headers.host,
                url: req.url,
                path: urlObject.path,
                pathname: urlObject.pathname,
                reqHeaders: req.headers
            }]
        });

        // fs.writeFile(config.global.tempDir + id + '_c.txt', req.headers, 'binary', function (err) {
        //     if (err) throw err;
        // });
    }  
};

exports.response = function(id, req, res, body){
    socket = liveapp.socket;
    if(socket){
        var urlObject = url.parse(req.url);
        var expires = res.getHeader('expires');
        sid = socket.id + '_' + id;
        queue.push({
            type: 'res',
            rows: [{
                id: sid,
                result: res.statusCode,
                body: res.getHeader('content-length') || body.length || 0,
                caching: (res.getHeader('cache-control') || '') + (expires ? '; expires:' + res.getHeader('expires') : ''),
                contentType: res.getHeader('content-type') || mime.lookup(urlObject.pathname),
                resHeaders: res._headers
            }]
        });

        fs.writeFile(config.global.tempDir + socket.id + '/' + id + '_s.txt', body, 'binary', function (err) {
            if (err) throw err;
        });

        fs.writeFile(config.global.tempDir + socket.id + '/' + id + '_b.txt', body, 'binary', function (err) {
            if (err) throw err;
        });
    }
};

