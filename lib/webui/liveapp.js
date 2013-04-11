var path = require('path'),
    config = require('../livepool/config'),
    logger = require('../livepool/logger');

var routes = require('./routes');

var uiport = config.global.uiport;

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
    liveapp.use(express.bodyParser());
    liveapp.use(express.methodOverride());
    liveapp.use(liveapp.router);
    routes(liveapp);
});

liveapp.configure('development', function(){
    liveapp.use(express.static(publicPath));
    liveapp.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

liveapp.configure('production', function(){
    var oneYear = 31557600000;
    liveapp.use(express.static(publicPath, { maxAge: oneYear }));
    liveapp.use(express.errorHandler());
});

// build realtime-web app
liveapp.listen(uiport);

exports.app = liveapp;
logger.log('liveapp ui'.cyan + ' is ready, port: ' + String(uiport).cyan);
