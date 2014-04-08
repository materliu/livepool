var observers = {
    onRemoveAll: function(e) {
        store.removeAll();
    },
    onRemoveImages: function() {
        var all = store.snapshot || store.data;;
        all.each(function(record) {
            if (record.data.contentType.indexOf('image/') >= 0) {
                store.remove(record);
            }
        });
    },
    onRemoveNon200s: function() {
        var all = store.snapshot || store.data;;
        all.each(function(record) {
            if (record.data.result != 200) {
                store.remove(record);
            }
        });
    },
    onFilterGrid: function() {
        var type = Ext.getCmp('urlMatchType').getValue();
        var urls = Ext.getCmp('urlMatchValue').getValue();
        if (!type || !urls) return;

        urls = urls.split('\n');
        store.filter([{
            filterFn: function(item) {
                // include
                if (type == 1) {
                    return _.find(urls, function(url) {
                        return item.get('url').indexOf(url) >= 0;
                    });
                } else {
                    return _.find(urls, function(url) {
                        return item.get('url').indexOf(url) < 0;
                    });
                }
            }
        }]);
    }
};
