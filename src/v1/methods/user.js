/* 
 * User API Methods
 */ 

var r 			= require('rethinkdb'),
	_ 			= require('lodash'),
	bcrypt  	= require('bcrypt'),
	schemas 	= require('../schemas').Schemas,
	validate 	= require('jsonschema').validate,
	methods 	= require('../methods.js');


/*
 * create
 * 
 * @param: userObj (object) 
 * @param: callback (function)
 * 
 */

function create(userObj, callback) {

	var validation = validate(user, schemas.User).errors;

	if (validation) {
		console.log(validation);
	}

	else {

		userObj.password = bcrypt.hashSync(userObj.password, 10); // Hash Password

		r.db("ignition").table("users").insert({
				
				username 	: userObj.username, // Username
				password 	: userObj.password, // Password
				email 		: userObj.email,    // E-mail Address
				avatar 		: userObj.avatar,   // Avatar
				token 		: userObj.token,    // JSON Web Token
				messages 	: {},               // Messages
				lastseen 	: r.now(),          // Last Seen Date
				ip 			: userObj.ip,       // User IP
				activities  : [],               // Activities
				friends 	: {},               // Friends ID's
				online 		: true              // Online Status

			})
			.run(conn, function(err, result) {
				 err ? callback(err) : callback(result);
			});
		}
}

/* Exports
-------------------------------------------------- */
exports.create = create;
