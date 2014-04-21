var showEditWin = function(type, actionMode, model, options) {
    var match = '';
    var action = '';
    var name = '';
    var items = [];
    if (model) {
        match = model.raw.match;
        action = model.raw.action;
        name = model.raw.name;
    }
    var fieldName = {
        id: 'edit_win_name',
        xtype: 'textfield',
        name: 'name',
        value: name,
        fieldLabel: 'Name'
    };
    var fieldMatch = {
        id: 'edit_win_mactch',
        xtype: 'textfield',
        name: 'match',
        value: match,
        fieldLabel: 'Match'
    };
    var fieldAction = {
        id: 'edit_win_action',
        xtype: 'textfield',
        name: 'action',
        value: action,
        fieldLabel: 'Action'
    };
    if (type == 'proj') {
        items.push(fieldName);
        items.push(fieldMatch);
    } else {
        items.push(fieldMatch);
        items.push(fieldAction);
    }

    var win = new Ext.Window({
        title: 'New',
        width: 600,
        height: 150,
        resizable: false,
        closable: true,
        draggable: true,
        resizable: false,
        layout: 'fit',
        modal: true,
        plain: true,
        bodyStyle: 'padding:5px;',
        items: [{
            id: 'mappingForm',
            xtype: 'form',
            layout: 'form',
            padding: '10',
            plain: true,
            border: 0,
            fieldDefaults: {
                labelWidth: 45,
                labelAlign: 'right'
            },
            items: items
        }],
        buttons: [{
            text: '提交',
            type: 'button',
            handler: function() {
                if (actionMode == 'edit' && model) {
                    var node = poolTreeStore.getNodeById(model.data.id);
                    if (type == 'proj') {
                        node.set('name', Ext.getCmp('edit_win_name').getValue());
                        node.set('match', Ext.getCmp('edit_win_mactch').getValue());
                    } else {
                        node.set('match', Ext.getCmp('edit_win_mactch').getValue());
                        node.set('action', Ext.getCmp('edit_win_action').getValue());
                    }
                } else {
                    if (type == 'proj') {
                        var root = poolTreeStore.getRootNode();
                        var pid = +new Date();
                        var proj = {
                            // id: pid,
                            type: 'proj',
                            name: Ext.getCmp('edit_win_name').getValue(),
                            match: Ext.getCmp('edit_win_mactch').getValue(),
                            checked: true
                        };

                        var node = root.appendChild(proj);
                        node.appendChild({
                            // id: +new Date(),
                            name: 'handler',
                            type: 'group',
                            checked: true,
                            children: []
                        });
                        node.appendChild({
                            // id: +new Date(),
                            name: 'mocker',
                            type: 'group',
                            checked: true,
                            children: []
                        })
                        node.appendChild({
                            // id: +new Date(),
                            name: 'router',
                            type: 'group',
                            checked: true,
                            children: []
                        });
                    } else {
                        var sel = $cmp.poolTree.getSelectionModel().hasSelection() && $cmp.poolTree.getSelectionModel().getSelection()[0];
                        var node = {
                            // id: +new Date(),
                            name: '',
                            match: Ext.getCmp('edit_win_mactch').getValue(),
                            action: Ext.getCmp('edit_win_action').getValue(),
                            leaf: true,
                            checked: true
                        };
                        // no node selected -> default first proj and first group (handler)
                        if (!sel) {
                            sel = $cmp.poolTree.getRootNode().getChildAt(0).getChildAt(0);
                        } else if (sel.raw.type == 'proj') {
                            // selection at proj node -> default first group (handler)
                            sel = sel.getChildAt(0);
                        } else if (sel.raw.type == 'group') {
                            // nothing to do 
                        } else if (!sel.raw.type) {
                            // selection at leaf node (rule)
                            sel = sel.parentNode;
                        }
                        if (!sel) {
                            sel = $cmp.poolTree.getRootNode().getChildAt(0).getChildAt(0);
                        }
                        sel.appendChild(node);

                        if (options && options.idx) {
                            // additional to save session
                            var projBase = sel.parentNode.data.match;
                            var idx = options.idx;
                            Ext.Ajax.request({
                                url: '/handler/add',
                                params: {
                                    idx: idx,
                                    projBase: projBase,
                                    ruleAction: Ext.getCmp('edit_win_action').getValue()
                                },
                                method: 'POST',
                                success: function(response, options) {

                                },
                                failure: function(response, options) {

                                }
                            });
                        }
                    }
                }
                poolTreeStore.sync();
                win.close();
            }
        }, {
            text: '关闭',
            type: 'button',
            handler: function() {
                win.close();
            }
        }]
    });
    win.show();
};

var TAB_POOL = {
    title: 'Pool',
    border: 0,
    layout: 'fit',
    items: [{
        id: 'poolTree',
        xtype: 'treepanel',
        padding: 4,
        border: 1,
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
            id: 'disablePool',
            xtype: 'button',
            text: 'Disable Pool',
            enableToggle: true,
            handler: function() {
                Ext.Ajax.request({
                    url: '/tool/pool',
                    params: {
                        enable: this.pressed
                    },
                    method: 'POST'
                });
            }
        }, {
            id: 'poolAddProject',
            xtype: 'button',
            text: 'Add Project',
            handler: function() {
                showEditWin('proj', 'add');
            }
        }, {
            xtype: 'button',
            id: 'poolAddRule',
            text: 'Add Rule',
            handler: function() {
                showEditWin('rule', 'add');
            }
        }, '->', {
            xtype: 'button',
            tooltip: 'Expande All',
            iconCls: 'icomoon-flow-tree',
            handler: function() {
                var tree = Ext.getCmp('poolTree');
                tree.expandAll();
            }
        }, {
            xtype: 'button',
            tooltip: 'Collapse All',
            iconCls: 'icomoon-flow-cascade',
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
                getClass: function(v, meata, record) {
                    if (record.raw.type == 'group') {
                        return "p-hide-action-col-icon";
                    }
                    return 'icomoon-subtract'
                },
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
                getClass: function(v, meata, record) {
                    if (record.raw.type == 'group') {
                        return "p-hide-action-col-icon";
                    }
                    return 'icomoon-pencil3'
                },
                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                    switch (record.raw.type) {
                        case 'proj':
                            showEditWin('proj', 'edit', record);
                            break;
                        case 'group':
                            break;
                        default:
                            showEditWin('rule', 'edit', record);
                    }
                }
            }]
        }],
        listeners: {
            checkChange: function(node, checked, eOpts) {
                // if (checked == true) {
                //     node.checked = checked;
                //     //获得所有叶子节点,并将其选中状态与当前节点同步  
                //     // var childNodes = node.childNodes;
                //     // for (var i = 0; i < childNodes.length; i++) {
                //     //     var child = childNodes[i];
                //     //     if (child.get("leaf")) {
                //     //         child.set("checked", true);
                //     //     }
                //     // }

                //     // 获取所有父亲结点
                //     // var parent = node.parentNode;
                //     // while (parent) {
                //     //     parent.set('checked', true);
                //     //     parent = parent.parentNode;
                //     // }
                // }

                // 当前节点取消选中时，其叶子节点状态与其级联
                // if (!node.get("leaf") && !checked) {
                //     node.cascadeBy(function(node) {
                //         node.set('checked', checked);
                //     });
                // }

                poolTreeStore.sync();
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
    }],
    listeners: {
        activate: function(tab) {
            var tree = Ext.getCmp('poolTree');
            var ddrow = new Ext.dd.DropTarget(tree.body.dom, {
                ddGroup: 'GridDD',
                notifyEnter: function(ddSource, e, data) {

                },
                notifyDrop: function(dd, e, data) {
                    var record = data.records[0];
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
                        idx: record.data.idx
                    });
                }
            });
        }
    }
};
