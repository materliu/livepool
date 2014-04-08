var TAB_COMPOSER = {
    title: 'Composer',
    layout: 'fit',
    items: [{
        id: 'composerForm',
        xtype: 'panel',
        padding: 5,
        border: 0,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'fieldcontainer',
            width: '100%',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'combobox',
                width: 90,
                store: reqMethodStore,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name'
            }, {
                xtype: 'textfield',
                flex: 1,
                margin: '0 10'
            }, {
                xtype: 'combobox',
                width: 90,
                store: httpVersionStore,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name'
            }, {
                xtype: 'button',
                width: 70,
                text: 'execute',
                margin: '0 0 0 10'
            }]
        }, {
            xtype: 'textareafield',
            width: '100%',
            flex: 1
        }, {
            xtype: 'textareafield',
            width: '100%',
            flex: 1
        }]
    }],
    listeners: {
        activate: function(tab) {
            var formPanel = Ext.getCmp('composerForm');
            var ddrow = new Ext.dd.DropTarget(formPanel.body.dom, {
                ddGroup: 'GridDD',
                notifyEnter: function(ddSource, e, data) {
                    formPanel.body.highlight();
                },
                notifyDrop: function(dd, e, data) {}
            });
        }
    }
};
