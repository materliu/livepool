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
        store.filter([{
            filterFn: function(item) {
                var filter1 = true,
                    filter2 = true,
                    filter3 = true,
                    filter4 = true,
                    filter5 = true,
                    filter6 = true,
                    filter7 = true;

                // filter1
                var type = $cmp.urlMatchType.getValue();
                var urls = $cmp.urlMatchValue.getValue();
                if (type && urls) {
                    var r = null;
                    urls = urls.split('\n');
                    // include
                    if (type == 1) {
                        r = _.find(urls, function(url) {
                            return item.get('url').indexOf(url) >= 0;
                        });
                    } else {
                        r = _.find(urls, function(url) {
                            return item.get('url').indexOf(url) < 0;
                        });
                    }
                    if (!r) {
                        filter1 = false;
                    }
                }

                // filter2
                if ($cmp.filterResStatusCode200.getValue() && item.get('result') == '200') {
                    filter2 = false;
                }

                // filter3
                if ($cmp.filterResStatusCodeN200.getValue() && item.get('result') != '200') {
                    filter3 = false;
                }

                // filter4
                if ($cmp.filterResStatusCodeRedirect.getValue() && item.get('result') == '304') {
                    filter3 = false;
                }

                // filter4
                if ($cmp.filterResStatusCodeRedirect.getValue() && _.contains(['300', '301', '302', '303', '307'], item.get('result'))) {
                    filter4 = false;
                }

                // filter5
                if ($cmp.filterResImages.getValue() && item.get('contentType').indexOf('images') >= 0) {
                    filter5 = false;
                }

                return filter1 && filter2 && filter3 && filter4 && filter5;
            }
        }]);
    },
    onMenuSet: function(key, value) {
        Ext.Ajax.request({
            url: '/menu/set',
            params: {
                value: value,
                key: key
            },
            method: 'POST'
        });
    }
};
