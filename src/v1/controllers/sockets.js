'use strict';

/*
 * Socket.io Connections
 */

 var  db            = require('../models/db'),
      models        = require('../models'),
      token         = require('../token'),
      socketioJwt   = require('socketio-jwt'),
      Promise       = require('bluebird'),
      errors        = require('./errors').error,
      _             = require('lodash'),
      config        = require('../config.json');


/*
 * Use the '/network' namespace for connected ignition clients
 */

var $nsp = $io.of('/network');

/*
 * Use JSON Web Tokens for authorization to API
 */

$nsp.use(socketioJwt.authorize({
    secret: config.secret,
    handshake: true
}));

function connectionValidation(socket) {

    return new Promise((resolve, reject) => { 

        let userToken = socket.handshake.query.token,
        host          = socket.handshake.address;

        token.verifyToken(userToken, (err, user) => {

        if (err) {
            reject(errors('wrong_token'));
        }

        else {
            console.log("success!!:", user);
            resolve();
        }

    })

}

/*
 * Promise Chain for Connection Event(s)
 */

function socketConnection(socket) {
 
    return new Promise((resolve, reject) => { 

        connectionValidation(socket)

        .then(() => {
            db.connection()
        })

        .then((connection) => {
            return models.user.update(connection, { online: true } );
        })

        .then(connection) => {
            return models.user.update(connection, { lastseen: db.now() }
        }

        .then((result) => {
            resolve(result);
        })

        .catch((error) => {
            resolve(error);
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

    // User Connected
    $sio.on('connection', (socket) => {
        console.log("Client Connected");
    })



}

