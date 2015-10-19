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
    return new Promise(function (resolve, reject) {
        r.connect({ host: config.address, port: config.port }, function(err, conn) {
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
    return Promise.all(_.keysIn(databases).map(function (db) {
    
        r.dbCreate(db).run(connection, function(err, conn) { if (err) { reject(err) }}) 

        return databases[db].tables;
    
    })).then(function(array){
        return array;
    });
}

// Make Database Tables (databases.json)
function makeTables(tables) {
    return Promise.all(tables.map(function (table, c) {
        for (var i = 0; i < table.length; i++) {
            r.db(Object.keys(databases)[c]).tableCreate(table[i]).run(connection, function(err, conn) { if (err) { reject(err) }}) 
        }         
        return table;
    }));
}

// Init Entry Function
function init() {

    // connectDatabase().then(function(conn) {
    //     return makeDatabases();
    // }).then(function(tables) {
    //     return makeTables(tables);
    // }).then(function() {
    //     return createDefaultUser();
    // }).then(function() {
    //     // process.exit();
    // }).catch(function(e) {
    //     console.log("error:", e);
    //     // process.exit();
    // });
    
    connectDatabase()
    .then(function(connection) {
        return createDefaultUser(connection)
    }).catch(function(e) {
        console.log("error:", e);
        // process.exit();
    });
}

// Insert Default Ignition User
function createDefaultUser(connection) {

    var user = {
        username    : config.username,
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