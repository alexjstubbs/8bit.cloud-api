"use strict";

/*
 * Validation related Functions and Methods
 */

var schemas     = require('../data/schemas').Schemas,
    errors      = require('./errors'),
    bcrypt      = require('bcrypt'),
    Promise     = require('bluebird'),
    validate    = require('jsonschema').validate;

/*
 * JSON Schema Validation
 * 
 * @param: obj                 : JSON Object to validate against Schema  (object) 
 * @param: schema              : JSON Schema                             (object) 
 * @param: ignoreRequirements  : If true, required props are ignored     (bool) 
 * 
 */

function schema(obj, schema, ignoreRequirements) {

    return new Promise(function(resolve, reject) {

        let validation;

        if (ignoreRequirements) {
            let softSchema = schemas[schema];
            delete softSchema.required;
            validation = validate(obj, softSchema);
        }

        else {
            validation = validate(obj, schemas[schema]);
        }

        if (validation.errors.length) { 

             return Promise.all(validation.errors.map(function (error) {

                return errors.error(error.schema.msg, error);
                
            })).then(function(array) {
                reject(array[0]); 
            });

        }
        
        else { 

            resolve(validation); 
        
        }
        
    });
}


/*  Exports
-------------------------------------------------- */
exports.schema = schema;

    