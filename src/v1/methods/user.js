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
 * @param: conn (connection instance) 
 * @param: userObj (object) 
 * @param: callback (function)
 * 
 */

function create(conn, userObj, callback) {

	var validation = validate(userObj, schemas.User),
		schema 	   = validation.schema.properties;


	if (validation.errors.length) {
		console.log(validation);
	}

	else {

		console.log("ca", validation.instance);

		// userObj.password = bcrypt.hashSync(userObj.password, 10); // Hash Password

		// r.db("ignition").table("users").insert({

		// 	// TODO: Loop through properties of validates object.
				
		// 		username 	: userObj.username, 			// Username
		// 		password 	: userObj.password, 			// Password
		// 		email 		: userObj.email,    			// E-mail Address
		// 		avatar 		: r.js("userObj.avatar ? userObj.avatar : schema.avatar.default"),   			// Avatar
		// 		token 		: r.js("userObj.token ? schema.token.default"),    			// JSON Web Token
		// 		messages 	: {},               			// Messages
		// 		lastseen 	: r.js("userObj.lastseen ? schema.lastseen.default"),          			// Last Seen Date
		// 		ip 			: r.js("userObj.ip ? schema.ip.default"),       			// User IP
		// 		activities  : [],               			// Activities
		// 		friends 	: {},               			// Friends ID's
		// 		online 		: true        // Online Status

		// 	}).run(conn, function(err, result) {
		// 		 console.log("wtf", err, result);
		// 		 err ? callback(err) : callback(result);
		// 	});
		}
}

/* Exports
-------------------------------------------------- */
exports.create = create;
