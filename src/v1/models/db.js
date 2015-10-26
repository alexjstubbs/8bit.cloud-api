'use strict';

/* 
 * RethinkDB Databases Connection
 */

var config      = require('../config.json'),
    r           = require('rethinkdb'),
    Promise     = require("bluebird");

/* 
 * Connect and return connection object
 */

exports.connection = () => {
    return new Promise((resolve, reject) => {
        r.connect({ host: config.address, port: config.port }, (err, connection) => {
            if (err) { reject(err) }
            else { 
                resolve(connection);
            }
        });
    });
}

/* 
 * Use r.now() as module export
 */

exports.now = () => {
	return new Promise((resolve, reject) => {
		resolve(r.now());
	});
}