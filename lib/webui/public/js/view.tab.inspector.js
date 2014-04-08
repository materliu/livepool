var TAB_INSPECTORS = {
    title: 'Inspactors',
    border: 0,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        id: 'reqPanel',
        flex: 1,
        xtype: 'tabpanel',
        padding: 4,
        plain: true,
        defaults: {
            border: 0
        },
        items: [{
            title: 'headers',
            layout: 'fit',
            items: [{
                id: 'inspactors_req_headers',
                xtype: 'gridpanel',
                ui: 'blue-panel',
                store: reqHeaderStore,
                columns: [{
                    text: 'header',
                    dataIndex: 'key',
                    menuDisabled: true,
                    width: 120
                }, {
                    text: 'value',
                    dataIndex: 'value',
                    menuDisabled: true,
                    flex: 1
                }]
            }]
        }, {
            title: 'cookies',
            layout: 'fit',
            items: [{
                id: 'inspactors_req_cookies',
                xtype: 'gridpanel',
                ui: 'blue-panel',
                store: reqCookieStore,
                columns: [{
                    text: 'key',
                    dataIndex: 'key',
                    menuDisabled: true,
                    width: 120
                }, {
                    text: 'value',
                    dataIndex: 'value',
                    menuDisabled: true,
                    flex: 1
                }]
            }]
        }, {
            title: 'raw',
            layout: 'fit',
            border: false,
            items: [{
                id: 'inspactors_req_raw',
                xtype: 'textareafield',
                fieldStyle: "background: #FEFEFE none repeat scroll 0 0 !important;"
            }]
        }]
    }, {
        xtype: 'splitter'
    }, {
        id: 'resPanel',
        flex: 2,
        xtype: 'tabpanel',
        plain: true,
        padding: 4,
        defaults: {
            border: 0
        },
        items: [{
            title: 'headers',
            layout: 'fit',
            items: [{
                id: 'inspactors_res_headers',
                xtype: 'gridpanel',
                ui: 'blue-panel',
                store: resHeaderStore,
                columns: [{
                    text: 'header',
                    dataIndex: 'key',
                    menuDisabled: true,
                    width: 120
                }, {
                    text: 'value',
                    dataIndex: 'value',
                    menuDisabled: true,
                    flex: 1
                }]
            }]
        }, {
            title: 'cookies',
            layout: 'fit',
            items: [{
                id: 'inspactors_res_cookies',
                xtype: 'gridpanel',
                ui: 'blue-panel',
                store: resCookieStore,
                columns: [{
                    text: 'key',
                    dataIndex: 'key',
                    menuDisabled: true,
                    width: 120
                }, {
                    text: 'value',
                    dataIndex: 'value',
                    menuDisabled: true,
                    flex: 1
                }]
            }]
        }, {
            title: 'raw',
            layout: 'fit',
            border: false,
            items: [{
                id: 'inspactors_res_raw',
                xtype: 'textareafield',
                fieldStyle: "background: #FEFEFE none repeat scroll 0 0 !important;"
            }]
        }, {
            id: 'inspactors_res_view',
            title: 'view',
            layout: 'fit',
            items: []
        }]
    }]
};
