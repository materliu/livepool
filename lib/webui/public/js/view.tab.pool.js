var showEditWin = function(type, action, model) {
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
        title: 'New Rule',
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
                var node = poolTreeStore.getNodeById(model.raw.id);
                if (type == 'proj') {
                    node.set('name', Ext.getCmp('edit_win_name').getValue());
                    node.set('match', Ext.getCmp('edit_win_mactch').getValue());
                } else {
                    node.set('match', Ext.getCmp('edit_win_mactch').getValue());
                    node.set('action', Ext.getCmp('edit_win_action').getValue());
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
                getClass: function(v, meata, record) {
                    if (record.raw.type == 'group') {
                        return "p-hide-action-col-icon";
                    }
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
    }]
};
