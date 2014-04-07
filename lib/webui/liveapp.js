var path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    config = require('../livepool/config'),
    // logger = require('../livepool/logger'),
    util = require('../livepool/util');

var routes = require('./routes');

var uiport = config.global.uiport;
var _socket = null;

var express = require('express.io');
var liveapp = express();
liveapp.http().io();

var publicPath = __dirname + '/public',
    viewPath = __dirname + '/views';

function createSocketFolder() {
    var path = config.global.tempDir + _socket.id + '/';
    if (!util.exists(path)) {
        util.mkdirpSync(path);
    }
};

function removeSocketFolder() {
    var path = config.global.tempDir;
    try {
        rimraf.sync(path);
    } catch (e) {

    }
};

function log(msg) {
    console.log(msg);
    if (_socket) {
        _socket.emit('log', msg);
    }
};

liveapp.configure(function() {
    liveapp.set('views', viewPath);
    liveapp.set('basepath', publicPath);
    liveapp.use(express.logger('dev'));
    liveapp.use(express.json());
    liveapp.use(express.urlencoded());
    liveapp.use(express.methodOverride());
    liveapp.use(liveapp.router);
    routes(liveapp);
});

liveapp.configure('development', function() {
    liveapp.use(express.static(publicPath));
    liveapp.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

liveapp.io.set('transports', ['websocket']);

liveapp.configure('production', function() {
    var oneYear = 31557600000;
    liveapp.use(express.static(publicPath, {
        maxAge: oneYear
    }));
    liveapp.use(express.errorHandler());
});

// build realtime-web app
liveapp.listen(uiport);

liveapp.io.sockets.on('connection', function(socket) {
    console.log('connect:' + socket.id);
    _socket = socket;
    exports.socket = _socket;
    createSocketFolder();

    socket.on('disconnect', function(socket) {
        console.log('disconnect:' + _socket.id);
        removeSocketFolder();
        delete _socket;
    });

});

exports.app = liveapp;
log('liveapp ui'.cyan + ' is ready, port: ' + String(uiport).cyan);
