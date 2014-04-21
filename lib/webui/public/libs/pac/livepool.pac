function FindProxyForURL(url, host) {
    if(shExpMatch(host,"127.0.0.1") || shExpMatch(host,"localhost")) {
        return "DIRECT";
    }
    else
        return "PROXY 127.0.0.1:8090";
    }
}