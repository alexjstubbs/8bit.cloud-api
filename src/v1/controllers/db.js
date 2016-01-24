'use strict';

/* 
 * RethinkDB Databases Connection.
 */

var r           = require('rethinkdb'),
    Promise     = require('bluebird');

/* 
 * Connect and return connection object
 */

exports.connection = () => {
    return new Promise((resolve, reject) => {
        r.connect({ host:  process.env.ignition_address, port: process.env.ignition_config.port }, (err, connection) => {
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