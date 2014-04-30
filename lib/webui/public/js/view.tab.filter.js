var TAB_FILTER = {
    title: 'Filters',
    padding: 10,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'container',
        layout: 'hbox',
        items: [{
            id: 'useFilter',
            xtype: 'checkbox',
            boxLabel: 'Use Filter',
            name: 'isFilterOn',
            handler: function(checkbox, checked) {
                if (checked) {
                    observers.onFilterGrid();
                } else {
                    store.clearFilter(false);
                }
            }
        }, {
            xtype: 'button',
            text: 'Apply',
            margin: '0 0 0 15',
            handler: function() {
                observers.onFilterGrid();
            }
        }, {
            xtype: 'button',
            text: 'Reset',
            margin: '0 5',
            handler: function() {
                store.clearFilter(false);
                $cmp.useFilter.setValue(false);
                $cmp.urlMatchValue.setValue('');
                $cmp.urlMatchType = Ext.getCmp('urlMatchType');
                $cmp.filterResStatusCodeNotModified.setValue(false);
                $cmp.filterResStatusCode200.setValue(false);
                $cmp.filterResStatusCodeN200.setValue(false);
                $cmp.filterResStatusCodeRedirect.setValue(false);
                $cmp.filterResImages.setValue(false);
            }
        }]
    }, {
        xtype: 'fieldset',
        title: 'Match url',
        items: [{
            id: 'urlMatchType',
            xtype: 'combobox',
            width: 200,
            store: urlMatchComboStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value'
        }, {
            id: 'urlMatchValue',
            xtype: 'textareafield',
            width: '100%'
        }]
    }, {
        xtype: 'fieldset',
        title: 'Response Status Code',
        items: [{
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'filterResStatusCode200',
                xtype: 'checkbox',
                boxLabel: 'Hide Success 200',
                flex: 1,
            }, {
                id: 'filterResStatusCodeN200',
                xtype: 'checkbox',
                flex: 1,
                boxLabel: 'Hide non-200'
            }]
        }, {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'filterResStatusCodeNotModified',
                xtype: 'checkbox',
                flex: 1,
                boxLabel: 'Hide Not-Modified 304'
            }, {
                id: 'filterResStatusCodeRedirect',
                xtype: 'checkbox',
                flex: 1,
                boxLabel: 'Hide Redirect(300,301,302,303,307)'
            }]
        }]
    }, {
        xtype: 'fieldset',
        title: 'Response Content Type',
        items: [{
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'filterResImages',
                xtype: 'checkbox',
                boxLabel: 'Hide Images',
                flex: 1,
            }]
        }]
    }]
};
