var path = require('path'),
    config = require('../livepool/config'),
    logger = require('../livepool/logger');

var routes = require('./routes');

var uiport = config.global.uiport;
var _socket = null;

var express = require('express.io');
var liveapp = express();
liveapp.http().io();

var publicPath = __dirname +  '/public',
    viewPath = __dirname + '/views';

liveapp.configure(function() {
    liveapp.set('views', viewPath);
    liveapp.set('basepath', publicPath);
    // liveapp.set('view engine', 'ejs');
    liveapp.use(express.favicon());
    liveapp.use(express.logger('dev'));
    // liveapp.use(express.bodyParser());
    liveapp.use(express.json());
    liveapp.use(express.urlencoded());
    liveapp.use(express.methodOverride());
    liveapp.use(liveapp.router);
    routes(liveapp);
});

liveapp.configure('development', function(){
    liveapp.use(express.static(publicPath));
    liveapp.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

liveapp.io.set('transports', ['websocket']);

liveapp.configure('production', function(){
    var oneYear = 31557600000;
    liveapp.use(express.static(publicPath, { maxAge: oneYear }));
    liveapp.use(express.errorHandler());
});

logger.writeline();
// build realtime-web app
liveapp.listen(uiport);

liveapp.io.sockets.on('connection', function(socket){
    console.log('connect:' + socket.id);
    // socket.on('ready', function(data){
    //     console.log('ready');
    //     console.log(socket)
    //     _socket = socket;
    // });
    _socket = socket;
    exports.socket = _socket;

    socket.on('disconnect', function(socket){
        console.log('disconnect:' + _socket.id);
        delete _socket;
    });

});


exports.app = liveapp;
logger.log('liveapp ui'.cyan + ' is ready, port: ' + String(uiport).cyan);
