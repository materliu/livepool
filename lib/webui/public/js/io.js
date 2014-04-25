Ext.onReady(function() {
    io = io.connect();
    io.on('proxy', function(proxy) {
        if (proxy.length) {
            var req = [],
                res = [];
            Ext.Array.each(proxy, function(data) {
                // var rs = filterData(data.rows);
                var rs = data.rows;
                if (data.type == 'req') {
                    req = req.concat(rs);
                    // store.add(data.rows);
                    // store.insert(0, data.rows);
                } else {
                    res = res.concat(rs);
                }
            });
            store.add(req);
            Ext.Array.each(res, function(row) {
                var gridRow = store.findRecord('id', row.id);
                if (gridRow) {
                    row.result && gridRow.set('result', row.result);
                    row.body && gridRow.set('body', row.body);
                    row.reqBody && gridRow.set('reqBody', row.reqBody);
                    row.contentType && gridRow.set('contentType', row.contentType);
                    row.caching && gridRow.set('caching', row.caching);
                    row.resHeaders && gridRow.set('resHeaders', row.resHeaders);
                    row.resTime && gridRow.set('resTime', row.resTime);
                }
            });
            store.save();
        }

    });

    io.on('log', function(msg) {
        $cmp.logWin.setValue(msg + '\n' + $cmp.logWin.getValue());
    });

    io.on('config', function(config) {
        if (config.keep == 'true') {
            $cmp.btnKeep.setValue(config.keep);
        }
        if (config.proxy == 'true') {
            $cmp.btnProxy.setValue(config.proxy);
        }
        if (config.disablePool == 'true') {
            $cmp.disablePool.toggle(config.disablePool);
        }
    });
});
