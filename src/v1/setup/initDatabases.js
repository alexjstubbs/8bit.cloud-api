/* 
 * Initilize Databases for first run
 */

var  r 	   = require('rethinkdb'),
	 _ 	   = require('lodash'),
	config = require('../config.json'),
	chalk  = require('chalk');

// Tables Needed for Databases
var ignitionTables = [
	'user',
	'activity',
	'messages',
	'events',
	'community'
];

var gamesTables = [
	'title',
	'rating'
]

// Databases Needed
var databases = [
	{ name: 'ignition', tables: ignitionTables },
	{ name: 'games', tables: gamesTables }
]

// Set up databases and tables
function setUp(callback) {

	r.connect({ host: config.address, port: config.port }, function(err, conn) {

	  if (err) { return err; }

	  _(databases).forEach(function(db) {
	  	 r.dbCreate(db.name).run(conn, function(err, res) {

		  	if (err) { callback(err); }
			  	else {
					_(db.tables).forEach(function(table) {
				  		r.db(db.name).tableCreate(table).run(conn, function(err, res){
				  			 callback(err, res);
				  		})
					}).value();
			  	}
			});
		});
	});
}

setUp(function(err, result) {
	if (err) {
		console.log(chalk.bgRed.bold('[ERROR]:') + " " + err); 
	}

	else {
		console.log(chalkbgGreen.bold('[SUCCESS]:') + " " + "Successfully set up datastore"); 
	}
	
	process.exit();
})

/* Exports
-------------------------------------------------- */
exports.setUp = setUp;