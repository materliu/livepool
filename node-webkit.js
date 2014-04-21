var proxy = require('./lib/livepool/proxy');
var exec = require('child_process').exec,
    child;

// background process
child = exec('node livepool.js', {
        maxBuffer: 20000 * 1024,
    },
    function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

// kill child when exit
process.on('exit', function() {
    child.kill('SIGHUP');
});
