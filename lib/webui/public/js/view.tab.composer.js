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
                id: 'reqMethod',
                xtype: 'combobox',
                width: 90,
                store: reqMethodStore,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name'
            }, {
                id: 'reqUrl',
                xtype: 'textfield',
                flex: 1,
                margin: '0 10'
            }, {
                id: 'reqHttpVersion',
                xtype: 'combobox',
                width: 90,
                store: httpVersionStore,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name'
            }, {
                xtype: 'button',
                width: 70,
                text: 'Execute',
                margin: '0 0 0 10',
                handler: function() {
                    var method = Ext.getCmp('reqMethod').getValue();
                    var headers = $cmp.composerSession.data.reqHeaders;
                    var url = Ext.getCmp('reqUrl').getValue();
                    var body = {};
                    if (method == 'POST') {
                        body = Ext.getCmp('reqBody').getValue();
                    }
                    var params = {
                        method: method,
                        body: body,
                        url: url,
                        headers: JSON.stringify(headers)
                    };

                    Ext.Ajax.request({
                        url: '/compose',
                        params: params,
                        method: 'POST',
                        success: function(response, options) {

                        },
                        failure: function(response, options) {

                        }
                    });
                }
            }]
        }, {
            id: 'reqHeaders',
            xtype: 'textareafield',
            width: '100%',
            flex: 1
        }, {
            id: 'reqBody',
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
                notifyDrop: function(dd, e, data) {
                    var record = data.records[0];
                    // console.log(record);
                    $cmp.composerSession = record;
                    Ext.getCmp('reqMethod').setValue(record.data.req.method);
                    Ext.getCmp('reqUrl').setValue(record.data.url);
                    Ext.getCmp('reqHttpVersion').setValue('HTTP/' + record.data.req.httpVersion);
                    Ext.getCmp('reqHeaders').setValue(utils.objToPlain(record.data.reqHeaders));
                    Ext.getCmp('reqBody').setValue(record.data.reqBody);
                }
            });
        }
    }
};
