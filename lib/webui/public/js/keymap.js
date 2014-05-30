var initKeyMap = function() {

    // keymap
    // ctrl+x to remove all session @ session grid 
    new Ext.KeyMap('gridpanel', {
        key: 'x',
        ctrl: true,
        handler: function(key, event) {
            store.removeAll();
        },
        stopEvent: true
    });

    // r to replay current 
    new Ext.KeyMap('gridpanel', {
        key: 'r',
        handler: function(key, event) {
            observers.onSessionReplay();
            observers.onScrollGridToEnd();
        },
        stopEvent: true
    });

    // shift+c to clone 
    new Ext.KeyMap('poolTree', {
        key: 'c',
        shift: true,
        handler: function(key, event) {
            observers.pool.onClone();
        },
        stopEvent: true
    });
    new Ext.KeyMap('poolTree', {
        key: 'd',
        shift: true,
        handler: function(key, event) {
            if (!$cmp.poolTree.getSelectionModel().hasSelection()) {
                $cmp.poolTree.selModel.doSelect($cmp.poolTree.getRootNode().getChildAt(0));
            }
            var sel = $cmp.poolTree.getSelectionModel().getSelection()[0];
            if (sel.data.type != 'group') {
                observers.pool.onDelete(sel);
            }
        },
        stopEvent: true
    });
};
