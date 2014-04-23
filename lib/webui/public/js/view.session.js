function handlerAddRule() {
    var record = store.findRecord('idx', $cmp.editIdx);
    var match = record.data.url;
    var ext = /\.[^\.]+/.exec(record.data.pathname);
    var action = '_livepool' + record.data.pathname + ((!ext) ? '.js' : '');
    var model = {};
    model.raw = {
        match: match,
        action: action,
        name: ''
    };
    showEditWin('rule', 'add', model, {
        idx: $cmp.editIdx
    });
}

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
        }
    },
    listeners: {
        celldblclick: function(view, cell, cellIndex, record, row, rowIndex, e, eOpts) {
            var tabContainerRight = Ext.getCmp('tabContainerRight');
            tabContainerRight.setActiveTab(1);
        },
        cellclick: function(view, cell, cellIndex, record, row, rowIndex, e) {
            if ($cmp.editIdx === record.data.idx) {
                return;
            }
            $cmp.editIdx = record.data.idx;
            // req
            var reqHeadersText = utils.objToPlain(record.data.reqHeaders);
            var reqRaw = Ext.getCmp('inspactors_req_raw');
            var url = '------------ url ----------\n' + record.data.url + '\n\n------------ headers ----------\n';
            reqRaw.setValue(url + reqHeadersText);
            var cookies = utils.parseCookie(record.data.reqHeaders.cookie);
            reqCookieStore.loadData(cookies);
            var headers = utils.parseHeader(reqHeadersText);
            reqHeaderStore.loadData(headers);

            // res
            var resHeadersText = utils.objToPlain(record.data.resHeaders);
            var resRaw = Ext.getCmp('inspactors_res_raw');
            resRaw.setValue(resHeadersText);
            var headers = utils.parseHeader(resHeadersText);
            resHeaderStore.loadData(headers);

            // load res view
            var resView = Ext.getCmp('inspactors_res_view');
            var ext = record.data.contentType;
            // fix: 'image/jpeg,image/gif'
            if (ext.indexOf(',')) {
                ext = ext.split(',')[0]
            }
            resView.removeAll();
            if (CONST.imageTypes.indexOf(ext) >= 0) {
                var container = Ext.create('Ext.container.Container', {
                    baseCls: 'tran-background',
                    padding: 10
                });
                var img = Ext.create('Ext.Img', {
                    src: '/res/get?idx=' + record.data.idx + '&ext=' + ext
                });
                container.add(img)
                resView.add(container);
            } else if (ext.indexOf('/json') >= 0) {
                // // iframe
                // var panel2 = new Ext.Panel({
                //     id: "panel2",
                //     fitToFrame: true,
                //     html: '<iframe id="frame1" src="/res/json/' + record.data.idx + '" frameborder="0" width="100%" height="100%"></iframe>'
                // });
                // resView.add(panel2);
                // iframe
                var panel2 = new Ext.Panel({
                    id: "panel2",
                    flex: 1,
                    margin: '0 0 4 0',
                    html: '<div id="jsonPanel" style="height:100%;"></div>'
                });
                var toolbar = Ext.create('Ext.toolbar.Toolbar', {
                    height: '20',
                    items: ['->', {
                        xtype: 'button',
                        text: 'Save',
                        handler: function() {
                            if ($cmp.jsoneditor) {
                                var data = $cmp.jsoneditor.getText();
                                Ext.Ajax.request({
                                    url: '/res/edit',
                                    params: {
                                        idx: record.data.idx,
                                        data: data
                                    },
                                    method: 'POST',
                                    success: function(response, options) {

                                    },
                                    failure: function(response, options) {}
                                });
                            }
                        }
                    }, {
                        xtype: 'button',
                        text: 'Add Rule',
                        handler: handlerAddRule
                    }]
                });
                var container = Ext.create('Ext.container.Container', {
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [panel2, toolbar]
                });
                resView.add(container);
                var jsonPanel = document.getElementById('jsonPanel');
                Ext.Ajax.request({
                    url: '/res/get',
                    params: {
                        idx: record.data.idx
                    },
                    method: 'GET',
                    success: function(response, options) {
                        if (!jsonPanel) {
                            return;
                        }
                        var json = {};
                        try {
                            json = JSON.parse(response.responseText);
                        } catch (e) {
                            json = {
                                msg: 'livepool parse error'
                            };
                        }
                        var options = {
                            mode: 'tree'
                        };
                        $cmp.jsoneditor = new jsoneditor.JSONEditor(jsonPanel, options, json);
                    },
                    failure: function(response, options) {}
                });
            } else if (ext.indexOf('stream') >= 0) {
                var panel2 = new Ext.Panel({
                    fitToFrame: true,
                    html: 'binary stream data...'
                });
                resView.add(panel2);
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
                        text: 'Beautify',
                        margin: '0 5',
                        handler: function() {
                            Ext.Ajax.request({
                                url: '/res/beautify',
                                params: {
                                    idx: record.data.idx,
                                    ctype: record.data.contentType
                                },
                                method: 'GET',
                                success: function(response, options) {
                                    textArea.setValue(response.responseText);
                                },
                                failure: function(response, options) {
                                    textArea.setValue('LivePool后台服务超时,错误编号：' + response.status);
                                }
                            });
                        }
                    }, {
                        xtype: 'button',
                        text: 'Save',
                        handler: function() {
                            var data = textArea.getValue();
                            Ext.Ajax.request({
                                url: '/res/edit',
                                params: {
                                    idx: record.data.idx,
                                    data: data
                                },
                                method: 'POST',
                                success: function(response, options) {

                                },
                                failure: function(response, options) {}
                            });
                        }
                    }, {
                        xtype: 'button',
                        text: 'Add Rule',
                        handler: handlerAddRule
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
            }
        }
    }
};
