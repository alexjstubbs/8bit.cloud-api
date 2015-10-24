'use strict';

/*
 * 
 * API Server for Ignition Clients
 *
 */

 var r 			= require('rethinkdb'),
 	  methods 	= require('../methods'),
 	  config    = require('../config.json'),
 	  Promise   = require("bluebird"),
	  _     	= require('lodash'),
	  connection;


function connectDatabase() {
    return new Promise((resolve, reject) => {
        r.connect({ host: config.address, port: config.port }, (err, conn) => {
            if (err) { reject(err) }
            else { 
                connection = conn;
                resolve(conn);
            }
        });
    });
}

function returnFriends(id) {
	
	 return new Promise((resolve, reject) => { 

			connectDatabase()

			.then((connection) => {
				return methods.friends.get(connection, id);
			})

			.then((result) => {
				resolve(result);
			})

			.catch((error) => {
				resolve(error);
			});

	});

}

exports.friends = function *(id) {
	this.type = 'application/json';
	this.body = yield returnFriends(id);
}

