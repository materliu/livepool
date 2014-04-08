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
            text: 'apply',
            margin: '0 15',
            handler: function() {
                observers.onFilterGrid();
            }
        }]
    }, {
        xtype: 'fieldset',
        title: 'match url',
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
    }]
};
