var fs = require('fs');
var mime = require('mime');

function localFileResponder(handler, req, res, options) {

    var filepath = handler.respond.filepath;
    fs.existsSync(filepath) && fs.stat(filepath, function(err, stat) {
        if (err) {
            throw err;
        }

        if (!stat.isFile()) {
            throw new Error('The responder is not a file!');
        }

        res.statusCode = options.statusCode || 200;
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', mime.lookup(filepath));
        res.setHeader('Server', 'livepool');

        fs.createReadStream(filepath).pipe(res);
    });
};

module.exports = localFileResponder;
