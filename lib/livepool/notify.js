var liveapp = require('../webui/liveapp'),
    config = require('./config'),
    util = require('./util'),
    ev = require('./event'),
    url = require('url'),
    mime = require('mime'),
    path = require('path'),
    qs = require('querystring'),
    fs = require('graceful-fs'),
    _ = require('underscore');

var exec = require('child_process').exec;
var iconv = require('iconv-lite');

var socket, sid;
var queue = [];

var checkUrl = function(_url) {
    if (_url.indexOf('.') >= 0) {
        return true;
    }
    return false;
};

var ticker = setInterval(function() {
    if (queue.length) {
        socket = liveapp.socket;
        // 合并提高性能
        if (socket) {
            var rsReq = {
                type: 'req',
                rows: []
            };
            var rsRes = {
                type: 'res',
                rows: []
            };
            _.each(queue, function(item) {
                if (item.type == 'req') {
                    rsReq.rows = rsReq.rows.concat(item.rows);
                } else {
                    var obj = _.find(rsReq.rows, function(row) {
                        item.rows[0].id == row.id;
                    });
                    if (obj) {
                        obj.result = row.result;
                        obj.body = row.body;
                        obj.contentType = row.contentType;
                        obj.caching = row.caching;
                        obj.resHeaders = row.resHeaders;
                    } else {
                        rsRes.rows = rsRes.rows.concat(item.rows);
                    }
                }
            });
            var rs = [rsReq, rsRes];
            // console.log(rs);
            socket.emit('proxy', rs);
            // socket.emit('proxy', queue);
            queue = [];
        }
    }
}, 2500);

exports.request = function(id, req, res) {
    socket = liveapp.socket;
    if (socket && checkUrl(req.url)) {
        var urlObject = url.parse(req.url);
        urlObject.protocol = urlObject.protocol || 'HTTP:';
        sid = socket.id + '_' + id;

        ev.emit('beforeNotifyRequest', req);

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
                req: {
                    method: req.method,
                    httpVersion: req.httpVersion
                },
                reqHeaders: req.headers,
                reqTime: +new Date()
            }]
        });

        var headerPath = path.join(config.global.tempDir, socket.id, id + '_c.txt');
        fs.writeFile(headerPath, JSON.stringify(req.headers, null, 4), 'binary', function(err) {
            if (err) throw err;
        });
    }
};

exports.response = function(id, req, res, body) {
    socket = liveapp.socket;
    if (socket && checkUrl(req.url)) {
        var urlObject = url.parse(req.url);
        var expires = res.getHeader('expires');
        sid = socket.id + '_' + id;
        // console.log(res);
        var row = {
            id: sid,
            result: res.statusCode,
            body: res.getHeader('content-length') || body.length || 0,
            caching: (res.getHeader('cache-control') || '') + (expires ? '; expires:' + res.getHeader('expires') : ''),
            contentType: res.getHeader('content-type') || mime.lookup(urlObject.pathname),
            resHeaders: res._headers,
            resTime: +new Date()
        };
        queue.push({
            type: 'res',
            rows: [row]
        });

        var headerPath = path.join(config.global.tempDir, socket.id, id + '_s.txt');
        fs.writeFile(headerPath, res._header, 'binary', function(err) {
            if (err) throw err;
        });

        var bodyPath = path.join(config.global.tempDir, socket.id, id + '_b.txt');
        fs.writeFile(bodyPath, body, 'binary', function(err) {
            if (err) throw err;
        });

        // site sucker 
        if (config.settings.keep) {
            var pathname = urlObject.pathname;
            // fix site index
            if (pathname == '/') {
                pathname += 'index.html';
            }
            // fix pathname
            var extname = path.extname(pathname);
            if (extname == '') {
                body.indexOf('<!') >= 0 ? pathname += '.html' : pathname += '.json';
            }
            var filepath = path.join(config.global.siteDir, urlObject.hostname, pathname);
            var basepath = path.dirname(filepath);
            var ctype = row.contentType;
            var bodyFilepath = config.global.tempDir + socket.id + '/' + id + '_b.txt';

            util.mkdirpSync(basepath);

            function writeFile(content, coding) {
                coding = coding || 'binary';
                fs.writeFile(filepath, content, coding, function(err) {
                    if (err) throw err;
                });
            }
            // beautify js/css
            if (ctype.indexOf('javascript') >= 0 || ctype.indexOf('css') >= 0) {
                var _body = iconv.decode(body, 'utf-8');
                // 编码不对试着用GBK编码
                if (_body.indexOf('�') != -1) {
                    _body = iconv.decode(body, 'gbk');
                    fs.writeFileSync(bodyFilepath, _body);
                }

                var type = '.js';
                if (ctype.indexOf('css') >= 0) {
                    type = '.css';
                }
                var cmd = 'node ';
                var ctypepath = bodyFilepath + type;
                var args = [
                    './lib/tools/beautify/scripts/run.js',
                    bodyFilepath,
                    ctypepath
                ];
                exec(cmd + args.join(' '), {
                    maxBuffer: 2000000 * 1024
                }, function(err, stdout, stderr) {
                    if (err) throw err;
                    writeFile(stdout, 'utf-8');
                });
            } else {
                writeFile(body);
            }
        }
    }
};

exports.reqBody = function(id, req, res, body) {
    socket = liveapp.socket;
    if (socket && checkUrl(req.url)) {
        // only support x-www-form-urlencoded post body
        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            try {

                sid = socket.id + '_' + id;
                queue.push({
                    type: 'res',
                    rows: [{
                        id: sid,
                        // escape to fix not standard urlencoded data
                        reqBody: qs.escape(body)
                    }]
                });
            } catch (e) {

            }
        }
    }
};

exports.hostIp = function(id, req, res, ip) {
    socket = liveapp.socket;
    if (socket) {
        sid = socket.id + '_' + id;
        queue.push({
            type: 'res',
            rows: [{
                id: sid,
                hostIp: ip
            }]
        });
    }
};

exports.log = function(msg) {
    socket = liveapp.socket;
    if (socket) {
        socket.emit('log', msg);
    }
};
