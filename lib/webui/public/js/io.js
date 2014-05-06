var initSocketIO = function() {
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
                    row.hostIp && gridRow.set('hostIp', row.hostIp);
                }
            });

            // apply max session
            if ($cmp.data.showSession !== 'All') {
                var max = parseInt($cmp.data.showSession);
                var count = store.getCount();
                if (count + req.length > max) {
                    var removeRecords = store.getRange(0, (count + req.length - max));
                    store.remove(removeRecords);
                }
            }

            store.save();

            // apply filter
            if ($cmp.useFilter.getValue()) {
                observers.onFilterGrid();
            }
            // apply auto scroll
            if ($cmp.data.autoScroll) {
                $cmp.sessionGrid.getView().focusRow(store.getCount() - 1);
            }
            // apply tree refresh
            if ($cmp.pathTree && $cmp.data.autoRefeshTree) {
                SESSION_TREE.refresh();
            }
        }

    });

    io.on('log', function(msg) {
        $cmp.logWin.setValue(msg + '\n' + $cmp.logWin.getValue());
    });

    io.on('rulesImport', function() {
        poolTreeStore.load();
    });

    io.on('config', function(config) {
        if (config.keep) {
            $cmp.btnKeep.setChecked(config.keep);
        }
        if (config.proxy) {
            $cmp.btnProxy.setChecked(config.proxy);
        }
        if (config.disablePool) {
            $cmp.disablePool.toggle(config.disablePool);
        }
        if (config.disableCache) {
            $cmp.menuDisableCache.setChecked(config.disableCache);
        }
        if (config.disableCacheForce) {
            $cmp.menuDisableCacheForce.setChecked(config.disableCacheForce);
        }
        if (config.autoScroll) {
            $cmp.btnAutoScroll.setChecked(true);
            $cmp.data.autoScroll = true;
        }
        if (config.showSession) {
            var map = {
                'All': 0,
                '100': 1,
                '200': 2,
                '500': 3,
                '1000': 4
            };
            $cmp.radioShowSession.menu.items.getAt(map[config.showSession]).setChecked(true);
        }
        if (config.layout) {
            $cmp.data.layout = config.layout;
        }
        if (config.tabSetting) {
            $cmp.data.tabSetting = config.tabSetting;
        }
        if (config.sessionColumns) {
            $cmp.data.sessionColumns = config.sessionColumns;
        }
    });
};
