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
            margin: '0 15',
            handler: function() {
                observers.onFilterGrid();
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
                id: 'resStatusCode200',
                xtype: 'checkbox',
                boxLabel: 'Hide Success 200',
                flex: 1,
            }, {
                id: 'resStatusCodeN200',
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
                id: 'resStatusCodeNotModified',
                xtype: 'checkbox',
                flex: 1,
                boxLabel: 'Hide Not-Modified 304'
            }, {
                id: 'resStatusCodeRedirect',
                xtype: 'checkbox',
                flex: 1,
                boxLabel: 'Hide Redirect(300,301,302,303,307)'
            }]
        }]
    }]
};
