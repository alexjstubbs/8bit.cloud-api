'use strict';

/* 
 * Initilize Databases for first run
 */

var r 	    	= require('rethinkdb'),
	_ 	    	= require('lodash'),
 	chalk   	= require('chalk'),
	config  	= require('../config.json'),
	databases   = require('./databases.json'),
	schemas 	= require('../schemas').Schemas,
	validate 	= require('jsonschema').validate,
	methods 	= require('../methods');

// Set up databases and tables
function setUp(callback) {

	r.connect({ host: config.address, port: config.port }, function(err, conn) {

	  if (err) { return err; }

	  _(databases.databases).forEach(function(tables, db) {
	  	 r.dbCreate(db).run(conn, function(err, res) {

		  	if (err) { callback(err); }
			  	else {
					_(tables.tables).forEach(function(table) {
				  		r.db(db).tableCreate(table).run(conn, function(err, res){
				  			 callback(err, res);
				  		})
					}).value();
			  	}
			});
		});
	});
}

	var user = {
		username 	: {config:"username"},
		password 	: config.password,
		email 		: config.email
	}

// Insert Default Ignition User (Admin type. Auto added to friends of new users)
function createDefaultUser(callback) {
	methods.user.create(config, function(err, result) {
		callback(err, result);
	})
}

// Call Set Up Function
setUp(function(err, result) {

	console.log(validate(user, schemas.User));
// validate(user, schemas.User).schema.properties.hello.default

	// if (err) {
	// 	console.log(chalk.bgRed.bold('[ERROR]:') + " " + err); 
	// }

	// else {
	// 	createDefaultUser(function(err, result) {
	// 		if (err) { console.log(err) }
	// 		else { console.log(chalk.bgGreen.bold('[SUCCESS]:') + " " + "Successfully set up datastore"); }
	// 	});
	// }

	process.exit();
})


/* Exports
-------------------------------------------------- */
exports.setUp = setUp;