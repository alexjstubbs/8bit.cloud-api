'use strict';

/*
 * Ignition API Server Logging Configuration
 */

try {
    var config = require('~/keys/config.json');
} catch(e) {
    console.log('Set you your config.json file. File not found');
    process.exit(1);
}


var winston    = require('winston'),
    Papertrail = require('winston-papertrail').Papertrail;

/*
 * Configured Logging Levels
 */

module.exports = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level:            'debug',
            handleExceptions: true,
            colorize:         true,
            json:             true,
            timestamp: () => {
                return Date.now();
            },
        }),
        new winston.transports.Papertrail({
            host: config.papertrailHost,
            port: config,papertrailPort,
            level: 'error',
            colorize: true,
            logFormat: function(level, message) {
                return '[' + level + '] ' + message;
            }
        })
    ],
    exitOnError: false
});

