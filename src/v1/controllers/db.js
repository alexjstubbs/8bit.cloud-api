'use strict';

/* 
 * RethinkDB Databases Connection.
 */

var os = require('os');

try {
    var config = require('~/keys/config.json');
} catch(e) {
    console.log('Set you your config.json file. File not found: ' + os.path);
    process.exit(1);
}



var r           = require('rethinkdb'),
    Promise     = require('bluebird');

/* 
 * Connect and return connection object
 */

exports.connection = () => {
    return new Promise((resolve, reject) => {
        r.connect({ host:  config.address, port: config.port }, (err, connection) => {
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