'use strict';

/* 
 * Initilize Databases for first run
 */

var config      = require('../config.json'),
    r           = require('rethinkdb'),
    _           = require('lodash'),
    Promise     = require("bluebird"),
    models     = require('../models'),
    connection;

function removeFriend() {

    connectDatabase()

    .then(function(connection) {
        // return createDefaultUser(connection)
        return models.friends.remove(connection, "Alex", "Alex")
    })
    
    .then((results) => { 
        console.log("results:", results);
    })

    .then(() => {
        process.exit();
    })

    .catch((error) => {
        console.log("creation error:", error);
    })

    .then(() => {
        process.exit();
    });

}