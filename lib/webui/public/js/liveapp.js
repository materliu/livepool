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
var $data = {
    hide304s: false,
    hideImages: false
};

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
            observers.onMenuSet('proxy', this.checked);
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
        text: 'Set Filters',
        handler: function() {
            var tabContainerRight = Ext.getCmp('tabContainerRight');
            tabContainerRight.setActiveTab(3);
        }
    }, '-', {
        id: 'menuDisableCache',
        text: 'Disable Cache',
        checked: false,
        handler: function() {
            observers.onMenuSet('disableCache', this.checked);
        }
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
        id: 'btnKeep',
        text: 'Keep Sessions',
        checked: false,
        handler: function() {
            observers.onMenuSet('keep', this.checked);
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
        text: 'Auto Scroll',
        checked: false
    }, '-', {
        text: 'View Settings'
    }, '-', {
        text: 'Show Sessions',
        menu: {
            items: [{
                text: 'All',
                checked: true,
                group: 'showSession'
            }, {
                text: '100',
                checked: true,
                group: 'showSession'
            }, {
                text: '200',
                checked: true,
                group: 'showSession'
            }, {
                text: '500',
                checked: true,
                group: 'showSession'
            }, {
                text: '1000',
                checked: true,
                group: 'showSession'
            }]
        }
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
        text: 'Github',
        href: 'http://github.com/rehorn/livepool',
        hrefTarget: '_blank'
    }, '-', {
        text: 'Keymap'
    }, {
        text: 'Readme',
        href: 'http://github.com/rehorn/livepool',
        hrefTarget: '_blank'
    }, '-', {
        text: 'Thanks 3rd'
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
        TAB_COMPOSER, TAB_FILTER
        // , TAB_STAT, TAB_TIMELINE
        , TAB_LOG
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
    CONST.layout = 'wide';
    // layout setting
    if (CONST.layout == 'stack') {
        MAIN.layout.type = 'vbox';
    } else if (CONST.layout == 'wide') {
        MAIN.layout.type = 'vbox';
        TAB_INSPECTORS.layout.type = 'hbox';
        TAB_INSPECTORS_RES.flex = 1;
    }

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

    $cmp.menuDisableCache = Ext.getCmp('menuDisableCache');

    $cmp.useFilter = Ext.getCmp('useFilter');
    $cmp.urlMatchValue = Ext.getCmp('urlMatchValue');
    $cmp.urlMatchType = Ext.getCmp('urlMatchType');
    $cmp.filterResStatusCodeNotModified = Ext.getCmp('filterResStatusCodeNotModified');
    $cmp.filterResStatusCode200 = Ext.getCmp('filterResStatusCode200');
    $cmp.filterResStatusCodeN200 = Ext.getCmp('filterResStatusCodeN200');
    $cmp.filterResStatusCodeRedirect = Ext.getCmp('filterResStatusCodeRedirect');
    $cmp.filterResImages = Ext.getCmp('filterResImages');

    // no spell check
    document.body.setAttribute('spellcheck', false);
});
