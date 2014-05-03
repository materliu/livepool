var inspectorHandler = {
    toUnicode: function() {
        var text = RES_VIEWER._el.getValue();
        RES_VIEWER._el.setValue(utils.toUnicode(text));
    },
    unUnicode: function() {
        var text = RES_VIEWER._el.getValue();
        RES_VIEWER._el.setValue(utils.unUnicode(text));
    },
    inspect: function(record) {
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

        Ext.getCmp('inspactors_res_view_Image').toggle(false);
        Ext.getCmp('inspactors_res_view_JSON').toggle(false);
        Ext.getCmp('inspactors_res_view_Other').toggle(false);
        Ext.getCmp('inspactors_res_view_Text').toggle(false);
        Ext.getCmp('inspactors_res_view_Raw').toggle(false);

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
};

var inspactorsResViewToolbarToggle = function(btn, pressed) {
    if (pressed && $cmp.editRecord) {
        var el = $cmp.inspactors_res_view_container;
        var record = $cmp.editRecord;
        switch (btn.text) {
            case 'Image':
                RES_VIEWER.showImageViewer(el, record);
                break;
            case 'JSON':
                RES_VIEWER.showJsonViewer(el, record);
                break;
            case 'Text':
                RES_VIEWER.showTextViewer(el, record);
                break;
            case 'Other':
                RES_VIEWER.showOtherViewer(el, record);
                break;
            case 'Raw':
                RES_VIEWER.showRawViewer(el, record);
                break;
            default:
        }
    }
};

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

var RES_VIEWER = {
    _type: 'other',
    _el: null,
    _typeChanged: function() {
        var inspactors_res_view_tool_unicode = Ext.getCmp('inspactors_res_view_tool_unicode');
        var inspactors_res_view_tool_beautify = Ext.getCmp('inspactors_res_view_tool_beautify');
        var inspactors_res_view_tool_save = Ext.getCmp('inspactors_res_view_tool_save');
        var inspactors_res_view_tool_addrule = Ext.getCmp('inspactors_res_view_tool_addrule');
        var inspactors_res_view_tool_download = Ext.getCmp('inspactors_res_view_tool_download');
        switch (RES_VIEWER._type) {
            case 'Image':
                inspactors_res_view_tool_unicode.setDisabled(true);
                inspactors_res_view_tool_beautify.setDisabled(true);
                inspactors_res_view_tool_save.setDisabled(true);
                inspactors_res_view_tool_addrule.setDisabled(false);
                inspactors_res_view_tool_download.setDisabled(false);
                break;
            case 'JSON':
                inspactors_res_view_tool_unicode.setDisabled(true);
                inspactors_res_view_tool_beautify.setDisabled(true);
                inspactors_res_view_tool_save.setDisabled(false);
                inspactors_res_view_tool_addrule.setDisabled(false);
                inspactors_res_view_tool_download.setDisabled(false);
                break;
            case 'Text':
                inspactors_res_view_tool_unicode.setDisabled(false);
                inspactors_res_view_tool_beautify.setDisabled(false);
                inspactors_res_view_tool_save.setDisabled(false);
                inspactors_res_view_tool_addrule.setDisabled(false);
                inspactors_res_view_tool_download.setDisabled(false);
                break;
            case 'Other':
                inspactors_res_view_tool_unicode.setDisabled(true);
                inspactors_res_view_tool_beautify.setDisabled(true);
                inspactors_res_view_tool_save.setDisabled(true);
                inspactors_res_view_tool_addrule.setDisabled(false);
                inspactors_res_view_tool_download.setDisabled(false);
                break;
            case 'Raw':
                inspactors_res_view_tool_unicode.setDisabled(false);
                inspactors_res_view_tool_beautify.setDisabled(false);
                inspactors_res_view_tool_save.setDisabled(false);
                inspactors_res_view_tool_addrule.setDisabled(false);
                inspactors_res_view_tool_download.setDisabled(false);
                break;
            default:
        }
    },
    getValue: function() {

    },
    showImageViewer: function(el, record) {
        var ext = record.data.contentType;
        if (ext.indexOf(',') >= 0) {
            ext = ext.split(',')[0];
        }
        el.removeAll();
        // image view
        var container = Ext.create('Ext.container.Container', {
            baseCls: 'tran-background',
            flex: 1,
            margin: '0 0 4 0',
            padding: 10
        });
        var img = Ext.create('Ext.Img', {
            src: '/res/get?idx=' + record.data.idx + '&ext=' + ext
        });
        container.add(img);
        el.add(container);

        RES_VIEWER._type = 'Image';
        RES_VIEWER._el = container;
        RES_VIEWER._typeChanged();
    },
    showIframeViewer: function(el, record) {
        // iframe page view
        // var panel2 = new Ext.Panel({
        //     id: "panel2",
        //     fitToFrame: true,
        //     html: '<iframe id="frame1" src="/res/json/' + record.data.idx + '" frameborder="0" width="100%" height="100%"></iframe>'
        // });
        // resView.add(panel2);
        RES_VIEWER._type = 'Iframe';
        RES_VIEWER._typeChanged();
    },
    showJsonViewer: function(el, record) {
        el.removeAll();
        // json view
        var panel = new Ext.Panel({
            id: "panel",
            flex: 1,
            margin: '0 0 4 0',
            html: '<div id="jsonPanel" style="height:100%;"></div>'
        });
        el.add(panel);

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
        RES_VIEWER._type = 'JSON';
        RES_VIEWER._el = jsonPanel;
        RES_VIEWER._typeChanged();
    },
    showOtherViewer: function(el, record) {
        el.removeAll();
        var panel = new Ext.Panel({
            flex: 1,
            margin: '0 0 4 0',
            html: '<div style="padding:10px;">' + record.data.contentType + '<br/>-----------<br/>click raw to view' + '</div>'
        });
        el.add(panel);
        RES_VIEWER._type = 'Other';
        RES_VIEWER._el = panel;
        RES_VIEWER._typeChanged();
    },
    showTextViewer: function(el, record) {
        el.removeAll();
        var textArea = Ext.create('Ext.form.field.TextArea', {
            flex: 1,
            fieldStyle: "background: #FEFEFE none repeat scroll 0 0 !important;"
        });
        el.add(textArea);
        // var langType = 'language-markup';
        // if (ext.indexOf('javascript') >= 0) {
        //     langType = 'language-javascript';
        // } else if (ext.indexOf('css') >= 0) {
        //     langType = 'language-css';
        // }
        // var panel2 = new Ext.Panel({
        //     flex: 1,
        //     html: '<div id="codeEditor"></div>'
        // });
        Ext.Ajax.request({
            url: '/res/get',
            params: {
                idx: record.data.idx
            },
            method: 'GET',
            success: function(response, options) {
                textArea.setValue(response.responseText);
                // var codeEditor = document.getElementById('codeEditor');
                // if (codeEditor) {
                //     codeEditor.innerHTML = '<pre><code class="' + langType + '">' + response.responseText + '</pre></code>';
                //     Prism.highlightAll();
                // }
            },
            failure: function(response, options) {
                textArea.setValue('LivePool后台服务超时,错误编号：' + response.status);
                // var codeEditor = document.getElementById('codeEditor');
                // if (codeEditor) {
                //     codeEditor.innerHTML = 'LivePool后台服务超时,错误编号：' + response.status;
                // }
            }
        });
        RES_VIEWER._type = 'Text';
        RES_VIEWER._el = textArea;
        RES_VIEWER._typeChanged();
    },
    showRawViewer: function(el, record) {
        el.removeAll();
        var textArea = Ext.create('Ext.form.field.TextArea', {
            flex: 1,
            fieldStyle: "background: #FEFEFE none repeat scroll 0 0 !important;"
        });
        el.add(textArea);

        // load
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

        RES_VIEWER._type = 'Raw';
        RES_VIEWER._el = textArea;
        RES_VIEWER._typeChanged();
    }
};

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
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            id: 'inspactors_res_view_container',
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        }, {
            xtype: 'toolbar',
            height: '20',
            border: 1,
            items: [{
                    id: 'inspactors_res_view_Image',
                    xtype: 'button',
                    text: 'Image',
                    iconCls: 'icomoon-image',
                    enableToggle: true,
                    toggleGroup: 'resViewType',
                    toggleHandler: inspactorsResViewToolbarToggle
                }, {
                    id: 'inspactors_res_view_JSON',
                    xtype: 'button',
                    text: 'JSON',
                    iconCls: 'icomoon-list3',
                    enableToggle: true,
                    toggleGroup: 'resViewType',
                    toggleHandler: inspactorsResViewToolbarToggle
                }, {
                    id: 'inspactors_res_view_Text',
                    xtype: 'button',
                    text: 'Text',
                    enableToggle: true,
                    iconCls: 'icomoon-menu3',
                    toggleGroup: 'resViewType',
                    toggleHandler: inspactorsResViewToolbarToggle
                }, {
                    id: 'inspactors_res_view_Other',
                    xtype: 'button',
                    text: 'Other',
                    iconCls: 'icomoon-grid-alt',
                    enableToggle: true,
                    toggleGroup: 'resViewType',
                    toggleHandler: inspactorsResViewToolbarToggle
                }, {
                    id: 'inspactors_res_view_Raw',
                    xtype: 'button',
                    text: 'Raw',
                    iconCls: 'icomoon-disk',
                    enableToggle: true,
                    toggleGroup: 'resViewType',
                    toggleHandler: inspactorsResViewToolbarToggle
                },
                '->', {
                    id: 'inspactors_res_view_tool_unicode',
                    text: '',
                    tooltip: 'Unicode',
                    iconCls: 'icomoon-underline',
                    xtype: 'splitbutton',
                    handler: inspectorHandler.unUnicode,
                    menu: [{
                        text: 'toUnicode',
                        handler: inspectorHandler.toUnicode
                    }, {
                        text: 'unUnicode',
                        handler: inspectorHandler.unUnicode
                    }]
                }, {
                    id: 'inspactors_res_view_tool_beautify',
                    xtype: 'button',
                    text: '',
                    tooltip: 'Beautify',
                    iconCls: 'icomoon-paint-format',
                    margin: '0 5',
                    handler: function() {
                        Ext.Ajax.request({
                            url: '/res/beautify',
                            params: {
                                idx: $cmp.editRecord.data.idx,
                                ctype: $cmp.editRecord.data.contentType
                            },
                            method: 'GET',
                            success: function(response, options) {
                                RES_VIEWER._el.setValue(response.responseText);
                                // var codeEditor = document.getElementById('codeEditor');
                                // if (codeEditor) {
                                //     codeEditor.innerHTML = '<pre><code class="' + langType + '">' + response.responseText + '</pre></code>';
                                //     Prism.highlightAll();
                                // }
                            },
                            failure: function(response, options) {
                                RES_VIEWER._el.setValue('LivePool后台服务超时,错误编号：' + response.status);
                                // var codeEditor = document.getElementById('codeEditor');
                                // if (codeEditor) {
                                //     codeEditor.innerHTML = 'LivePool后台服务超时,错误编号：' + response.status;
                                // }
                            }
                        });
                    }
                }, {
                    id: 'inspactors_res_view_tool_save',
                    xtype: 'button',
                    tooltip: 'Save',
                    text: '',
                    iconCls: 'icomoon-disk',
                    handler: function() {
                        var data = RES_VIEWER._el.getValue();
                        Ext.Ajax.request({
                            url: '/res/edit',
                            params: {
                                idx: $cmp.editRecord.data.idx,
                                data: data
                            },
                            method: 'POST',
                            success: function(response, options) {

                            },
                            failure: function(response, options) {}
                        });
                    }
                }, {
                    id: 'inspactors_res_view_tool_addrule',
                    xtype: 'button',
                    tooltip: 'Add Rule',
                    text: '',
                    iconCls: 'icomoon-add',
                    handler: handlerAddRule
                }, {
                    id: 'inspactors_res_view_tool_download',
                    xtype: 'button',
                    iconCls: 'icomoon-download4',
                    text: '',
                    tooltip: 'Download',
                    handler: function() {
                        var filename = $cmp.editRecord.data.url;
                        filename = filename.replace(/\?.*$/, "").replace(/.*\//, "")
                        window.location.href = '/res/down/' + $cmp.editRecord.data.idx + '/' + filename;
                    }
                }
            ]
        }]
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
