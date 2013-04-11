
var path = require('path');
var fs = require('fs');
var other = require('./other');
var that = exports;

exports.index = function(req, res) {
    res.sendfile(path.join(__dirname, '../public/index.html'));
};

module.exports = function(liveapp) {
    // index page route and event
    liveapp.io.route('ready', function(req) {
        req.io.emit('talk', {
            message: 'io event from an io route on the server'
        })
    })

    liveapp.get('/', that.index);

    // other page route and event
    liveapp.get('/404', other.other);
};
