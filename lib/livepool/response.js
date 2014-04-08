exports.getResInfo = function(res) {
    res.headers['Cache-Control'] = 'no-cache';
    res.headers['Expires'] = 0;
    return res;
};
