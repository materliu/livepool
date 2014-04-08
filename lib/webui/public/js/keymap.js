Ext.onReady(function() {

    // keymap
    new Ext.KeyMap(Ext.getDoc(), {
        key: 'd',
        ctrl: true,
        handler: function(key, event) {
            store.removeAll();
        },
        stopEvent: true
    });

});
