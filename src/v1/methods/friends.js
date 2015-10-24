"use strict";

/* 
 * Friends API Methods
 */ 

var r           = require('rethinkdb'),
    _           = require('lodash'),
    bcrypt      = require('bcrypt'),
    validation  = require('./validation.js'),
    runDiff     = require('./runDiff.js'),
    runQuery    = require('./runQuery.js');

/*
 * add
 * 
 * description: Adds a friend to a User
 *
 * @param: connection : RethinkDB connection Object (connection object) 
 * @param: username   : The origin username         (string) 
 * @param: friend     : The friend username to add  (string) 
 * 
 */

function add(connection, username, friend) {
    
    // Promise Chain
    return new Promise(function(resolve, reject) { 

        buildQuery(username, friend)
       
        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch(function(error) {
            reject(error);
        });

    });

    // Build Unique Query
    function buildQuery(username, friend) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('users')
                .get(friend)
                .do((results) => {
                    return r.branch(results,
                        r.db('ignition').table('users').get(username).do((profile) => {
                            return r.branch(profile,
                                r.db("ignition").table("users").get(username).update({friends: profile('friends').setInsert(results.getField("id"))}),
                                r.error('no_such_user') // User who Issued Request Doesn't Exist
                            )
                        }), 
                        r.error('no_such_user') // Requested Friend Doesn't Exist
                    )
                })
            )
        })
    }
}


/*
 * get
 * 
 * description: Gets a User's friends list
 *
 * @param: connection : RethinkDB connection Object  (connection object) 
 * @param: username   : The username for the request (string) 
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
                        results.pluck('friends'),
                        r.error('no_such_user')
                    )
                })
            )
        })
    }
}


/*
 * remove
 * 
 * description: Remove a Friend from a users Friendslist
 *
 * @param: connection : RethinkDB connection Object    (connection object) 
 * @param: username   : The username for the request   (string) 
 * @param: friend     : The friend username to remove  (string)
 * 
 */

function remove(connection, username, friend) {
    
    // Promise Chain
    return new Promise(function(resolve, reject) { 

        buildQuery(username, friend)
       
        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch(function(error) {
            reject(error);
        });

    });

    // Build Unique Query
    function buildQuery(username, friend) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('users')
                .get(username)("friends").coerceTo('array')
                .do((results) => {
                    return r.branch(results,
                        r.db("ignition").table("users").get(username).update({friends: results.setDifference([friend])}),
                        r.error('no_such_user')
                    )
                })
            )
        })
    }
}

/* Exports
-------------------------------------------------- */
exports.add     = add;
exports.get     = get;
exports.remove  = remove;