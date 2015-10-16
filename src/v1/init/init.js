'use strict';

/* 
 * Initilize Databases for first run
 */

var r 	    	= require('rethinkdb'),
	_ 	    	= require('lodash'),
 	chalk   	= require('chalk'),
	config  	= require('../config.json'),
	databases   = require('./databases.json').databases,
	schemas 	= require('../schemas').Schemas,
	validate 	= require('jsonschema').validate,
	Promise 	= require("bluebird"),
	methods 	= require('../methods'),
	_conn;


// Connect to datastore
function connectDatabase() {
	return new Promise(function (resolve, reject) {
		r.connect({ host: config.address, port: config.port }, function(err, conn) {
		  	if (err) { reject(err) }
		  	else { resolve(conn) }
		});
	});
}

// Create Databases
function createDatabase(conn) {
	return new Promise(function (resolve, reject) {
		_(databases).forEach(function(table, db) {
			r.dbCreate(db).run(conn, function(err, conn) {
			  	if (err) { reject(err) }
			  });
	      }).value();
		resolve(conn);
	});
}

// Write Table
function createTables(conn)	{
	return new Promise(function (resolve, reject) {
		_(Object.keys(databases)).forEach(function(key) {
			for (var i = 0; i < 10; i++) {
				var tables = databases[Object.keys(databases)[0]]["tables"];
				if (i >= tables.length) { break }
				r.db(key).tableCreate(tables[i]).run(conn, function(err, conn) {
					if (err) { reject(err) }
				});
			}
	    }).value();		
		resolve(conn); 
	});
}


// Set up databases and tables
function init() {

	connectDatabase()
	.then(function(conn) {
	    return createDatabase(conn);
	})
	.then(function(conn) {
	    return createTables(conn);
	})
	.then(function(conn) {
		process.exit();
	})
	.catch(function(e) {
	    console.log("Exception " + e);
	});

}


// Insert Default Ignition User (Admin type. Auto added to friends of new users)
function createDefaultUser(conn, callback) {

	var user = {
		username 	: config.username,
		password 	: config.password,
		email 		: config.email
	}

	methods.user.create(conn, user, function(err, res) {
		// callback(err, res);
	})
}

// Call Set Up Function
init();


/* Exports
-------------------------------------------------- */
exports.init = init;