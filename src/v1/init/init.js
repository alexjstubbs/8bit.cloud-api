'use strict';

/* 
 * Description: Set up ignition API server Datastore and Initial User Account.
 */

var db          = require('../models/db'),
    log         = require('../controllers/logging'),
    config      = require('../config.json'),
    r           = require('rethinkdb'),
    _           = require('lodash'),
    databases   = require('./databases.json').databases,
    Promise     = require("bluebird"),
    models      = require('../models'),
    connection;

/* 
 * Create Databases (via databases.json)
 */

function makeDatabases(connection) {
    return Promise.all(_.keysIn(databases).map((db) => {
    
        r.dbCreate(db).run(connection, (error, conn) => { 
            if (error) { 
                return error; 
            }
        }) 

        return databases[db].tables;
    
    })).then((array) => {
        return array;
    });
}

/* 
 * Create Database Tables (via databases.json)
 */

function makeTables(connection, tables) {
    return Promise.all(tables.map((table, c) => {
        for (var i = 0; i < table.length; i++) {
            r.db(Object.keys(databases)[c]).tableCreate(table[i]).run(connection, (error, conn) => { 
                if (error) { console.log(error) }
            }) 
        }
    })).then((array) => {
        return array;
    });
}

/* 
 * Create Default User Account ("admin" type)
 */

function createDefaultUser (connection) {

        var user = {
            id          : config.username,
            password    : config.password,
            email       : config.email
        }

        setTimeout(function() {
            return models.user.create(connection, user);
            process.exit();
        }, 10000);
           
}

/* 
 * Promise Chain Entry
 */

function init(connection) {

    return makeDatabases(connection)
    
    .then((tables) => {
        return makeTables(connection, tables);
    })

    .then(() => {
        return createDefaultUser(connection);
    })

    .catch(function(error) {
        console.error(error);
    });
  
}

/* 
 * Entry Point
 */

return db.connection().then((connection) => {
    init(connection);
})


/* Exports
-------------------------------------------------- */
exports.init = init;