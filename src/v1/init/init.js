'use strict';

/* 
 * Initilize Databases for first run
 */

var config      = require('../config.json'),
    r           = require('rethinkdb'),
    _           = require('lodash'),
    chalk       = require('chalk'),
    databases   = require('./databases.json').databases,
    Promise     = require("bluebird"),
    methods     = require('../methods'),
    connection;

// Connect to datastore
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

// Make Initial Databases (databases.json)
function makeDatabases() {
    return Promise.all(_.keysIn(databases).map((db) => {
    
        r.dbCreate(db).run(connection, (err, conn) => { if (err) { reject(err) }}) 

        return databases[db].tables;
    
    })).then((array) => {
        return array;
    });
}

// Make Database Tables (databases.json)
function makeTables(tables) {
    return Promise.all(tables.map((table, c) => {
        for (var i = 0; i < table.length; i++) {
            r.db(Object.keys(databases)[c]).tableCreate(table[i]).run(connection, (err, conn) => { if (err) { reject(err) }}) 
        }         
        return table;
    }));
}

// Init Entry Function
function init() {

    // connectDatabase()

    // .then((conn) => {
    //     return makeDatabases();
    // })

    // .then((tables) => {
    //     return makeTables(tables);
    // })

    // .then(() => {
    //     return createDefaultUser();
    // })

    // .then(() => {
    //     process.exit();
    // })

    // .catch(function(e) {
    //     console.log("error:", e);
    // })

    // .then(() => {
    //     process.exit();
    // });
    
    connectDatabase()
    
    .then(function(connection) {
        return createDefaultUser(connection)
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

// Insert Default Ignition User
function createDefaultUser(connection) {

    var user = {
        id          : config.username,
        password    : config.password,
        email       : config.email
    }

    return methods.user.create(connection, user);

}

// Call Set Up Function
init();


/* Exports
-------------------------------------------------- */
exports.init = init;