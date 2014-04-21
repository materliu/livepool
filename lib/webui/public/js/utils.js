var utils = {
    objToPlain: function(obj) {
        var str = '';
        for (var name in obj) {
            str += name + ': ' + obj[name] + '\r\n';
        }
        return str;
    },
    parseHeader: function(headerText) {
        // load request header
        var regex = /(.*?): (.*?)\r\n/g;
        var result = regex.exec(headerText);
        var headers = [];
        while (result != null) {
            var header = {
                key: RegExp.$1,
                value: RegExp.$2
            };
            headers.push(header);
            result = regex.exec(headerText);
        }
        return _.sortBy(headers, function(header) {
            return header.key;
        });
    },
    parseCookie: function(cookieText) {
        cookieText += '; ';
        // load request header
        var regex = /(.*?)=(.*?); /g;
        var result = regex.exec(cookieText);
        var headers = [];
        while (result != null) {
            var header = {
                key: RegExp.$1,
                value: RegExp.$2
            };
            headers.push(header);
            result = regex.exec(cookieText);
        }
        return _.sortBy(headers, function(header) {
            return header.key;
        });
    }
};
