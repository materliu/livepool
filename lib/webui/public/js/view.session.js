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
    flex: 3,
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
            text: '#s',
            // text: 'result',
            dataIndex: 'result',
            menuDisabled: true,
            width: 40
        }, {
            text: '#p',
            // text: 'protocol',
            dataIndex: 'protocol',
            menuDisabled: true,
            width: 50
        }, {
            text: '#m',
            // text: 'method',
            dataIndex: 'req',
            menuDisabled: true,
            width: 50,
            renderer: function(value) {
                return value.method;
            }
        }, {
            text: '#t',
            // text: 'type',
            dataIndex: 'contentType',
            menuDisabled: true,
            width: 50,
            renderer: function(value) {
                if (value.indexOf('javascript') >= 0) {
                    return 'JS';
                } else if (value.indexOf('css') >= 0) {
                    return 'CSS';
                } else if (value.indexOf('html') >= 0) {
                    return 'HTML';
                } else if (value.indexOf('json') >= 0) {
                    return 'JSON';
                } else if (value.indexOf('image') >= 0) {
                    return 'IMG';
                } else {
                    return '';
                }
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
            text: 'host-ip',
            dataIndex: 'hostIp',
            menuDisabled: true,
            width: 120,
            renderer: function(value, metaData, record) {
                if (_.isArray(value)) {
                    return value[0];
                } else if (record.data.resHeaders['Server'] == 'livepool') {
                    return '127.0.0.1';
                } else {
                    return '';
                }
            }
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
            if (_.contains(['404', '403', '502', '503', '504'], record.data.result + '')) {
                return 'x-grid-record-red';
            } else if (record.data.resHeaders && record.data.resHeaders.server == 'livepool') {
                var typeClass = '';
                if (record.data.contentType.indexOf('css') >= 0) {
                    typeClass = 'x-grid-record-olive';
                }
                if (record.data.contentType.indexOf('javascript') >= 0) {
                    typeClass = 'x-grid-record-green';
                }
                if (record.data.contentType.indexOf('json') >= 0) {
                    typeClass = 'x-grid-record-blue';
                }
                return 'x-grid-record-gray2' + ' ' + typeClass;
            } else if (_.contains(['302', '304'], record.data.result + '') || record.data.contentType.indexOf('image/') >= 0) {
                return 'x-grid-record-gray';
            } else if (record.data.contentType.indexOf('javascript') >= 0) {
                return 'x-grid-record-green';
            } else if (record.data.contentType.indexOf('css') >= 0) {
                return 'x-grid-record-olive';
            } else if (record.data.contentType.indexOf('json') >= 0) {
                return 'x-grid-record-blue';
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
            inspectorHandler.inspect(record);
        }
    }
};

var MAIN_SESSION = {
    id: 'mainSession',
    xtype: 'container',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [MAIN_SESSION_GRID]
};
