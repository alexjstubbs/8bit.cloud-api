/* Socket API Helpers
-------------------------------------------------- */

var token       = require('./token'),
    methods     = require('./methods'),
    socketioJwt = require('socketio-jwt'),
    gateKeeper  = require('./gateKeeper');


var userConnection = function() {

  /* Network Socket Namespace
  -------------------------------------------------- */
  var nsp = __io.of('/network');

  /* Handshake (jwt)
  -------------------------------------------------- */
  nsp.use(socketioJwt.authorize({

      secret: 'digdug',
      handshake: true

  }));

  /* User Connected
  -------------------------------------------------- */
  nsp.on('connection', function (socket) {

    //   _.throttle(function() {
          gateKeeper.connectionStore(socket, nsp);
    //   }, 100);

  /* Sends Command
  -------------------------------------------------- */
    socket.on('cmd', function (data) {

    //  _.throttle(function() {

        //  __log.info('Command from: %s', socket.handshake.headers.host, data);
         validateCmd(socket, data);

    //  }, 250);


  });

  /* User Disconnected
  -------------------------------------------------- */
    socket.on('disconnect', function () {

       __log.info('Disconnection from: %s', socket.handshake.headers.host);

       gateKeeper.disconnectionStore(socket, nsp);

      });

    });



  /* User Disconnected

  /* Validate Command
  -------------------------------------------------- */
  var validateCmd = function(socket, data) {

    if (data.token) {

        token.verifyToken(data.token, function(err, payload) {

            if (err) {

                __log.info('Error: %s from %s asking: %s', err, socket.handshake.headers.host, JSON.stringify(data));
                socket.emit('network', {error: err});

            }

            // !!! Error checking todo: make sure ID of user exists.

            else {

                __log.info('Successfull network command: %s for: %s', socket.handshake.headers.host, JSON.stringify(data));

                // Call Command
                methods[data['cmd']](__models, data['parameters'], payload.id, socket);

            }

      });

    }

    else {

      log.info('No token supplied: %s', socket.handshake.headers.host);

    }

};

};

exports.userConnection = userConnection;
