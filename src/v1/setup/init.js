'use strict';

/* 
 * Initilize Databases for first run
 */

var r 	    	= require('rethinkdb'),
	_ 	    	= require('lodash'),
 	chalk   	= require('chalk'),
	config  	= require('../config.json'),
	databases   = require('./databases.json'),
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

// Insert Default Ignition Use ("admin" but with no special privladges)
function insertDefaultUser(callback) {
	methods.user.createAdmin(function(err, result) {
		callback(err, result);
	})
}

// Call Set Up Function
setUp(function(err, result) {
	if (err) {
		console.log(chalk.bgRed.bold('[ERROR]:') + " " + err); 
	}

	else {
		console.log(chalk.bgGreen.bold('[SUCCESS]:') + " " + "Successfully set up datastore"); 
	}

	process.exit();
})


/* Exports
-------------------------------------------------- */
exports.setUp = setUp;