// store 
var store = Ext.create('Ext.data.Store', {
    storeId: 'livepool',
    fields: [
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
    data: {
        'items': []
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

var reqHeaderStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
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

var resHeaderStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
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

var reqCookieStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
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
var resCookieStore = Ext.create('Ext.data.Store', {
    fields: ['key', 'value'],
    data: {
        'items': []
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

var urlMatchComboStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data: [{
        "name": "include",
        "value": "1"
    }, {
        "name": "exclude",
        "value": "2"
    }]
});
var reqMethodStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data: [{
        "name": "GET",
        "value": "1"
    }, {
        "name": "POST",
        "value": "2"
    }, {
        "name": "PUT",
        "value": "3"
    }, {
        "name": "HEAD",
        "value": "4"
    }, {
        "name": "TRACE",
        "value": "5"
    }, {
        "name": "DELETE",
        "value": "6"
    }, {
        "name": "SEARCH",
        "value": "7"
    }, {
        "name": "CONNECT",
        "value": "8"
    }, {
        "name": "PROPFIND",
        "value": "9"
    }, {
        "name": "PROPPATCH",
        "value": "10"
    }, {
        "name": "PATCH",
        "value": "11"
    }, {
        "name": "MKCOL",
        "value": "12"
    }, {
        "name": "COPY",
        "value": "13"
    }, {
        "name": "LOCK",
        "value": "14"
    }, {
        "name": "UNLOCK",
        "value": "15"
    }, {
        "name": "OPTIONS",
        "value": "16"
    }]
});
var httpVersionStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data: [{
        "name": "HTTP/2.0",
        "value": "1"
    }, {
        "name": "HTTP/1.2",
        "value": "2"
    }, {
        "name": "HTTP/1.1",
        "value": "3"
    }, {
        "name": "HTTP/1.0",
        "value": "4"
    }, {
        "name": "HTTP/0.9",
        "value": "5"
    }]
});
var poolTreeStore = Ext.create('Ext.data.TreeStore', {
    fields: ['id', 'parentId', 'name', 'sort', 'match', 'action', 'checked', 'type'],
    proxy: {
        type: 'ajax',
        // url: '/pool/get',
        api: {
            create: '/pool/create',
            read: '/pool/get',
            update: '/pool/update',
            destroy: '/pool/remove'
        },
        writer: {
            type: 'json',
            allowSingle: false,
            root: 'records'
        }
    },
    root: {
        id: -1,
        expanded: true,
        text: "Root"
    },
    autoLoad: true
});
