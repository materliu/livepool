
var other = require('./other');


var that = exports;

exports.index = function(req, res) {
    res.render('index');
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
