"use strict";

/* 
 * Multipayer Models
 *
 * Find and locate quick server, spin up docker container with retroarch, connect players 
 * through connecting to same framebuffer/pty
 *
 * Users can join
 * Accounce to io servers of active games
 * Player switching
 */ 

var token       = require('../controllers/token'),
    validation  = require('../controllers/validation'),
    runDiff     = require('../controllers/runDiff'),
    runQuery    = require('../controllers/runQuery'),
    r           = require('rethinkdb'),
    _           = require('lodash'),
    bcrypt      = require('bcrypt');

/*
 * locate
 * 
 * description: Locate the best server for session
 *
 * @param: connection : RethinkDB connection Object    (connection object) 
 * @param: authUser   : The Authorized User     	   (object) 
 * @param: payload    : The serialized message Object  (object) 
 * 
 */

function send(connection, authUser, payload) {

	// Add Authorized user as Sender
	payload.sender = authUser.id;
	
	payload.headers = {
		sender_ip: authUser.ip
	}

	// Promise Chain
    return new Promise(function(resolve, reject) { 

        return validation.schema(payload, 'Messages', false)

        .then((schemaInstance) => {
            return runDiff(payload, schemaInstance);
        })

        .then(() => {
            return buildQuery(payload);
        })

        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch(function(error) {
            reject(error);
        });

    });

	// Build Unique Query
    function buildQuery(payload) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('users')
                .get(payload.recipient)
                .do((results) => {
                    return r.branch(results,
                        r.db('ignition').table('users').get(payload.sender).do((profile) => {
                            return r.branch(profile,
                                r.db("ignition").table("messages").insert(payload),
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
 * description: Gets all user Messages
 *
 * @param: connection : RethinkDB connection Object    (connection object) 
 * @param: authUser   : The Authorized User     	   (object) 
 * @param: offset     : Starting recor for pagination  (number) 
 * 
 */

function get(connection, authUser, offset) {

	// If no offset, set to 0
	offset = offset || 0;
	
	// Promise Chain
    return new Promise(function(resolve, reject) { 

        return buildQuery()
        
        .then((query) => {
            return runQuery(connection, query);
        })

        .then((results) => {
	        $nsp.to(`/user/${authUser.id}`).emit('event', results);
        })

        .catch(function(error) {
            reject(error);
        });

    });

	// Build Unique Query
    function buildQuery(payload) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('messages')
                .filter({recipient: authUser.id})
                .orderBy('date')
                .slice(offset,offset+25)
            )
        })
    }
}

/*
 * remove
 * 
 * description: Removes a certain message
 *
 * @param: connection : RethinkDB connection Object    (connection object) 
 * @param: authUser   : The Authorized User     	   (object) 
 * @param: uuid   	  : The UUID of the message        (object) 
 * 
 */

function remove(connection, authUser, uuid) {

	// Promise Chain
    return new Promise(function(resolve, reject) { 

        return buildQuery(uuid)
        
        .then((query) => {
            resolve(runQuery(connection, query));
        })

        .catch(function(error) {
            reject(error);
        });

    });

	// Build Unique Query
    function buildQuery(uuid) {
        return new Promise((resolve, reject) => {
            resolve(
                r.db('ignition')
                .table('messages')
                .filter({id: uuid, recipient: authUser.id})
                .delete()
            )
        })
    }
}

/* Exports
-------------------------------------------------- */
exports.send   = send;
exports.get    = get;
exports.remove = remove;