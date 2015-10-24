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
 * description: Creates a User
 *
 * @param: connection : RethinkDB connection Object (connection object) 
 * @param: userObj    : The serialized user Object  (object) 
 * 
 */

function create(connection, userObj) {

    // Promise Chain
    return new Promise((resolve, reject) => { 

        validation.schema(userObj, 'User')
        
        .then((schemaInstance) => {
            return runDiff(userObj, schemaInstance);
        })

        .then((userObj) => {
            return hashPassword(userObj);
        })

        .then((userObj) => {
            return buildQuery(userObj);
        })

        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch((error) => {
            reject(error);
        });

    });

    // Hash Password for Storage
    function hashPassword(userObj) {
        return new Promise((resolve, reject) => {
            userObj.password = bcrypt.hashSync(userObj.password, 10);
            resolve(userObj);
        });
    }

    // Build Unique Query
    function buildQuery(userObj) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('users')
                .filter({email: userObj.email}).coerceTo('array')
                .do((results) => {
                    return r.branch(results.count().lt(1),
                        r.db('ignition').table('users').insert(userObj, { conflict: 'error' }),
                        r.error('email_taken')
                    )
                })
            )
        })
    }

}

/*
 * get
 * 
 * description: Returns a User
 *
 * @param: connection : RethinkDB connection Object (connection object) 
 * @param: username   : The username / ID           (string) 
 * 
 */

function get(connection, username) {
    
    // Promise Chain
    return new Promise(function(resolve, reject) { 

        buildQuery(username)
       
        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch(function(error) {
            reject(error);
        });

    });

    // Build Unique Query
    function buildQuery(username) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('users')
                .get(username)
                .do((results) => {
                    return r.branch(results,
                        results.pluck('id', 'activities', 'online', 'ip', 'lastseen', 'avatar', 'friends'),
                        r.error('no_such_user')
                    )
                })
            )
        })
    }

}


/* Exports
-------------------------------------------------- */
exports.create = create;
exports.get    = get;