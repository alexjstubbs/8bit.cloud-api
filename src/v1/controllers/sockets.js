'use strict';

/*
 * Socket.io Connections
 */

var   config        = require('../../keys/config.js'),
      models        = require('../models'),
      db            = require('./db'),
      token         = require('./token'),
      errors        = require('./errors').error,
      response      = require('./responses').response,
      _             = require('lodash'),
      ipaddr        = require('ipaddr.js'),
      socketioJwt   = require('socketio-jwt'),
      Promise       = require('bluebird');

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
            return models.user.update(connection, authUser, { lastseen: now, online: authUser.online, ip: authUser.ip } );
        })

        .then((result) => {
            resolve(result);
        })

        .catch((error) => {
            console.log("error", error);
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
            reject(error);
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
     * Use JSON Web Tokens for authorization to API
     */

    $nsp

    .use(socketioJwt.authorize({
        secret: config.ignition_secret,
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

        /*
         * Send User to their namespaced room
         */

        socket.join(`/user/${authUser.id}`);

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
            return apiCall(socket, authUser, apiObj)
            .then((results) => {
                socket.emit('event', results);
            })
        })

        return socketConnection(socket, authUser)

        
      
    });

}

