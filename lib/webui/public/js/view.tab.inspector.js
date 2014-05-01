var inspectorReqHeaderCxtMenu = new Ext.menu.Menu({
    id: 'inspectorReqHeaderCxtMenu',
    items: [{
        id: 'inspectorReqHeaderCopy',
        xtype: 'button',
        text: 'Copy',
        plugins: {
            ptype: 'zeroclipboardplugin',
            targetFun: function() {
                var selections = $cmp.inspactors_req_headers.getSelectionModel().getSelection();
                if (selections && selections.length > 0) {
                    var record = selections[0];
                    return {
                        text: record.data.key + '=' + record.data.value,
                        id: 'inspectorReqHeaderCopy'
                    }
                }
                return '';
            }
        }
    }]
});

var inspectorReqCookieCxtMenu = new Ext.menu.Menu({
    id: 'inspectorReqCookieCxtMenu',
    items: [{
        id: 'inspectorReqCookieCopy',
        xtype: 'button',
        text: 'Copy',
        plugins: {
            ptype: 'zeroclipboardplugin',
            targetFun: function() {
                var selections = $cmp.inspactors_req_cookies.getSelectionModel().getSelection();
                if (selections && selections.length > 0) {
                    var record = selections[0];
                    return {
                        text: record.data.key + '=' + record.data.value,
                        id: 'inspectorReqCookieCopy'
                    }
                }
                return '';
            }
        }
    }]
});


var TAB_INSPECTORS_REQ = {
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
            }],
            listeners: {
                itemcontextmenu: function(view, record, item, index, e) {
                    e.preventDefault();
                    inspectorReqHeaderCxtMenu.showAt(e.getXY());
                }
            }
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
            }],
            listeners: {
                itemcontextmenu: function(view, record, item, index, e) {
                    e.preventDefault();
                    inspectorReqCookieCxtMenu.showAt(e.getXY());
                }
            }
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
};

var TAB_INSPECTORS_RES = {
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
};

var TAB_INSPECTORS = {
    id: 'tabInspectors',
    title: 'Inspectors',
    border: 0,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        TAB_INSPECTORS_REQ, {
            xtype: 'splitter'
        },
        TAB_INSPECTORS_RES
    ]
};
