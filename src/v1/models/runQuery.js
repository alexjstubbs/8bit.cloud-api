"use strict";

var _        = require('lodash'),
    errors   = require('./errors').error,
    errorMap = require('../errorMap.json');

/*
 * runQuery
 * 
 * description: Runs a given RDB query, returns results or unique error
 *
 * @param: connection : RethinkDB connection Object (connection object) 
 * @param: query      : The query Object            (object) 
 * 
 */

module.exports = (connection, query) => {

    return new Promise((resolve, reject) => {
    
        query.run(connection, (err, result) => {

            // General, Connection, or Defined Error
            if (err) { 
                reject(errors(err.msg, err.msg));
            }

            else {

                // Cursor (return as array)
                if (result.toArray) {
                    resolve(result.toArray());
                }

                // Error
                else if (result.first_error) {
                    let errorId = result.first_error.split(":")[0];
                    reject(errors(errorMap[errorId], errorId));
                }
                
                // No error, Not Cursor
                else {
                    resolve(result);
                 }

            }
        })

    })
}