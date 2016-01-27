'use strict';

/*
 * Ignition API Server Installation Script
 *
 * Apache License 2.0 (Apache-2.0)
 * Copyright (c) Alexander Stubbs, ignition.io. All Rights Reserved.
 * 
 * Contact: admin@ignition.io (alex@alexstubbs.com)
 */

var childProcess = require('child_process'),
cmd = 'docker run -d -P --name web -v /src/webapp:/opt/webapp training/webapp python app.py',


function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

// Now we can run a script and invoke a callback when complete, e.g.
runScript(cmd, function (err) {
    if (err) throw err;
    console.log('Error, exiting:', err);
});