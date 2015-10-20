"use strict";

/*
 * Validation related Functions and Methods
 */

var bcrypt      = require('bcrypt'),
    Promise     = require("bluebird"),
    errors      = require("./errors"),
    schemas     = require('../schemas').Schemas,
    validate    = require('jsonschema').validate;

/*
 * JSON Schema Validation
 * 
 * @param: obj     : JSON Object to validate against Schema  (object) 
 * @param: schema  : JSON Schema                             (object.object) 
 * 
 */

function schema(obj, schema) {

    return new Promise(function(resolve, reject) {

        var validation = validate(obj, schemas[schema]);

        if (validation.errors.length) { 

             return Promise.all(validation.errors.map(function (error) {

                return errors.error(error.schema.msg, stack);
                
            })).then(function(array) {
                reject(array); 
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

    