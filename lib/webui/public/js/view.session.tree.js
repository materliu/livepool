var sessionTreeCacheMap = {};
var SESSION_TREE = {
    addNode: function(path, name, parent) {
        var _node = {
            path: path,
            name: name,
            children: []
        };
        sessionTreeCacheMap[path] = _node;
        parent.children.push(_node);
        return _node;
    },
    addToTree: function(node, root) {
        node = node.data;
        var path = node.host;
        var pathname = node.pathname == '/' ? '/index' : node.pathname;
        var dirname = pathname.substring(0, pathname.lastIndexOf('/'));
        var parentNodeName = path + dirname;
        var parentNode = sessionTreeCacheMap[parentNodeName];
        if (!parentNode) {
            // like mkdirp
            if (dirname) {
                var pathSplit = dirname.split('/');
                _.each(pathSplit, function(split) {
                    if (split == '') return;
                    var _parent = sessionTreeCacheMap[path];
                    if (!_parent) {
                        _parent = SESSION_TREE.addNode(path, path, root);
                    }

                    path += '/' + split;

                    var _node = sessionTreeCacheMap[path];
                    if (!_node) {
                        _node = SESSION_TREE.addNode(path, split, _parent);
                    }
                });
            } else {
                SESSION_TREE.addNode(path, path, root);
            }
            parentNode = sessionTreeCacheMap[parentNodeName];
        }
        var nodeGroup = {
            id: node.id,
            path: node.host + node.pathname,
            name: pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length),
            children: []
        };
        if (parentNode) {
            parentNode.children.push(nodeGroup);
        }
    },
    createTreeFromStore: function(s) {
        sessionTreeCacheMap = {};
        var all = s.snapshot || s.data;
        var root = {
            path: 'root',
            expand: true,
            children: []
        };
        all.each(function(record) {
            SESSION_TREE.addToTree(record, root);
        });
        return root;
    },
    refresh: function() {
        if ($cmp.pathTree) {
            var node = null,
                path = null;
            if ($cmp.pathTree.getSelectionModel().hasSelection()) {
                node = $cmp.pathTree.getSelectionModel().getSelection()[0];
                path = node.getPath('name');
            }

            var treeStore = $cmp.pathTree.getStore();
            var data = SESSION_TREE.createTreeFromStore(store);
            treeStore.removeAll();
            treeStore.setRootNode(data);
            // $cmp.pathTree.expandPath(tState);
            if (node) {
                $cmp.pathTree.expandPath(path, 'name', null, function(bSucess, oLastNode) {
                    $cmp.pathTree.getSelectionModel().select(oLastNode);
                }, this);
            }
        }
    },
    show: function(checked) {
        if (checked) {
            // load store data
            var data = SESSION_TREE.createTreeFromStore(store);
            var treeStore = Ext.create('Ext.data.TreeStore', {
                fields: ['id', 'path', 'name'],
                root: data,
                autoLoad: true
            });
            var MAIN_SESSION_TREE = {
                id: 'mainSessionTree',
                xtype: 'treepanel',
                ui: 'blue-panel',
                store: treeStore,
                border: 1,
                flex: 1,
                margin: (CONST.layout == 'Wide') ? '0 0 0 5' : '5 0 0 0',
                useArrows: true,
                rootVisible: false,
                columns: [{
                        xtype: 'treecolumn',
                        text: 'pathname',
                        dataIndex: 'name',
                        menuDisabled: true,
                        flex: 1
                    }
                    // , {
                    //     text: 'path',
                    //     dataIndex: 'path',
                    //     menuDisabled: true,
                    //     flex: 1
                    // }
                ],
                bbar: ['->', {
                    xtype: 'button',
                    tooltip: 'Auto Refresh',
                    enableToggle: true,
                    iconCls: 'icomoon-cycle',
                    handler: function() {
                        $cmp.data.autoRefeshTree = this.pressed;
                    }
                }, {
                    xtype: 'button',
                    tooltip: 'Refresh',
                    iconCls: ' icomoon-cw',
                    handler: function() {
                        SESSION_TREE.refresh();
                    }
                }, {
                    xtype: 'button',
                    tooltip: 'Expande All',
                    iconCls: 'icomoon-flow-tree',
                    handler: function() {
                        $cmp.pathTree.expandAll();
                    }
                }, {
                    xtype: 'button',
                    tooltip: 'Expande Selected',
                    iconCls: 'icomoon-flow-branch',
                    handler: function() {
                        if ($cmp.pathTree.getSelectionModel().hasSelection()) {
                            var node = $cmp.pathTree.getSelectionModel().getSelection()[0];
                            node.expand(true);
                            node.expandChildren(true);
                        }
                    }
                }, {
                    xtype: 'button',
                    tooltip: 'Collapse All',
                    iconCls: 'icomoon-flow-cascade',
                    handler: function() {
                        $cmp.pathTree.collapseAll();
                    }
                }],
                listeners: {
                    celldblclick: function(that, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                        if (record.data.id) {
                            var r = store.findRecord('id', record.data.id);
                            if (!r) return;
                            $cmp.sessionGrid.getView().focusRow(r);
                            $cmp.sessionGrid.selModel.doSelect(r);
                            $cmp.tabContainerRight.setActiveTab('tabInspectors');
                            inspectorHandler.inspect(r);
                        }
                    }
                }
            };
            $cmp.sessionTreeStore = treeStore;
            $cmp.pathTree = Ext.create('Ext.tree.Panel', MAIN_SESSION_TREE);
            // $cmp.mainSessionSplit = Ext.create('Ext.resizer.Splitter', {});
            // $cmp.mainSession.add($cmp.mainSessionSplit);
            // setTimeout(function() {
            $cmp.mainSession.add($cmp.pathTree);
            // }, 100);
        } else {
            $cmp.mainSession.remove($cmp.pathTree);
            $cmp.pathTree = null;
        }
    }
};
