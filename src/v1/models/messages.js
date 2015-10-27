"use strict";

/* 
 * Messages API Models
 */ 

var r           = require('rethinkdb'),
    _           = require('lodash'),
    bcrypt      = require('bcrypt'),
    validation  = require('./validation'),
    runDiff     = require('./runDiff'),
    token       = require('../token'),
    runQuery    = require('./runQuery');

/*
 * send
 * 
 * description: Sends a message to a User
 *
 * @param: connection : RethinkDB connection Object    (connection object) 
 * @param: msgObj     : The serialized message Object  (object) 
 * 
 */

function send(connection, authUser, msgObj) {

	msgObj.from = authUser.id;
	msgObj.ip 	= authUser.ip;

	// Promise Chain
    return new Promise(function(resolve, reject) { 

        return validation.schema(msgObj, 'Messages', false)
        
        .then(() => {
            return buildQuery(msgObj);
        })

        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch(function(error) {
            reject(error);
        });

    });

	// Build Unique Query
    function buildQuery(msgObj) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('users')
                .get(msgObj.to)
                .do((results) => {
                    return r.branch(results,
                        r.db('ignition').table('users').get(msgObj.from).do((profile) => {
                            return r.branch(profile,
                                r.db("ignition").table("users").get(msgObj.from).update({messages: profile('messages').setInsert(msgObj)}),
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

exports.send = send;