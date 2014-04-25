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
    },
    formateSize: function(size) {
        size = parseFloat(size);
        var rank = 0;
        var rankchar = 'B';
        while (size > 1024) {
            size = size / 1024;
            rank++;
        }
        if (rank == 1) {
            rankchar = "KB";
        } else if (rank == 2) {
            rankchar = "MB";
        } else if (rank == 3) {
            rankchar = "GB";
        }
        return size.toFixed(1) + " " + rankchar;
    },
    formateTime: function(time) {
        time = parseFloat(time);
        var rank = 0;
        var rankchar = 'ms';
        while (size > 1024) {
            size = size / 1024;
            rank++;
        }
        if (rank == 1) {
            rankchar = "s";
        } else if (rank == 2) {
            rankchar = "MB";
        } else if (rank == 3) {
            rankchar = "GB";
        }
        return size.toFixed(1) + " " + rankchar;
    },
    convertTime: function(time) {
        time = parseFloat(time);
        if (!time || time < 0) {
            return 0;
        }
        if (time >= 0 && time <= 1000) {
            return time + 'ms';
        } else {
            time = time / 1000;
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + 'm' + parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60) + 's';
            } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                time = parseInt(time / 3600.0) + 'h' + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + 'm' +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + 's';
            } else {
                time = parseInt(time) + 's';
            }
        }
    }
};
