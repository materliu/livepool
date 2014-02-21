var CONST = {
    host: '127.0.0.1'
};

var imageTypes = ['jpeg', 'jpg', 'jpe', 'tiff', 'tif', 'gif', 'png', 'webp', 'ico'];

var util = {};

util.objToPlain = function(obj){
    var str = '';
    for(var name in obj) {
        str += name + ': ' + obj[name] + '\r\n';
    }
    return str;
};


var store = Ext.create('Ext.data.Store', {
    storeId:'livepool',
    fields:[
        'id', 
        'idx',
        'result', 
        'protocol',
        'host',
        'url',
        'path',
        'pathname',
        'body',
        'rawBody',
        'caching',
        'contentType',
        'req',
        'res',
        'reqHeader',
        'reqHeaders',
        'resHeader',
        'resHeaders'
    ],
    data:{
        'items':[]
    },
    buffered: true,
    pageSize: 5000,
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
                        // new Ext.grid.RowNumberer(),
                        { text: '#',  dataIndex: 'idx', width: 40 },
                        { text: 'result', dataIndex: 'result', width: 50},
                        { text: 'protocol', dataIndex: 'protocol', width: 60 },
                        { text: 'host', dataIndex: 'host', width: 150 },
                        { text: 'path', dataIndex: 'path', minWidth: 200 },
                        { text: 'caching', dataIndex: 'caching' },
                        { text: 'content-type', dataIndex: 'contentType' },
                        { text: 'body', dataIndex: 'body' }
                    ],
                    listeners : {
                        cellclick : function(view, cell, cellIndex, record, row, rowIndex, e) {
                            // req
                            var reqHeadersText = util.objToPlain(record.data.reqHeaders);
                            var reqHeaders = Ext.getCmp('inspactors_req_headers');
                            reqHeaders.setValue(reqHeadersText);
                            var reqCookies = Ext.getCmp('inspactors_req_cookies');
                            reqCookies.setValue(record.data.reqHeaders.cookie);

                            // res
                            var resHeadersText = util.objToPlain(record.data.resHeaders);
                            var resHeaders = Ext.getCmp('inspactors_res_headers');
                            resHeaders.setValue(resHeadersText);

                            // load res raw
                            var resRaw = Ext.getCmp('inspactors_res_raw');
                            resRaw.setValue(record.data.url);
                            // Ext.Ajax.request({
                            //     url: '/res/raw',
                            //     params: { 
                            //         idx: record.data.idx 
                            //     },
                            //     method: 'GET',
                            //     success: function (response, options) {
                            //         resRaw.setValue(response.responseText);
                            //     },
                            //     failure: function (response, options) {
                            //         resRaw.setValue('LivePool后台服务超时,错误编号：' + response.status);
                            //     }
                            // });

                            // load res view
                            var resView = Ext.getCmp('inspactors_res_view');
                            var ext = record.data.pathname.replace(/.*[\.\/\\]/, '').toLowerCase();
                            resView.removeAll();
                            if(imageTypes.indexOf(ext) >= 0 && record.data.result == 200){
                                var container = Ext.create('Ext.container.Container', {
                                    baseCls: 'tran-background'
                                });
                                var img = Ext.create('Ext.Img', {
                                    src: '/res/get?idx=' + record.data.idx + '&ext=' + ext
                                });
                                container.add(img)
                                resView.add(container);
                            }else{
                                var textArea = Ext.create('Ext.form.field.TextArea');
                                Ext.Ajax.request({
                                    url: '/res/get',
                                    params: { 
                                        idx: record.data.idx 
                                    },
                                    method: 'GET',
                                    success: function (response, options) {
                                        textArea.setValue(response.responseText);
                                    },
                                    failure: function (response, options) {
                                        textArea.setValue('LivePool后台服务超时,错误编号：' + response.status);
                                    }
                                });
                                
                                resView.add(textArea);
                            }
                        }
                    }
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
                        border: 0,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [{
                            flex: 1,
                            xtype: 'tabpanel',
                            defaults: {
                                border: 0
                            },
                            items: [{
                                title: 'headers',
                                layout: 'fit',
                                items: [{
                                    id: 'inspactors_req_headers',
                                    xtype: 'textareafield',
                                    border: 0
                                }]
                            },
                            // {
                            //     id: 'inspactors_req_raw',
                            //     title: 'raw',
                            //     html: ''
                            // },
                            {
                                title: 'cookies',
                                layout: 'fit',
                                items: [{
                                    id: 'inspactors_req_cookies',
                                    xtype: 'textareafield',
                                    border: 0,
                                    spellcheck: false
                                }]
                            }]
                        },{
                            xtype: 'splitter'
                        },{
                            flex: 2,
                            xtype: 'tabpanel',
                            defaults: {
                                border: 0
                            },
                            items: [{
                                title: 'headers',
                                layout: 'fit',
                                items: [{
                                    id: 'inspactors_res_headers',
                                    xtype: 'textareafield',
                                    border: 0
                                }]
                            },{
                                title: 'cookies',
                                layout: 'fit', 
                                items: [{
                                    id: 'inspactors_res_cookies',
                                    xtype: 'textareafield',
                                    border: 0
                                }]
                            },{
                                title: 'raw',
                                layout: 'fit',
                                items: [{
                                    id: 'inspactors_res_raw',
                                    xtype: 'textareafield',
                                    border: 0
                                }]
                            },{
                                id: 'inspactors_res_view',
                                title: 'view',
                                layout: 'fit',
                                items: []
                            }]
                        }]
                    },{
                        title: 'Pool',
                        html: 'Pool'
                    },{
                        title: 'Composer',
                        html: 'Composer'
                    },{
                        title: 'Filters',
                        html: 'Filters'
                    },{
                        title: 'Statistics',
                        html: 'Statistics'
                    },{
                        title: 'Timeline',
                        html: 'Timeline'
                    },{
                        title: 'Log',
                        html: 'Log'
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
    
    io.on('proxy', function(proxy) {

        if(proxy.length){
            var req = [], res = [];
            Ext.Array.each(proxy, function(data){
                if(data.type == 'req'){
                    req = req.concat(data.rows);
                    // store.add(data.rows);
                    // store.insert(0, data.rows);
                }else{
                    res = res.concat(data.rows);
                }
            });
            store.add(req);
            Ext.Array.each(res, function(row) {
                var gridRow = store.findRecord('id', row.id);
                if(gridRow){
                    gridRow.set('result', row.result);
                    gridRow.set('body', row.body);
                    // gridRow.set('rawBody', row.body);
                    gridRow.set('contentType', row.contentType);
                    gridRow.set('caching', row.caching);
                    gridRow.set('resHeaders', row.resHeaders);
                }
            });
            store.save();
        }
        
    });

    document.body.setAttribute('spellcheck', false);

});