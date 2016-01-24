'use strict';

/*
 * Ignition API Server Logging Configuration
 */

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
            host: process.env.ignition_papertrailHost,
            port: process.env.ignition_papertrailPort,
            level: 'error',
            colorize: true,
            logFormat: function(level, message) {
                return '[' + level + '] ' + message;
            }
        })
    ],
    exitOnError: false
});

