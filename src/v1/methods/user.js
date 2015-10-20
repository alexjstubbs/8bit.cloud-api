"use strict";

/* 
 * User API Methods
 */ 

var r           = require('rethinkdb'),
    _           = require('lodash'),
    bcrypt      = require('bcrypt'),
    validation  = require('./validation.js'),
    runDiff     = require('./runDiff.js'),
    runQuery    = require('./runQuery.js');

/*
 * create
 * 
 * @param: connection : RethinkDB connection Object (connection object) 
 * @param: userObj    : The serialized user Object  (object) 
 * 
 */


function create(connection, userObj) {

    // Promise Chain
    return new Promise(function(resolve, reject) { 

        validation.schema(userObj, 'User')
        
        .then(function(schemaInstance) {
            return runDiff(userObj, schemaInstance);
        })

        .then(function(userObj) {
            return hashPassword(userObj);
        })

        .then(function(userObj) {
            return buildUserQuery(userObj);
        })

        .then(function(userObj) {
            resolve(runQuery(connection, userObj));
        })

        .catch(function(e) {
            reject(e);
        });

    });

    // Hash Password for Storage
    function hashPassword(userObj) {
        return new Promise((resolve, reject) => {
            userObj.password = bcrypt.hashSync(userObj.password, 10);
            resolve(userObj);
        });
    }

    // Build Unique User Method Query
    function buildUserQuery(userObj) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db("ignition")
                .table("users")
                .filter({email: userObj.email}).coerceTo('array')
                .do((results) => {
                    return r.branch(results.count().gt(0),
                        r.error("email_taken"),
                        r.db("ignition").table("users").insert(userObj, { conflict: 'error' })
                    )
                })
            )
        })
    }

}



/* Exports
-------------------------------------------------- */
exports.create = create;