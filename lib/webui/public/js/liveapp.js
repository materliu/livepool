// load ux
// Ext.Loader.setConfig({
//     enabled: true
// });
// Ext.Loader.setPath('Ext.ux', '../libs/ext/ux');
// Ext.require([
//     'Ext.ux.CheckColumn'
//     // 'Ext.ux.RowExpander',
// ]);

// ext component cache
var $cmp = {};

// {
//     text: 'Find',
//     iconCls: 'icomoon-search3'
// }, '-'
var TOOLBAR = [{
    text: 'LivePool',
    iconCls: 'icomoon-stackoverflow',
    menu: [{
        text: 'System Proxy On',
        id: 'chkProxy',
        checked: false,
        handler: function() {
            Ext.Ajax.request({
                url: '/tool/toggleproxy',
                params: {
                    check: this.checked
                },
                method: 'POST'
            });
        }
    }]
}, '-', {
    text: 'Replay',
    iconCls: 'icomoon-redo2',
    handler: function() {
        var grid = $cmp.sessionGrid;
        var selModel = grid.getSelectionModel();
        var isGridSelected = selModel.hasSelection();
        if (isGridSelected) {
            var data = selModel.getSelection()[0].data;
            var params = {
                method: data.method,
                body: data.reqBody,
                url: data.url,
                headers: JSON.stringify(data.reqHeaders)
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
    }
}, '-', {
    text: 'Remove',
    iconCls: 'icomoon-remove2',
    menu: [{
        text: 'Remove All',
        handler: observers.onRemoveAll
    }, {
        text: 'Images',
        handler: observers.onRemoveImages
    }, {
        text: 'NON 200s',
        handler: observers.onRemoveNon200s
    }]
}, '-', {
    text: 'Rules',
    iconCls: 'icomoon-list3',
    menu: [{
        text: 'Hide Images',
        checked: false,
        handler: observers.onRemoveImages
    }, {
        text: 'Hide 304s',
        checked: false,
        handler: observers.onRemoveNon200s
    }, {
        text: 'Hide CONNECTs',
        checked: false,
        handler: observers.onRemoveNon200s
    }, '-', {
        text: 'Disable Cache',
        checked: false
    }, {
        text: 'Disable Cache Force',
        checked: false
    }, '-', {
        text: 'Net Simulate',
        menu: {
            items: [{
                text: '10M',
                checked: true,
                group: 'net'
            }, {
                text: 'WIFI',
                checked: true,
                group: 'net'
            }, {
                text: '3g',
                checked: true,
                group: 'net'
            }, {
                text: '2g',
                checked: true,
                group: 'net'
            }]
        }
    }]
}, '-', {
    text: 'Tools',
    iconCls: 'icomoon-tools',
    menu: [{
        text: 'Keep Sessions',
        checked: false,
        handler: function() {
            Ext.Ajax.request({
                url: '/tool/keep',
                params: {
                    enable: this.checked
                },
                method: 'POST'
            });
        }
    }, '-', {
        text: 'Text Wizard'
    }, {
        text: 'Color Convert'
    }]
}, '-', {
    text: 'View',
    iconCls: 'icomoon-browser2',
    menu: [{
        text: 'Default Layout'
    }, {
        text: 'Stack Layout'
    }, {
        text: 'Wide Layout'
    }, '-', {
        text: 'Tab Setting'
    }, {
        text: 'Grid Setting'
    }]
}, '-', {
    text: 'Help',
    iconCls: 'icomoon-help',
    menu: [{
        text: 'About',
        handler: function() {
            Ext.MessageBox.alert('关于', '<div style="text-align:center;">LivePool<br/>Debugging Proxy Base on NodeJS<br/><a href="http://github.com/rehorn/livepool" target="blank">http://github.com/rehorn/livepool</a></div>');
        }
    }, {
        text: 'Author'
    }, {
        text: 'Github'
    }, '-', {
        text: 'Readme'
    }, {
        text: 'Keymap'
    }, '-', {
        text: '3rd'
    }]
}];

var MAIN_RIGHT_TABVIEW = {
    flex: 1,
    id: 'tabContainerRight',
    xtype: 'tabpanel',
    // ui: 'green-tab',
    defaults: {
        border: 0
    },
    items: [
        TAB_POOL, TAB_INSPECTORS,
        TAB_COMPOSER, TAB_FILTER, TAB_STAT,
        TAB_TIMELINE, TAB_LOG
    ]
};

var MAIN = {
    id: 'mainContainer',
    region: 'center',
    minWidth: 300,
    border: 0,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    tbar: TOOLBAR,
    items: [
        MAIN_SESSION_GRID, {
            xtype: 'splitter'
        },
        MAIN_RIGHT_TABVIEW
    ]
};

var NORTH = {
    region: 'south',
    height: 18,
    border: 0
};

Ext.grid.RowNumberer = Ext.extend(Ext.grid.RowNumberer, {
    width: 34
});

Ext.define('LivePool.App', {
    extend: 'Ext.container.Viewport',
    initComponent: function() {

        Ext.apply(this, {
            layout: 'border',
            items: [MAIN, NORTH]
        });

        this.callParent(arguments);
    }

});

Ext.onReady(function() {
    var app = new LivePool.App();

    // dom init and cache
    $cmp.logWin = Ext.getCmp('log');
    $cmp.sessionGrid = Ext.getCmp('gridpanel');
    $cmp.poolTree = Ext.getCmp('poolTree');
    $cmp.btnKeep = Ext.getCmp('btnKeep');
    $cmp.btnProxy = Ext.getCmp('btnProxy');
    $cmp.disablePool = Ext.getCmp('disablePool');
    $cmp.jsoneditor = null;
    $cmp.editIdx = null;
    $cmp.composerSession = null;

    // no spell check
    document.body.setAttribute('spellcheck', false);
});
