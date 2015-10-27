'use strict';

/*
 * Socket.io Connections
 */

 var  db            = require('../models/db'),
      models        = require('../models'),
      token         = require('../token'),
      socketioJwt   = require('socketio-jwt'),
      Promise       = require('bluebird'),
      errors        = require('../models/errors').error,
      _             = require('lodash'),
      ipaddr        = require('ipaddr.js'),
      config        = require('../config.json');


/*
 * Promise Chain for Connection Event(s)
 */

function socketConnection(socket, authUser) {

    // Promise Chain
    return new Promise((resolve, reject) => { 

        return db.connection()

        .then((connection) => {
            return [connection, db.now()];
        })

        .spread((connection, now) => {
            return models.user.update(connection, authUser.id, { lastseen: now, online: authUser.online, ip: authUser.ip } );
        })

        .then((result) => {
            resolve(result);
        })

        .catch((error) => {
            console.log(error);
            socket.disconnect();
        });

    });

}


/*
 * Promise Chain for API Event(s)
 */

function apiCall(socket, authUser, apiObj) {

    // Promise Chain
    return new Promise((resolve, reject) => { 

        return db.connection()

        .then((connection) => {
            return models[apiObj.model][apiObj.method](connection, authUser, apiObj.payload)
        })

        .then((result) => {
            resolve(result);
        })

        .catch((error) => {
            console.log(error);
            socket.disconnect();
        })


    });

}

/*
 * userConnection
 *
 * description: Handles connection events via sockets
 *
 */

exports.userConnection = () => {

    /*
     * Use the '/network' namespace for connected ignition clients
     */

    var nsp = $io.of('/network');

    /*
     * Use JSON Web Tokens for authorization to API
     */

    nsp

    .use(socketioJwt.authorize({
        secret: config.secret,
        handshake: true
    }))

    /*
     * Connection / Disconnection Events ('/network')
     */

    .on('connection', (socket) => {

        /*
        * Create Authenticated User Object
        */
        
        let authUser = {
            id: socket.decoded_token.id,
            ip: ipaddr.process(socket.request.connection._peername.address).toString(),
            online: true
        }

        console.log('connection:', authUser, ", Client #:", $io.engine.clientsCount);
        
        /*
        * On Disconnection of Socket/Client
        */
        
        socket.on('disconnect', () => {
            authUser.online = false;
            return socketConnection(socket, authUser);
            console.log('disconnection:', authUser);
        });


        /*
        * Recieve an API Call
        */
        
        socket.on('api', function (apiObj) {
            return apiCall(socket, authUser, apiObj);
        });


        return socketConnection(socket, authUser);
      
    });

}

