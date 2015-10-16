/*
 * Validation Functions and Methods
 */

var bcrypt  	= require('bcrypt'),
	Promise     = require("bluebird"),
	schemas 	= require('../schemas').Schemas,
	validate 	= require('jsonschema').validate;

/*
 * JSON Schema Validation
 * 
 * @param: obj     : JSON Object to validate against Schema  (object) 
 * @param: schema  : JSON Schema  							 (object.object) 
 * 
 */

function schemaValidation(obj, schema) {

	return new Promise(function(resolve, reject) {

		var validation = validate(obj, schemas[schema]);

		if (validation.errors.length) { 
			reject(validation); 
		}
		
		else { 
			resolve(validation); 
		}
		
	});
}


	