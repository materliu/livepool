var CONST = {
    host: '127.0.0.1'
};
// Ext.Loader.setConfig({
//     enabled: true
// });
// Ext.Loader.setPath('Ext.ux', '../libs/ext/ux');
// Ext.require([
//     'Ext.ux.CheckColumn'
//     // 'Ext.ux.RowExpander',
// ]);

// var imageTypes = ['jpeg', 'jpg', 'jpe', 'tiff', 'tif', 'gif', 'png', 'webp', 'ico'];
var imageTypes = [
    'image/bmp',
    'image/jpeg',
    'image/png',
    'image/x-icon',
    'image/webp',
    'image/tiff',
    'image/gif'
];


var util = {};

util.objToPlain = function(obj) {
    var str = '';
    for (var name in obj) {
        str += name + ': ' + obj[name] + '\r\n';
    }
    return str;
};

function parseHeader(headerText) {
    // load request header
    var regex = /(.*?): (.*?)\r\n/g;
    var result = regex.exec(headerText);
    var headers = [];
    while (result != null) {
        var header = {
            key: RegExp.$1,
            value: RegExp.$2
        };
        headers.push(header);
        result = regex.exec(headerText);
    }
    return _.sortBy(headers, function(header) {
        return header.key;
    });
};

function parseCookie(cookieText) {
    cookieText += '; ';
    // load request header
    var regex = /(.*?)=(.*?); /g;
    var result = regex.exec(cookieText);
    var headers = [];
    while (result != null) {
        var header = {
            key: RegExp.$1,
            value: RegExp.$2
        };
        headers.push(header);
        result = regex.exec(cookieText);
    }
    return _.sortBy(headers, function(header) {
        return header.key;
    });
};

function filterGrid() {
    var type = Ext.getCmp('urlMatchType').getValue();
    var urls = Ext.getCmp('urlMatchValue').getValue();
    if (!type || !urls) return;

    urls = urls.split('\n');
    store.filter([{
        filterFn: function(item) {
            // include
            if (type == 1) {
                return _.find(urls, function(url) {
                    return item.get('url').indexOf(url) >= 0;
                });
            } else {
                return _.find(urls, function(url) {
                    return item.get('url').indexOf(url) < 0;
                });
            }
        }
    }]);
};

var store = Ext.create('Ext.data.Store', {
    storeId: 'livepool',
    fields: [
        'id',
        'idx',
        'result',
        'protocol',
        'host',
        'url',
        'path',
        'pathname',
        'body',
        'rawBody',
        'caching',
        'contentType',
        'req',
        'res',
        'reqHeader',
        'reqHeaders',
        'resHeader',
        'resHeaders'
    ],
    data: {
        'items': []
    },
    buffered: true,
    pageSize: 5000,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});

var reqHeaderStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
    },
    buffered: true,
    pageSize: 5000,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
var resHeaderStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
    },
    buffered: true,
    pageSize: 5000,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});

var reqCookieStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
    },
    buffered: true,
    pageSize: 5000,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
var resCookieStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
    },
    buffered: true,
    pageSize: 5000,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});
var urlMatchComboStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data: [{
        "name": "include",
        "value": "1"
    }, {
        "name": "exclude",
        "value": "2"
    }]
});
var reqMethodStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data: [{
        "name": "GET",
        "value": "1"
    }, {
        "name": "POST",
        "value": "2"
    }, {
        "name": "PUT",
        "value": "3"
    }, {
        "name": "HEAD",
        "value": "4"
    }, {
        "name": "TRACE",
        "value": "5"
    }, {
        "name": "DELETE",
        "value": "6"
    }, {
        "name": "SEARCH",
        "value": "7"
    }, {
        "name": "CONNECT",
        "value": "8"
    }, {
        "name": "PROPFIND",
        "value": "9"
    }, {
        "name": "PROPPATCH",
        "value": "10"
    }, {
        "name": "PATCH",
        "value": "11"
    }, {
        "name": "MKCOL",
        "value": "12"
    }, {
        "name": "COPY",
        "value": "13"
    }, {
        "name": "LOCK",
        "value": "14"
    }, {
        "name": "UNLOCK",
        "value": "15"
    }, {
        "name": "OPTIONS",
        "value": "16"
    }]
});
var httpVersionStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data: [{
        "name": "HTTP/2.0",
        "value": "1"
    }, {
        "name": "HTTP/1.2",
        "value": "2"
    }, {
        "name": "HTTP/1.1",
        "value": "3"
    }, {
        "name": "HTTP/1.0",
        "value": "4"
    }, {
        "name": "HTTP/0.9",
        "value": "5"
    }]
});
var poolTreeStore = Ext.create('Ext.data.TreeStore', {
    fields: ['id', 'parentId', 'name', 'sort', 'match', 'action', 'checked', 'type'],
    proxy: {
        type: 'ajax',
        // url: '/pool/get',
        api: {
            create: '/pool/create',
            read: '/pool/get',
            update: '/pool/update',
            destroy: '/pool/remove'
        },
        writer: {
            type: 'json',
            allowSingle: false,
            root: 'records'
        }
    },
    root: {
        id: -1,
        expanded: true,
        text: "Root"
    },
    autoLoad: true
});

Ext.grid.RowNumberer = Ext.extend(Ext.grid.RowNumberer, {
    width: 34
});

Ext.define('LivePool.App', {
    extend: 'Ext.container.Viewport',
    initComponent: function() {
        var cxt = this;
        cxt.store = Ext.data.StoreManager.lookup('livepool');

        var observers = {
            onRemoveAll: function(e) {
                store.removeAll();
            }
        };

        Ext.apply(this, {
            layout: 'border',
            items: [{
                id: 'mainContainer',
                region: 'center',
                minWidth: 300,
                tbar: [{
                    text: 'LivePool',
                    iconCls: 'icomoon-stackoverflow'
                }, '-', {
                    text: 'Replay',
                    iconCls: 'icomoon-redo2'
                }, '-', {
                    text: 'Remove',
                    iconCls: 'icomoon-remove2',
                    menu: [{
                        text: 'Remove All',
                        handler: observers.onRemoveAll
                    }, {
                        text: 'Images'
                    }, {
                        text: 'CONNECTs'
                    }, {
                        text: 'NON 200s'
                    }]
                }, '-', {
                    text: 'Rules',
                    iconCls: 'icomoon-list3'
                }, '-', {
                    text: 'Find',
                    iconCls: 'icomoon-search3'
                }, '-', {
                    text: 'Keep',
                    iconCls: 'icomoon-stack'
                }, '-', {
                    text: 'Tools',
                    iconCls: 'icomoon-tools'
                }, '-', {
                    text: 'View',
                    iconCls: 'icomoon-browser2'
                }, '-', {
                    text: 'Help',
                    iconCls: 'icomoon-help',
                    menu: [{
                        text: 'About'
                    }]
                }],
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                border: 0,
                items: [{
                    id: 'gridpanel',
                    flex: 1,
                    xtype: 'gridpanel',
                    ui: 'blue-panel',
                    store: cxt.store,
                    enableDragDrop: true,
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
                            text: 'host',
                            dataIndex: 'host',
                            menuDisabled: true,
                            width: 150
                        }, {
                            text: 'path',
                            dataIndex: 'path',
                            menuDisabled: true,
                            minWidth: 200
                        }, {
                            text: 'caching',
                            menuDisabled: true,
                            dataIndex: 'caching'
                        }, {
                            text: 'content-type',
                            menuDisabled: true,
                            dataIndex: 'contentType'
                        }, {
                            text: 'body',
                            menuDisabled: true,
                            dataIndex: 'body'
                        }
                    ],
                    viewConfig: {
                        getRowClass: function(record, rowIndex, rowParams, store) {
                            if (record.data.result == '304') {
                                return 'x-grid-record-gray';
                            } else if (record.data.result == '404' || record.data.result == '503') {
                                return 'x-grid-record-red';
                            } else if (record.data.contentType.indexOf('javascript') >= 0) {
                                return 'x-grid-record-green';
                            } else {
                                return '';
                            }
                        },
                        plugins: {
                            ddGroup: 'GridDD',
                            ptype: 'gridviewdragdrop',
                            enableDrop: false
                        }
                    },
                    listeners: {
                        celldblclick: function(view, cell, cellIndex, record, row, rowIndex, e, eOpts) {
                            var tabContainerRight = Ext.getCmp('tabContainerRight');
                            tabContainerRight.setActiveTab(1);
                        },
                        cellclick: function(view, cell, cellIndex, record, row, rowIndex, e) {
                            // req
                            var reqHeadersText = util.objToPlain(record.data.reqHeaders);
                            var reqRaw = Ext.getCmp('inspactors_req_raw');
                            var url = '------------ url ----------\n' + record.data.url + '\n\n------------ headers ----------\n';
                            reqRaw.setValue(url + reqHeadersText);
                            var cookies = parseCookie(record.data.reqHeaders.cookie);
                            reqCookieStore.loadData(cookies);
                            var headers = parseHeader(reqHeadersText);
                            reqHeaderStore.loadData(headers);

                            // res
                            var resHeadersText = util.objToPlain(record.data.resHeaders);
                            var resRaw = Ext.getCmp('inspactors_res_raw');
                            resRaw.setValue(resHeadersText);
                            var headers = parseHeader(resHeadersText);
                            resHeaderStore.loadData(headers);

                            // load res view
                            var resView = Ext.getCmp('inspactors_res_view');
                            var ext = record.data.contentType;
                            // fix: 'image/jpeg,image/gif'
                            if (ext.indexOf(',')) {
                                ext = ext.split(',')[0]
                            }
                            resView.removeAll();
                            if (imageTypes.indexOf(ext) >= 0) {
                                var container = Ext.create('Ext.container.Container', {
                                    baseCls: 'tran-background',
                                    padding: 10
                                });
                                var img = Ext.create('Ext.Img', {
                                    src: '/res/get?idx=' + record.data.idx + '&ext=' + ext
                                });
                                container.add(img)
                                resView.add(container);
                            } else {
                                var textArea = Ext.create('Ext.form.field.TextArea', {
                                    flex: 1,
                                    fieldStyle: "background: #FEFEFE none repeat scroll 0 0 !important;"
                                });
                                Ext.Ajax.request({
                                    url: '/res/get',
                                    params: {
                                        idx: record.data.idx
                                    },
                                    method: 'GET',
                                    success: function(response, options) {
                                        textArea.setValue(response.responseText);
                                    },
                                    failure: function(response, options) {
                                        textArea.setValue('LivePool后台服务超时,错误编号：' + response.status);
                                    }
                                });
                                var toolbar = Ext.create('Ext.toolbar.Toolbar', {
                                    height: '20',
                                    items: ['->', {
                                        xtype: 'button',
                                        text: 'beautify',
                                        margin: '0 5'
                                    }, {
                                        xtype: 'button',
                                        text: 'copy'
                                    }]
                                });

                                var container = Ext.create('Ext.container.Container', {
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    items: [textArea, toolbar]
                                });

                                resView.add(container);
                                // iframe
                                // var panel2 = new Ext.Panel({
                                //     id: "panel2",
                                //     fitToFrame: true,
                                //     html: '<iframe id="frame1" src="/res/iframe/' + record.data.idx + '" frameborder="0" width="100%" height="100%"></iframe>'
                                // });
                                // resView.add(panel2);
                            }
                        }
                    }
                }, {
                    xtype: 'splitter'
                }, {
                    flex: 1,
                    id: 'tabContainerRight',
                    xtype: 'tabpanel',
                    // ui: 'green-tab',
                    defaults: {
                        border: 0
                    },
                    items: [{
                        title: 'Pool',
                        border: 0,
                        layout: 'fit',
                        items: [{
                            id: 'poolTree',
                            xtype: 'treepanel',
                            border: 0,
                            useArrows: true,
                            rootVisible: false,
                            store: poolTreeStore,
                            ui: 'blue-panel',
                            viewConfig: {
                                plugins: {
                                    ptype: 'treeviewdragdrop'
                                },
                                listeners: {
                                    beforeDrop: function(node, data, overModel, dropPosition, dropFunction, eOpts) {
                                        if (overModel.raw.leaf && data.records[0].parentNode.raw.name == overModel.parentNode.raw.name) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    },
                                    drop: function(node, data, dropRec, dropPosition) {
                                        poolTreeStore.sync();
                                    }
                                }
                            },
                            // multiSelect: true,
                            // singleExpand: true,
                            tbar: [{
                                id: 'poolAddProject',
                                xtype: 'button',
                                text: 'Add Project'
                            }, {
                                xtype: 'button',
                                id: 'poolAddRule',
                                text: 'Add Rule'
                            }, '->', {
                                xtype: 'button',
                                text: 'Expande All',
                                handler: function() {
                                    var tree = Ext.getCmp('poolTree');
                                    tree.expandAll();
                                }
                            }, {
                                xtype: 'button',
                                text: 'Collapse All',
                                handler: function() {
                                    var tree = Ext.getCmp('poolTree');
                                    tree.collapseAll();
                                }
                            }],
                            columns: [{
                                xtype: 'treecolumn',
                                text: 'project',
                                width: 150,
                                menuDisabled: true,
                                sortable: true,
                                dataIndex: 'name'
                            }, {
                                text: 'match',
                                flex: 1,
                                dataIndex: 'match',
                                menuDisabled: true,
                                sortable: false,
                                editor: {
                                    xtype: 'textfield',
                                    selectOnFocus: true,
                                    validator: function(value) {
                                        value = Ext.String.trim(value);
                                        return value.length < 1 ? this.blankText : true;
                                    }
                                }
                            }, {
                                text: 'action',
                                flex: 1,
                                dataIndex: 'action',
                                menuDisabled: true,
                                sortable: false,
                                editor: {
                                    xtype: 'textfield',
                                    selectOnFocus: true,
                                    validator: function(value) {
                                        value = Ext.String.trim(value);
                                        return value.length < 1 ? this.blankText : true;
                                    }
                                }
                            }, {
                                text: ' ',
                                width: 40,
                                menuDisabled: true,
                                xtype: 'actioncolumn',
                                align: 'center',
                                margin: '0 2',
                                items: [{
                                    tooltip: 'remove',
                                    icon: '/img/subtract.png',
                                    handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                                        function remove() {
                                            record.parentNode.removeChild(record);
                                            poolTreeStore.sync();
                                        }
                                        if (!record.raw.type) {
                                            remove();
                                        } else {
                                            Ext.MessageBox.confirm('提示', '确定删除吗？', function(btn) {
                                                if (btn == 'yes') {
                                                    remove();
                                                }
                                            })
                                        }
                                    }
                                }, {
                                    tooltip: 'edit',
                                    icon: '/img/pencil2.png',
                                    handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                                        alert(Ext.JSON.encode(record.raw))
                                    }
                                }]
                            }],
                            listeners: {
                                checkChange: function(node, checked, eOpts) {
                                    if (checked == true) {
                                        node.checked = checked;
                                        //获得所有叶子节点,并将其选中状态与当前节点同步  
                                        var childNodes = node.childNodes;
                                        for (var i = 0; i < childNodes.length; i++) {
                                            var child = childNodes[i];
                                            if (child.get("leaf")) {
                                                child.set("checked", true);
                                            }
                                        }
                                    }

                                    // 当前节点取消选中时，其叶子节点状态与其级联
                                    if (!node.get("leaf") && !checked) {
                                        node.cascadeBy(function(node) {
                                            node.set('checked', checked);
                                        });
                                    }
                                },
                                itemMove: function(aNode, aOldParent, aNewParent, aIndex, aOptions) {
                                    // Update the indeces of all the parent children (not just the one that moved)
                                    for (i = 0; i < aNewParent.childNodes.length; i++) {
                                        aNewParent.childNodes[i].data.sort = i;
                                        aNewParent.childNodes[i].setDirty();
                                    }
                                    // poolTreeStore.sync();
                                },
                                itemclick: function(aNode, record, item, index, e, eOpts) {

                                }
                            }
                        }]
                    }, {
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
                    }, {
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
                    }, {
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
                                        filterGrid();
                                    } else {
                                        store.clearFilter(false);
                                    }
                                }
                            }, {
                                xtype: 'button',
                                text: 'apply',
                                margin: '0 15',
                                handler: function() {
                                    filterGrid();
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
                    }, {
                        title: 'Statistics',
                        html: 'Comming Soon...',
                        padding: 5
                    }, {
                        title: 'Timeline',
                        html: 'Comming Soon...',
                        padding: 5
                    }, {
                        title: 'Log',
                        padding: 5,
                        layout: 'fit',
                        items: [{
                            id: 'log',
                            layout: 'fit',
                            xtype: 'textareafield',
                            fieldStyle: "background: #FEFEFE none repeat scroll 0 0 !important;"
                        }]
                    }]
                }]
            }, {
                region: 'south',
                height: 18,
                border: 0
            }]
        });

        this.callParent(arguments);
    }

});

Ext.onReady(function() {
    var app = new LivePool.App();

    io = io.connect();

    io.on('proxy', function(proxy) {

        if (proxy.length) {
            var req = [],
                res = [];
            Ext.Array.each(proxy, function(data) {
                // var rs = filterData(data.rows);
                var rs = data.rows;
                if (data.type == 'req') {
                    req = req.concat(rs);
                    // store.add(data.rows);
                    // store.insert(0, data.rows);
                } else {
                    res = res.concat(rs);
                }
            });
            store.add(req);
            Ext.Array.each(res, function(row) {
                var gridRow = store.findRecord('id', row.id);
                if (gridRow) {
                    gridRow.set('result', row.result);
                    gridRow.set('body', row.body);
                    // gridRow.set('rawBody', row.body);
                    gridRow.set('contentType', row.contentType);
                    gridRow.set('caching', row.caching);
                    gridRow.set('resHeaders', row.resHeaders);
                }
            });
            store.save();
        }

    });

    var logWin = Ext.getCmp('log');
    io.on('log', function(msg) {
        logWin.setValue(msg + '\n' + logWin.getValue());
    });

    // no spell check
    document.body.setAttribute('spellcheck', false);

    // keymap
    new Ext.KeyMap(Ext.getDoc(), {
        key: 'd',
        ctrl: true,
        handler: function(key, event) {
            store.removeAll();
        },
        stopEvent: true
    });

});
