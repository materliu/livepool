
var liveapp = require('../webui/liveapp'),
    url = require('url'),
    mime = require('mime');

var socket, sid;
exports.request = function(id, req, res){
    socket = liveapp.socket;
    if(socket){
        var urlObject = url.parse(req.url);
        sid = socket.id + '_' + id;
        socket.emit('req', {
            rows: [{
                id: sid,
                result: '-',
                protocol: urlObject.protocol.replace(':', '').toUpperCase(),
                host: req.headers.host,
                url: urlObject.path
            }]
        })
    }  
};

exports.response = function(id, req, res){
    socket = liveapp.socket;
    if(socket){
        var urlObject = url.parse(req.url);
        var expires =res.getHeader('expires');
        sid = socket.id + '_' + id;
        socket.emit('res', {
            rows: [{
                id: sid,
                result: res.statusCode,
                body: '',
                caching: (res.getHeader('cache-control') || '') + (expires ? '; expires:' + res.getHeader('expires') : ''),
                contentType: res.getHeader('content-type') || mime.lookup(urlObject.pathname)
            }]
        })
    }
};
