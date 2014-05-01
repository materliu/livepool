function handlerAddRule() {
    var record = store.findRecord('idx', $cmp.editIdx);
    var match = record.data.url;
    var ext = /\.[^\.]+/.exec(record.data.pathname);
    var action = '_livepool' + record.data.pathname + ((!ext) ? '.js' : '');
    var model = {};
    model.data = {
        match: match,
        action: action,
        name: ''
    };
    showEditWin('rule', 'add', model, {
        idx: $cmp.editIdx
    });
};

var sessionCxtMenu = new Ext.menu.Menu({
    id: 'sessionCxtMenu',
    items: [{
            id: 'sessionCxtMenuCopy',
            xtype: 'button',
            text: 'Copy Url',
            plugins: {
                ptype: 'zeroclipboardplugin',
                targetFun: function() {
                    var selections = $cmp.sessionGrid.getSelectionModel().getSelection();
                    if (selections && selections.length > 0) {
                        var record = selections[0];
                        return {
                            text: record.data.url,
                            id: 'sessionCxtMenuCopy'
                        }
                    }
                    return '';
                }
            }
        }, '-', {
            text: 'Inspect',
            handler: function() {
                $cmp.tabContainerRight.setActiveTab('tabInspectors');
            }
        }, {
            text: 'Inspect in View',
            handler: function() {
                $cmp.tabContainerRight.setActiveTab('tabInspectors');
                $cmp.tabResPanel.setActiveTab('inspactors_res_view');
            }
        }, '-', {
            text: 'Add Rule',
            handler: function() {
                handlerAddRule();
            }
        },
        // {
        //     text: 'Add Filter',
        //     handler: function() {

        //     }
        // },
        '-', {
            text: 'Replay',
            handler: observers.onSessionReplay
        }, {
            text: 'Replay Force',
            handler: function() {
                observers.onSessionReplay(1);
            }
        }, '-', {
            text: 'Open In..',
            handler: function() {
                var selections = $cmp.sessionGrid.getSelectionModel().getSelection();
                if (selections && selections.length > 0) {
                    var record = selections[0];
                    window.open(record.data.url)
                }
            }
        }
    ]
});

var MAIN_SESSION_GRID = {
    id: 'gridpanel',
    flex: 1,
    xtype: 'gridpanel',
    ui: 'blue-panel',
    store: store,
    columns: [
        // new Ext.grid.RowNumberer(),
        {
            text: '#',
            dataIndex: 'idx',
            menuDisabled: true,
            width: 40
        }, {
            text: 'result',
            dataIndex: 'result',
            menuDisabled: true,
            width: 50
        }, {
            text: 'protocol',
            dataIndex: 'protocol',
            menuDisabled: true,
            width: 60
        }, {
            text: 'method',
            dataIndex: 'req',
            menuDisabled: true,
            width: 60,
            renderer: function(value) {
                return value.method;
            }
        }, {
            text: 'host',
            dataIndex: 'host',
            menuDisabled: true,
            width: 150
        }, {
            text: 'path',
            dataIndex: 'path',
            menuDisabled: true,
            minWidth: 200,
            flex: 3
        }, {
            text: 'caching',
            menuDisabled: true,
            dataIndex: 'caching',
            minWidth: 100,
            flex: 1
        }, {
            text: 'content-type',
            menuDisabled: true,
            dataIndex: 'contentType',
            minWidth: 100,
            flex: 1
        }, {
            text: 'body',
            menuDisabled: true,
            width: 60,
            dataIndex: 'body',
            renderer: function(value) {
                // if (typeof value !== undefined) {
                //     return utils.formateSize(value);
                // }
                return value;
            }
        }, {
            text: 'time',
            menuDisabled: true,
            width: 60,
            dataIndex: 'reqTime',
            renderer: function(value, metaData, record) {
                if (record.data.resTime) {
                    // return utils.convertTime(record.data.resTime - value);
                    return record.data.resTime - value;
                } else {
                    return '';
                }
            }
        }
    ],
    viewConfig: {
        getRowClass: function(record, rowIndex, rowParams, store) {
            if (record.data.resHeaders && record.data.resHeaders.server == 'livepool') {
                // if (record.data.contentType.indexOf('css') >= 0) {
                //     return 'x-grid-record-maroon2';
                // }
                // if (record.data.contentType.indexOf('javascript') >= 0) {
                //     return 'x-grid-record-maroon2';
                // }
                // if (record.data.contentType.indexOf('image') >= 0) {
                //     return 'x-grid-record-gray2';
                // }
                return 'x-grid-record-blue2';
            } else if (record.data.result == '304' || record.data.result == '302' || record.data.contentType.indexOf('image/') >= 0) {
                return 'x-grid-record-gray';
            } else if (record.data.result == '404' || record.data.result == '503') {
                return 'x-grid-record-red';
            } else if (record.data.contentType.indexOf('javascript') >= 0) {
                return 'x-grid-record-green';
            } else if (record.data.contentType.indexOf('css') >= 0) {
                return 'x-grid-record-olive';
            } else {
                return '';
            }
        },
        plugins: {
            ddGroup: 'GridDD',
            ptype: 'gridviewdragdrop',
            enableDrop: false
        },
        beforecellcontextmenu: function(view, tableCell, columnIndex, record, tableRow, rowIndex) {
            //your menu code here
            console.log(columnIndex)
        }
    },
    listeners: {
        itemcontextmenu: function(view, record, item, index, e) {
            e.preventDefault();
            sessionCxtMenu.showAt(e.getXY());
        },
        celldblclick: function(view, cell, cellIndex, record, row, rowIndex, e, eOpts) {
            $cmp.tabContainerRight.setActiveTab('tabInspectors');
        },
        cellclick: function(view, cell, cellIndex, record, row, rowIndex, e) {
            if ($cmp.editIdx === record.data.idx) {
                return;
            }
            $cmp.editRecord = record;
            $cmp.editIdx = record.data.idx;
            // req
            var reqHeadersText = utils.objToPlain(record.data.reqHeaders);
            var reqRaw = $cmp.inspactors_req_raw;
            var url = '------------ url ----------\n' + record.data.url + '\n\n------------ headers ----------\n';
            reqRaw.setValue(url + reqHeadersText);
            var cookies = utils.parseCookie(record.data.reqHeaders.cookie);
            reqCookieStore.loadData(cookies);
            var headers = utils.parseHeader(reqHeadersText);
            reqHeaderStore.loadData(headers);

            // res
            var resHeadersText = utils.objToPlain(record.data.resHeaders);
            var resRaw = $cmp.inspactors_res_raw;
            resRaw.setValue(resHeadersText);
            var headers = utils.parseHeader(resHeadersText);
            resHeaderStore.loadData(headers);

            // view
            var resViewContainer = $cmp.inspactors_res_view_container;
            var ext = record.data.contentType;
            if (ext.indexOf('image/') >= 0) {
                // image view
                RES_VIEWER.showImageViewer(resViewContainer, record);
                Ext.getCmp('inspactors_res_view_Image').toggle(true);
            } else if (ext.indexOf('/json') >= 0) {
                // json view
                RES_VIEWER.showJsonViewer(resViewContainer, record);
                Ext.getCmp('inspactors_res_view_JSON').toggle(true);
            } else if (ext.indexOf('stream') >= 0 || ext.indexOf('flash') >= 0) {
                // other view
                RES_VIEWER.showOtherViewer(resViewContainer, record);
                Ext.getCmp('inspactors_res_view_Other').toggle(true);
            } else {
                // text view
                Ext.getCmp('inspactors_res_view_Text').toggle(true);
                RES_VIEWER.showTextViewer(resViewContainer, record);
            }
        }
    }
};
