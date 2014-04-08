var observers = {
    onRemoveAll: function(e) {
        store.removeAll();
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
