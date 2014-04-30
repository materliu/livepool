exports.run = function(livepool) {
    var config = livepool.config;
    if (config.menuAction.disableCache) {
        var ev = livepool.event;
        ev.on('beforeResponse', function(res) {
            res.headers = res.headers || {};
            res.headers['Cache-Control'] = 'no-cache';
            res.headers['Expires'] = 0;
        });
    }
};
