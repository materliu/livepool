var initKeyMap = function() {

    // keymap
    new Ext.KeyMap(Ext.getDoc(), {
        key: 'x',
        ctrl: true,
        handler: function(key, event) {
            store.removeAll();
        },
        stopEvent: true
    });

};
