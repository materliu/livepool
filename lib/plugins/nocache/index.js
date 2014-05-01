exports.run = function(livepool) {
    var config = livepool.config;
    if (config.settings.disableCache) {
        var ev = livepool.event;
        ev.on('beforeResponse', function(res) {
            res.setHeader('Cache-control', 'no-cache');
            res.setHeader('Expires', 0);
            // res.statusCode = res.statusCode == 304 ? 200 : res.statusCode;
        });
    }
};
