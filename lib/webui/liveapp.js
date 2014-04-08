var path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf');

var routes = require('./routes');

var _socket = null;
var config, logger, util;

var express = require('express.io');
var liveapp = express();
liveapp.http().io();

var publicPath = __dirname + '/public',
    viewPath = __dirname + '/views';

// create tmp folder

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
// liveapp.io.set('transports', ['websocket']);

liveapp.configure('production', function() {
    var oneYear = 31557600000;
    liveapp.use(express.static(publicPath, {
        maxAge: oneYear
    }));
    liveapp.use(express.errorHandler());
});

liveapp.run = function() {
    config = require('../livepool/config');
    logger = require('../livepool/logger');
    util = require('../livepool/util');
    var uiport = config.global.uiport;

    liveapp.listen(uiport);

    // browser connection -> keep only one socket connection
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

    logger.log('liveapp ui'.cyan + ' is ready, port: ' + String(uiport).cyan);
};

// publish
exports.app = liveapp;
