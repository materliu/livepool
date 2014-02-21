
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var other = require('./other');
var that = exports;

exports.index = function(req, res) {
    res.sendfile(path.join(__dirname, '../public/index.html'));
};

exports.getResRaw = function(req, res){
    var filepath = '/Users/rehorn/Documents/Tmp/livepool/' + req.param('idx') + '_s.txt';
    if(fs.existsSync(filepath)){
        res.statusCode = 200;
        res.setHeader('Server', 'livepool');

        fs.createReadStream(filepath).pipe(res);
    }
};

exports.getResGet = function(req, res){
    var filepath = '/Users/rehorn/Documents/Tmp/livepool/' + req.param('idx') + '_b.txt';
    var ext = req.param('ext');
    fs.existsSync(filepath) && fs.stat(filepath, function(err, stat) {
        if (err) {
            throw err;
        }

        if (!stat.isFile()) {
            throw new Error('The responder is not a file!');
        }

        if(stat.size == 0){
            res.redirect('/img/no-img-data.jpg');
            return ;
        }

        res.statusCode = 200;
        // res.setHeader('Content-Length', stat.size);
        if(ext){
            res.setHeader('Content-Type', mime.lookup(ext));
        }
        res.setHeader('Server', 'livepool');
        fs.createReadStream(filepath).pipe(res);
    });
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

    // other page route and event
    liveapp.get('/404', other.other);
};
