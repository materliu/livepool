var observers = {
    onRemoveAll: function(e) {
        store.removeAll();
    },
    onRemoveImages: function() {
        var all = store.snapshot || store.data;;
        all.each(function(record) {
            if (record.data.contentType.indexOf('image/') >= 0) {
                store.remove(record);
            }
        });
    },
    onRemoveNon200s: function() {
        var all = store.snapshot || store.data;;
        all.each(function(record) {
            if (record.data.result != 200) {
                store.remove(record);
            }
        });
    },
    onFilterGrid: function() {
        store.filter([{
            filterFn: function(item) {
                var filter1 = true,
                    filter2 = true,
                    filter3 = true,
                    filter4 = true,
                    filter5 = true,
                    filter6 = true,
                    filter7 = true;

                // filter1
                var type = $cmp.urlMatchType.getValue();
                var urls = $cmp.urlMatchValue.getValue();
                if (type && urls) {
                    var r = null;
                    urls = urls.split('\n');
                    // include
                    if (type == 1) {
                        r = _.find(urls, function(url) {
                            return item.get('url').indexOf(url) >= 0;
                        });
                    } else {
                        r = _.find(urls, function(url) {
                            return item.get('url').indexOf(url) < 0;
                        });
                    }
                    if (!r) {
                        filter1 = false;
                    }
                }

                // filter2
                if ($cmp.filterResStatusCode200.getValue() && item.get('result') == '200') {
                    filter2 = false;
                }

                // filter3
                if ($cmp.filterResStatusCodeN200.getValue() && item.get('result') != '200') {
                    filter3 = false;
                }

                // filter4
                if ($cmp.filterResStatusCodeRedirect.getValue() && item.get('result') == '304') {
                    filter3 = false;
                }

                // filter4
                if ($cmp.filterResStatusCodeRedirect.getValue() && _.contains(['300', '301', '302', '303', '307'], item.get('result'))) {
                    filter4 = false;
                }

                // filter5
                if ($cmp.filterResImages.getValue() && item.get('contentType').indexOf('images') >= 0) {
                    filter5 = false;
                }

                return filter1 && filter2 && filter3 && filter4 && filter5;
            }
        }]);
    },
    onMenuSet: function(key, value) {
        Ext.Ajax.request({
            url: '/menu/set',
            params: {
                value: value,
                key: key
            },
            method: 'POST'
        });
    },
    onShowCommingSoon: function() {
        Ext.MessageBox.alert('Note', 'Comming Soon');
    },
    onShowSessionItemClick: function(item, e) {
        $cmp.data.showSession = item.text;
        observers.onMenuSet('showSession', item.text);
    },
    onShowKeymapWin: function() {
        var _win = new Ext.Window({
            title: 'Key Map',
            width: 400,
            height: 200,
            resizable: false,
            closable: true,
            draggable: true,
            resizable: false,
            modal: true,
            plain: true,
            bodyStyle: 'padding:5px;',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                id: 'testEnvGrid',
                xtype: 'gridpanel',
                flex: 1,
                store: keyMapStore,
                viewConfig: {
                    loadMask: false
                },
                columns: [{
                    text: 'Key Map',
                    dataIndex: 'key',
                    menuDisabled: true,
                    width: 60
                }, {
                    text: 'Action',
                    dataIndex: 'text',
                    menuDisabled: true,
                    flex: 1
                }]
            }]
        });
        _win.show();
    },
    onShowViewSetting: function() {
        var _win = new Ext.Window({
            title: 'View Setting',
            width: 600,
            height: 340,
            resizable: false,
            closable: true,
            draggable: true,
            resizable: false,
            modal: true,
            plain: true,
            bodyStyle: 'padding:5px;',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                id: 'viewSettingForm',
                xtype: 'form',
                layout: 'form',
                padding: '5',
                plain: true,
                border: 0,
                items: [{
                    xtype: 'fieldset',
                    title: 'Layout',
                    items: [{
                        id: 'layoutSetting',
                        xtype: 'radiogroup',
                        fieldLabel: '',
                        items: [{
                            boxLabel: 'Default',
                            name: 'layout',
                            inputValue: 'Default'
                        }, {
                            boxLabel: 'Stack',
                            name: 'layout',
                            inputValue: 'Stack'
                        }, {
                            boxLabel: 'Wide',
                            name: 'layout',
                            inputValue: 'Wide',
                            checked: true
                        }]
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Tab',
                    items: [{
                        id: 'tabSetting',
                        xtype: 'checkboxgroup',
                        fieldLabel: '',
                        columns: 4,
                        defaults: {
                            checked: true,
                            name: 'tabSetting'
                        },
                        items: [{
                            boxLabel: 'Pool',
                            inputValue: 'Pool'
                        }, {
                            boxLabel: 'Inspectors',
                            inputValue: 'Inspectors'
                        }, {
                            boxLabel: 'Composer',
                            inputValue: 'Composer'
                        }, {
                            boxLabel: 'Filter',
                            inputValue: 'Filter'
                        }, {
                            boxLabel: 'Statistics',
                            inputValue: 'Statistics'
                        }, {
                            boxLabel: 'Timeline',
                            inputValue: 'Timeline'
                        }, {
                            boxLabel: 'Log',
                            inputValue: 'Log'
                        }]
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Session Columns',
                    items: [{
                        xtype: 'checkboxgroup',
                        columns: 4,
                        fieldLabel: '',
                        id: 'sessionColumns',
                        defaults: {
                            checked: true,
                            name: 'sessionColumns'
                        },
                        items: [{
                            boxLabel: 'Protocol',
                            inputValue: 'Protocol'
                        }, {
                            boxLabel: 'Method',
                            inputValue: 'Method'
                        }, {
                            boxLabel: 'Host',
                            inputValue: 'Host'
                        }, {
                            boxLabel: 'Path',
                            inputValue: 'Path'
                        }, {
                            boxLabel: 'Caching',
                            inputValue: 'Caching'
                        }, {
                            boxLabel: 'ContentType',
                            inputValue: 'ContentType'
                        }, {
                            boxLabel: 'Body',
                            inputValue: 'Body'
                        }, {
                            boxLabel: 'Time',
                            inputValue: 'Time'
                        }]
                    }]
                }]
            }],
            buttons: [{
                text: '提交',
                handler: function() {
                    var form = Ext.getCmp('viewSettingForm').getForm();
                    if (form.isValid()) {
                        Ext.Ajax.request({
                            url: '/view/set',
                            method: 'post',
                            params: {
                                layout: Ext.getCmp('layoutSetting').getValue(),
                                tabSetting: Ext.getCmp('tabSetting').getValue(),
                                sessionColumns: Ext.getCmp('sessionColumns').getValue()
                            },
                            success: function(response, options) {
                                Ext.MessageBox.confirm('Note', 'Save Done, Leave and Reload?', function(btn) {
                                    if (btn == 'yes') {
                                        window.location.reload();
                                    }
                                });
                            },
                            failure: function() {}
                        });
                    }
                }
            }]
        });
        _win.show();

        Ext.getCmp('layoutSetting').setValue({
            'layout': $cmp.data.layout
        });
        Ext.getCmp('tabSetting').setValue({
            'tabSetting': $cmp.data.tabSetting.split(',')
        });
        Ext.getCmp('sessionColumns').setValue({
            'sessionColumns': $cmp.data.sessionColumns.split(',')
        });
    },
    onSessionReplay: function(force) {
        var grid = $cmp.sessionGrid;
        var selModel = grid.getSelectionModel();
        var isGridSelected = selModel.hasSelection();
        if (isGridSelected) {
            var data = selModel.getSelection()[0].data;
            // var url = force ? utils.updateQueryStringParameter(data.url, '_t', +new Date()) : data.url;
            var params = {
                method: data.method,
                body: data.reqBody,
                url: data.url,
                headers: force ? {} : JSON.stringify(data.reqHeaders)
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
    },
    onShowFileSelecteWin: function() {
        var ruleTobeImport = '';
        var _win = new Ext.Window({
            title: 'Select',
            width: 400,
            height: 114,
            resizable: false,
            closable: true,
            draggable: true,
            resizable: false,
            modal: true,
            plain: true,
            bodyStyle: 'padding:5px;',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                    xtype: 'panel',
                    height: 40,
                    html: '<input id="fileSelected" style="margin:10px;" type="file" accept="application/javascript"></input>'
                }
                // , {
                //     xtype: 'container',
                //     flex: 1,
                //     margin: '4 0 0 0',
                //     html: '<div id="drop_zone">or Drop files here</div>'
                // }
            ],
            buttons: [{
                text: 'Submit',
                handler: function() {
                    Ext.Ajax.request({
                        url: '/rule/import',
                        params: {
                            rules: ruleTobeImport
                        },
                        method: 'POST',
                        success: function(response, options) {

                        },
                        failure: function(response, options) {}
                    });
                }
            }]
        });
        _win.show();

        function handleFileSelect(evt) {
            var files = evt.target.files;
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    ruleTobeImport = e.target.result;
                };
                reader.readAsText(f);
            }
        }

        document.getElementById('fileSelected').addEventListener('change', handleFileSelect, false);

        // function handleFileSelectZone(evt) {
        //     evt.stopPropagation();
        //     evt.preventDefault();
        //     var files = evt.dataTransfer.files;
        //     var output = [];
        //     for (var i = 0, f; f = files[i]; i++) {
        //         console.log(f)
        //     }
        // }

        // function handleDragOver(evt) {
        //     evt.stopPropagation();
        //     evt.preventDefault();
        //     evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        // }

        // // Setup the dnd listeners.
        // var dropZone = document.getElementById('drop_zone');
        // dropZone.addEventListener('dragover', handleDragOver, false);
        // dropZone.addEventListener('drop', handleFileSelectZone, false);
    }
};
