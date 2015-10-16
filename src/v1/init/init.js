'use strict';

/* 
 * Initilize Databases for first run
 */

var r           = require('rethinkdb'),
    _           = require('lodash'),
    chalk       = require('chalk'),
    config      = require('../config.json'),
    databases   = require('./databases.json').databases,
    schemas     = require('../schemas').Schemas,
    validate    = require('jsonschema').validate,
    Promise     = require("bluebird"),
    methods     = require('../methods'),
    _conn;


// Connect to datastore
function connectDatabase() {
    return new Promise(function (resolve, reject) {
        r.connect({ host: config.address, port: config.port }, function(err, conn) {
            if (err) { reject(err); }
            else { 
                _conn = conn;
                resolve(conn);
            }
        });
    });
}

function makeDatabases() {
    return Promise.all(_.keysIn(databases).map(function (db) {
        r.dbCreate(db).run(_conn, function(err, conn) {
            if (err) { throw err }
        });
    return databases[db].tables;
  }));
}

function makeTables(tables) {
    return Promise.all(tables.map(function (table, c) {
        for (var i = 0; i < table.length; i++) {
            r.db(Object.keys(databases)[c]).tableCreate(table[i]).run(_conn, function(err, conn) {
                if (err) { throw err }
            });
        }
        return table
    }));
}

// Set up databases and tables
function init() {

    connectDatabase()
    .then(function(conn) {
        return makeDatabases();
    })
    .then(function(tables) {
        return makeTables(tables);
    })
    .then(function() {
        process.exit();
    })
    .catch(function(e) {
        console.log("e", e);
    });


}

// Insert Default Ignition User
function createDefaultUser(conn) {

    var user = {
        username    : config.username,
        password    : config.password,
        email       : config.email
    }

    methods.user.create(conn, user, function(err, res) {
        // callback(err, res);
    })
}

// Call Set Up Function
init();


/* Exports
-------------------------------------------------- */
exports.init = init;