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
            return models.user.update(connection, authUser, { lastseen: now } );
        })

        .then((result) => {
            resolve(result);
        })

        .catch((error) => {
            console.log(error);
        })

        .then(() => {
            socket.disconnect();
        });

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
        let authUser = socket.decoded_token.id;
        console.log('hello!', authUser, ", Client #:", $io.engine.clientsCount);
        
        socket.on('disconnect', () => {
            console.log('Client Disconnected:', authUser);
        });

        return socketConnection(socket, authUser);
      
    });


}

