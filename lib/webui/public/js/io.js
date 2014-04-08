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
                    gridRow.set('result', row.result);
                    gridRow.set('body', row.body);
                    // gridRow.set('rawBody', row.body);
                    gridRow.set('contentType', row.contentType);
                    gridRow.set('caching', row.caching);
                    gridRow.set('resHeaders', row.resHeaders);
                }
            });
            store.save();
        }

    });

    io.on('log', function(msg) {
        $cmp.logWin.setValue(msg + '\n' + $cmp.logWin.getValue());
    });

    io.on('config', function(config) {
        if (config.keep) {
            $cmp.btnKeep.toggle(config.keep);
        }
    });
});
