"use strict";

/* 
 * User API Models
 */ 

var validation  = require('../controllers/validation'),
    runDiff     = require('../controllers/runDiff'),
    token       = require('../controllers/token'),
    runQuery    = require('../controllers/runQuery'),
    r           = require('rethinkdb'),
    _           = require('lodash'),
    bcrypt      = require('bcrypt');

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

        validation.schema(userObj, 'User', false)
        
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


/*
 * update
 * 
 * description: Update various objects in User record
 *
 * @param: connection : RethinkDB connection Object (connection object) 
 * @param: username   : The username / ID           (string) 
 * @param: record     : Object document to update   (object)
 *
 */

function update(connection, username, record) {
    
    // Promise Chain
    return new Promise(function(resolve, reject) { 

        return validation.schema(record, 'User', true)
        
        .then(() => {
            return buildQuery(username, record);
        })

        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch(function(error) {
            reject(error);
        });

    });

    // Build Unique Query
    function buildQuery(username, record) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('users')
                .get(username)
                .update(record)
            )      
        })
    }

}

/* 
 * issueToken
 * 
 * description: Issues JSON Web Token for Session
 *
 * @param: connection : RethinkDB connection Object (connection object) 
 * @param: username   : The username / ID           (string) 
 * 
 */

function issueToken(connection, username) {

    // Promise Chain
    return new Promise(function(resolve, reject) { 

        createToken(username)
       
        .then((token) => {
            resolve({token: token});
        })

        .catch(function(error) {
            reject(error);
        });

    });

    function createToken(username) {
        return new Promise((resolve, reject) => {
             resolve(token.issueToken({id: username}));
        })
    }

}


/* Exports
-------------------------------------------------- */
exports.create     = create;
exports.get        = get;
exports.update     = update;
exports.issueToken = issueToken;