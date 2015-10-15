/* 
 * JSON Schema Validation and Conditionals
 */

var r 	    	= require('rethinkdb');

// User Schema
var Schemas = {

	"User":  {

		id						: "/User",
	    type					: "object",
	    required				: ["username", "password", "email"],
	    
	    properties: {
			username: {
				type			: "string",
				minLength 		: "2",
				maxLength 		: "15",
			},
			password: {
				type			: "string",
				minLength 		: "6",
				maxLength 		: "120",
			},
			email: {
				type			: "string", 
				format			: "email",
				maxLength		: "50",
			},
			avatar: {
				oneOf: [ 
					{ type		: "null" }, 
					{ type		: "string" }, 
				],
				default 		: "/satic/defaultAvatar.png",
			},
			token: {
				oneOf: [
					{ type		: "null" }, 
					{ type		: "string" },
				]
			},
			messages: {
				"$ref": 		: "/Messages",
			},
			lastseen {
				oneOf: [
					{ type		: "date-time" }, 
					{ type		: "string" },
					{ type		: "null" },
				],
				default 		: r.now(), 
			}     
			ip: {
				oneOf: [ 
					{ type		: "ipv4" }, 
					{ type		: "ipv6" },
					{ type		: "null" },
				] 
			},
			activities: {
				"$ref": 		: "/Activities",
			},
			friends: {       
				oneOf: [ 
					{ type		: "object" },
					{ type		: "null" },
				]
        	},
        	online: {
        		oneOf: [ 
					{ type		: "boolean" },
					{ type		: "null" },
				],
				default: false,
        	}

		}
	}
}

// Exports
exports.Schemas = Schemas;