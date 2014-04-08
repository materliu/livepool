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
            var cookies = util.parseCookie(record.data.reqHeaders.cookie);
            reqCookieStore.loadData(cookies);
            var headers = util.parseHeader(reqHeadersText);
            reqHeaderStore.loadData(headers);

            // res
            var resHeadersText = util.objToPlain(record.data.resHeaders);
            var resRaw = Ext.getCmp('inspactors_res_raw');
            resRaw.setValue(resHeadersText);
            var headers = util.parseHeader(resHeadersText);
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
};
