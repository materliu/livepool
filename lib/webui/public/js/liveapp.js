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
$cmp.data = {
    autoScroll: false,
    showSession: 'All',
    layout: 'Wide',
    tabSetting: '',
    sessionColumns: ''
};

// {
//     text: 'Find',
//     iconCls: 'icomoon-search3'
// }, '-'
var TOOLBAR = [{
    text: 'LivePool',
    iconCls: 'icomoon-stackoverflow',
    menu: [{
        text: 'System Proxy',
        id: 'chkProxy',
        checked: false,
        handler: function() {
            observers.onMenuSet('proxy', this.checked);
        }
    }, {
        text: 'HTTPs',
        handler: observers.onShowCommingSoon
    }]
}, '-', {
    text: 'Replay',
    iconCls: 'icomoon-redo2',
    handler: observers.onSessionReplay
}, '-', {
    text: 'Remove',
    iconCls: 'icomoon-remove2',
    xtype: 'splitbutton',
    handler: observers.onRemoveAll,
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
                tabContainerRight.setActiveTab('tabFilter');
            }
        },
        // '-', {
        //     id: 'menuDisableCache',
        //     text: 'Disable Cache',
        //     checked: false,
        //     handler: function() {
        //         observers.onMenuSet('disableCache', this.checked);
        //     }
        // },
        '-', {
            text: 'Net Simulate',
            menu: {
                items: [
                    '<b style="color:white">Comming Soon</b>', {
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
                    }
                ]
            }
        }
    ]
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
        text: 'Text Wizard',
        handler: observers.onShowCommingSoon
    }, {
        text: 'Color Convert',
        handler: observers.onShowCommingSoon
    }, {
        text: 'Code Beautify',
        handler: observers.onShowCommingSoon
    }, {
        text: 'Magic Box',
        handler: observers.onShowCommingSoon
    }]
}, '-', {
    text: 'View',
    iconCls: 'icomoon-browser2',
    menu: [{
        id: 'btnAutoScroll',
        text: 'Auto Scroll',
        checked: false,
        handler: function() {
            $cmp.data.autoScroll = this.checked;
            observers.onMenuSet('autoScroll', this.checked);
        }
    }, '-', {
        text: 'View Settings',
        handler: observers.onShowViewSetting
    }, '-', {
        id: 'radioShowSession',
        text: 'Show Sessions',
        menu: {
            items: [{
                text: 'All',
                checked: false,
                group: 'showSession',
                handler: observers.onShowSessionItemClick
            }, {
                text: '100',
                checked: false,
                group: 'showSession',
                handler: observers.onShowSessionItemClick
            }, {
                text: '200',
                checked: false,
                group: 'showSession',
                handler: observers.onShowSessionItemClick
            }, {
                text: '500',
                checked: false,
                group: 'showSession',
                handler: observers.onShowSessionItemClick
            }, {
                text: '1000',
                checked: false,
                group: 'showSession',
                handler: observers.onShowSessionItemClick
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
        text: 'Keymap',
        handler: observers.onShowKeymapWin
    }, {
        text: 'Readme',
        href: 'http://github.com/rehorn/livepool',
        hrefTarget: '_blank'
    }]
}, '->', {
    text: 'TreeView',
    enableToggle: true,
    iconCls: 'icomoon-arrow-left3',
    handler: function() {
        SESSION_TREE.show(this.pressed);
    }
}];

var MAIN_RIGHT_TABVIEW = {
    flex: 1,
    id: 'tabContainerRight',
    xtype: 'tabpanel',
    // ui: 'green-tab',
    defaults: {
        border: 0
    },
    items: []
};

var SPLITER = {
    xtype: 'splitter'
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
        MAIN_SESSION,
        SPLITER,
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

var customView = function() {
    // layout setting
    if (CONST.layout == 'Stack') {
        MAIN.layout.type = 'vbox';
    } else if (CONST.layout == 'Wide') {
        MAIN.layout.type = 'vbox';
        TAB_INSPECTORS.layout.type = 'hbox';
        TAB_INSPECTORS_RES.flex = 1;
        MAIN_SESSION.layout.type = 'hbox';
    }
    // tab setting
    var tabs = [
        TAB_POOL, TAB_INSPECTORS,
        TAB_COMPOSER, TAB_FILTER
        // , TAB_STAT, TAB_TIMELINE
        , TAB_LOG
    ];
    if ($cmp.data.tabSetting) {
        tabs = [];
        var tabMap = {
            'Pool': TAB_POOL,
            'Inspectors': TAB_INSPECTORS,
            'Composer': TAB_COMPOSER,
            'Filter': TAB_FILTER,
            'Statistics': TAB_STAT,
            'Timeline': TAB_TIMELINE,
            'Log': TAB_LOG
        };
        _.each($cmp.data.tabSetting.split(','), function(item) {
            if (tabMap[item]) {
                tabs.push(tabMap[item]);
            }
        });
    }
    MAIN_RIGHT_TABVIEW.items = tabs;
};

var initDom = function() {
    // dom init and cache
    $cmp.logWin = Ext.getCmp('log');
    $cmp.sessionGrid = Ext.getCmp('gridpanel');
    $cmp.mainSession = Ext.getCmp('mainSession');
    $cmp.poolTree = Ext.getCmp('poolTree');
    $cmp.tabContainerRight = Ext.getCmp('tabContainerRight');
    $cmp.tabResPanel = Ext.getCmp('resPanel');

    $cmp.inspactors_req_headers = Ext.getCmp('inspactors_req_headers');
    $cmp.inspactors_req_cookies = Ext.getCmp('inspactors_req_cookies');
    $cmp.inspactors_req_raw = Ext.getCmp('inspactors_req_raw');
    $cmp.inspactors_res_raw = Ext.getCmp('inspactors_res_raw');
    $cmp.inspactors_res_view_container = Ext.getCmp('inspactors_res_view_container');

    $cmp.btnKeep = Ext.getCmp('btnKeep');
    $cmp.chkProxy = Ext.getCmp('chkProxy');
    $cmp.disablePool = Ext.getCmp('disablePool');
    $cmp.btnAutoScroll = Ext.getCmp('btnAutoScroll');
    $cmp.radioShowSession = Ext.getCmp('radioShowSession');

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

    $cmp.poolClone = Ext.getCmp('poolClone');
};

var initApp = function() {

    customView();
    new LivePool.App();
    initDom();
    // tips
    Ext.QuickTips.init();
    // no spell check
    document.body.setAttribute('spellcheck', false);

};

Ext.onReady(function() {
    // CONST.layout = 'wide';
    Ext.Ajax.request({
        url: '/view/get',
        method: 'get',
        success: function(response, options) {
            var rs = Ext.JSON.decode(response.responseText);

            CONST.layout = rs.data.layout;
            $cmp.data.layout = CONST.layout;
            $cmp.data.tabSetting = rs.data.tabSetting;
            $cmp.data.sessionColumns = rs.data.sessionColumns;

            initApp();
            initKeyMap();
            initSocketIO();
        },
        failure: function() {}
    });

});
