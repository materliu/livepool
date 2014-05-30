// store 
var store = Ext.create('Ext.data.Store', {
    storeId: 'livepool',
    fields: [
        'id',
        'idx',
        'result',
        'protocol',
        'host',
        'hostIp',
        'url',
        'path',
        'pathname',
        'body',
        'rawBody',
        'reqBody',
        'caching',
        'contentType',
        'req',
        'res',
        'reqTime',
        'resTime',
        'reqHeaders',
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
var reqWebformStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
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
        "value": "GET"
    }, {
        "name": "POST",
        "value": "POST"
    }, {
        "name": "PUT",
        "value": "PUT"
    }, {
        "name": "HEAD",
        "value": "HEAD"
    }, {
        "name": "TRACE",
        "value": "TRACE"
    }, {
        "name": "DELETE",
        "value": "DELETE"
    }, {
        "name": "SEARCH",
        "value": "SEARCH"
    }, {
        "name": "CONNECT",
        "value": "CONNECT"
    }, {
        "name": "PROPFIND",
        "value": "PROPFIND"
    }, {
        "name": "PROPPATCH",
        "value": "PROPPATCH"
    }, {
        "name": "PATCH",
        "value": "PATCH"
    }, {
        "name": "MKCOL",
        "value": "MKCOL"
    }, {
        "name": "COPY",
        "value": "COPY"
    }, {
        "name": "LOCK",
        "value": "LOCK"
    }, {
        "name": "UNLOCK",
        "value": "UNLOCK"
    }, {
        "name": "OPTIONS",
        "value": "OPTIONS"
    }]
});
var httpVersionStore = Ext.create('Ext.data.Store', {
    fields: ['name', 'value'],
    data: [{
        "name": "HTTP/2.0",
        "value": "2.0"
    }, {
        "name": "HTTP/1.2",
        "value": "1.2"
    }, {
        "name": "HTTP/1.1",
        "value": "1.1"
    }, {
        "name": "HTTP/1.0",
        "value": "1.0"
    }, {
        "name": "HTTP/0.9",
        "value": "0.9"
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
var keyMapStore = Ext.create('Ext.data.Store', {
    fields: ['scope', 'key', 'text'],
    data: [{
        'scope': '[Session]',
        'key': 'ctrl+x',
        'text': 'Remove All Sessions'
    }, {
        'scope': '[Session]',
        'key': 'r',
        'text': 'Replay Current Session'
    }, {
        'scope': '[Pool]',
        'key': 'shift+c',
        'text': 'Clone Current Project/Rule'
    }, {
        'scope': '[Pool]',
        'key': 'shift+d',
        'text': 'Delete Current Project/Rule'
    }]
});
