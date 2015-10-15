/* 
 * User API Methods
 */ 

var r 		= require('rethinkdb'),
	_ 		= require('lodash'),
	methods = require('../methods.js');


/*
 * createDefaultUser
 *
 * @param: username (string) 
 * @param: callback (function)
 * 
 */

function createDefaultUser(username, callback) {
	r.db("ignition").table("users").insert({
			
			id: 1, // default User gets ID of 1, others get generated system UUID
			username: username, // User
			conflict: "update"

		})
		.run(conn, function(err, result) {
			 err ? callback(err) : callback(result);
		});

}