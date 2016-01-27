'use strict';

/*
 * Ignition API Server Logging Configuration
 */


var config     = require('/users/alexander/keys/config.js'),
    winston    = require('winston'),
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

