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
};
