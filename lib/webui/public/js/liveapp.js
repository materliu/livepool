
var store = Ext.create('Ext.data.Store', {
    storeId:'livepool',
    fields:[
        'id', 
        'result', 
        'protocol',
        'host',
        'url',
        'body',
        'caching',
        'contentType',
        'req',
        'res',
        'reqHeader',
        'resHeader'
    ],
    data:{
        'items':[]
    },
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});

Ext.grid.RowNumberer = Ext.extend(Ext.grid.RowNumberer, {
    width: 34
});

Ext.define('LivePool.App', {
    extend: 'Ext.container.Viewport',
    initComponent: function(){
        var cxt = this;
        cxt.store = Ext.data.StoreManager.lookup('livepool');

        var observers = {
            onRemoveAll: function(e){
                store.removeAll();
            }
        };

        Ext.apply(this, {
            layout: 'border',
            items: [{
                region: 'center',
                minWidth: 300,
                tbar: [{
                    text: 'LivePool',
                    iconCls: 'icomoon-stackoverflow'
                },'-',{
                    text: 'Replay',
                    iconCls: 'icomoon-redo2'
                },'-',{
                    text: 'Remove',
                    iconCls: 'icomoon-remove2',
                    menu: [{
                        text: 'Remove All',
                        handler: observers.onRemoveAll
                    },{
                        text: 'Images'
                    },{
                        text: 'CONNECTs'
                    },{
                        text: 'NON 200s'
                    },{
                        text: 'Duplicate Bodies'
                    }]
                },'-',{
                    text: 'Rules',
                    iconCls: 'icomoon-list3'
                },'-',{
                    text: 'Find',
                    iconCls: 'icomoon-search3'
                },'-',{
                    text: 'Keep',
                    iconCls: 'icomoon-stack'
                },'-',{
                    text: 'Tools',
                    iconCls: 'icomoon-tools'
                },'-',{
                    text: 'View',
                    iconCls: 'icomoon-browser2'
                },'-',{
                    text: 'Help',
                    iconCls: 'icomoon-help',
                    menu: [{
                        text: 'About'
                    }]
                }],
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                border: 0,
                items: [{
                    flex: 1,
                    xtype: 'gridpanel',
                    ui: 'blue-panel',
                    store: cxt.store,
                    columns: [
                        new Ext.grid.RowNumberer(),
                        // { text: '#',  dataIndex: 'id', width: 40 },
                        { text: 'result', dataIndex: 'result', width: 50},
                        { text: 'protocol', dataIndex: 'protocol', width: 60 },
                        { text: 'host', dataIndex: 'host', width: 150 },
                        { text: 'url', dataIndex: 'url', minWidth: 200 },
                        { text: 'caching', dataIndex: 'caching' },
                        { text: 'content-type', dataIndex: 'contentType' },
                        { text: 'body', dataIndex: 'body' }
                    ]
                },{
                    xtype: 'splitter'
                },{
                    flex: 1,
                    xtype: 'tabpanel',
                    defaults: {
                        border: 0
                    },
                    items: [{
                        title: 'Inspactors',
                        html: 'Inspactors'
                    },{
                        title: 'Composer',
                        html: 'Composer'
                    },{
                        title: 'Filters',
                        html: 'Filters'
                    },{
                        title: 'Pool',
                        html: 'Pool'
                    },{
                        title: 'Statistics',
                        html: 'Statistics'
                    },{
                        title: 'Log',
                        html: 'Log'
                    },{
                        title: 'Timeline',
                        html: 'Timeline'
                    }]
                }]
            }]
        });

        this.callParent(arguments);
    }

});

Ext.onReady(function(){
    var app = new LivePool.App();

    io = io.connect();
    
    io.on('req', function(data) {
        store.add(data.rows);
    });

    io.on('res', function(data) {
        Ext.Array.each(data.rows, function(row) {
            var gridRow = store.findRecord('id', row.id);
            if(gridRow){
                gridRow.set('result', row.result);
                gridRow.set('body', row.body);
                gridRow.set('contentType', row.contentType);
                gridRow.set('caching', row.caching);
            }
        });
        store.save();
    })

});