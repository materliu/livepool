var path = require('path');
var fs = require('fs');
var mime = require('mime');
var config = require('../../livepool/config');
var liveapp = require('../liveapp');
var other = require('./other');
var that = exports;
var iconv = require('iconv-lite');

var imageTypes = [
    'image/bmp',
    'image/jpeg',
    'image/png',
    'image/x-icon',
    'image/webp',
    'image/tiff',
    'image/gif'
];

exports.index = function(req, res) {
    res.sendfile(path.join(__dirname, '../public/index.html'));
};

exports.getResRaw = function(req, res) {
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/' + req.param('idx') + '_s.txt';
    if (fs.existsSync(filepath)) {
        res.statusCode = 200;
        res.setHeader('Server', 'livepool');

        fs.createReadStream(filepath).pipe(res);
    }
};

exports.getResGet = function(req, res) {
    var socket = liveapp.socket;
    var filepath = config.global.tempDir + socket.id + '/' + req.param('idx') + '_b.txt';
    var ext = req.param('ext');
    fs.existsSync(filepath) && fs.stat(filepath, function(err, stat) {
        if (err) {
            throw err;
        }

        if (!stat.isFile()) {
            throw new Error('The responder is not a file!');
        }

        if (ext && stat.size == 0) {
            res.redirect('/img/no-img-data.jpg');
            return;
        }

        res.statusCode = 200;
        // res.setHeader('Content-Length', stat.size);
        if (ext) {
            res.setHeader('Content-Type', mime.lookup(ext));
        }
        res.setHeader('Server', 'livepool');
        // fs.createReadStream(filepath).pipe(res);
        fs.readFile(filepath, function(err, data) {
            if (err) throw err;
            // 除图片外，处理中文字符
            if (imageTypes.indexOf(ext) >= 0) {
                res.write(data);
            } else {
                var str = iconv.decode(data, 'utf-8');
                // 编码不对试着用GBK编码
                if (str.indexOf('�') != -1) {
                    str = iconv.decode(data, 'gbk');
                }
                res.write(str);
            }
            res.end();
        });
    });
};

exports.iframe = function(req, res) {
    var idx = req.param()
};

module.exports = function(liveapp) {
    // index page route and event
    // liveapp.io.route('ready', function(req) {
    //     req.io.emit('talk', {
    //         message: 'io event from an io route on the server'
    //     })
    // })

    liveapp.get('/', that.index);
    liveapp.get('/res/raw', that.getResRaw);
    liveapp.get('/res/get', that.getResGet);
    liveapp.get('/res/iframe/:idx', that.iframe);

    // other page route and event
    liveapp.get('/404', other.other);
};
