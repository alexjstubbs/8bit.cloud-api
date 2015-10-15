/* Gate Keeper (connections/disconnections)
 -------------------------------------------------- */
var _           = require('lodash'),
    token       = require('./token'),
    results     = require('./clientResults').result,
    result;

/* Connection
-------------------------------------------------- */
var connectionStore = function(socket, io) {

    var userToken = socket.handshake.query.token,
        host      = socket.handshake.address;

    // __log.info('Connection from: %s', host);

    token.verifyToken(userToken, function(err, user) {
        if (err) {
            console.log('error issuing token');
            socket.disconnect();
        }

        else {

            __models.User.findOne({ _id: user.id }, function (err, user) {

                if (!err && user)  {

                    _(user.Friends).forEach(function(friend) {

                        console.log('Adding to room: ' + friend);

                        var room = 'friend:'+friend;

                        socket.join(room);

                    });

                    // Join my own room / for namespacing
                    var personalRoom = 'user:'+user._id;

                    socket.join(personalRoom);

                    // Notify those in my room that I am online...
                    var myRoom = 'friend:'+user._id;

                    result = results('friend_online', {
                        Username: user.Username,
                        Avatar:   user.Avatar
                        });

                    io.to(myRoom).emit('network', result);

                    // __log.info('Connection as: %s', user);
                    if (user) {
                        user.update({ IP: host }, function (err, numberAffected, raw) {
                          if (err) __log.info(err);
                        });

                        user.update({ Online: true }, function (err, numberAffected, raw) {
                          if (err) __log.info(err);
                        });
                    }

                }

            });
        }
    });
}

/* Disconnection
-------------------------------------------------- */

var disconnectionStore = function(socket, io) {

    var userToken = socket.handshake.query.token,
        host      = socket.handshake.headers.host;

    __log.info('Disconnection from: %s', host);

    console.log('Disconnected: ' + host);

    token.verifyToken(userToken, function(err, user) {
        if (err) {
            log('error issuing token');
        }

        else {

            __models.User.findOne({ _id: user.id }, function (err, user) {

                if (!err && user) {

                    user.update({ LastSeen: new Date().toUTCString() }, function (err, numberAffected, raw) {
                        if (err) __log.info(err);
                    });

                    user.update({ Online: false }, function (err, numberAffected, raw) {
                      if (err) __log.info(err);
                    });

                    // Tell everyone in my room that i just went offline
                    var myRoom = 'friend:'+user._id;
                    io.to(myRoom).emit('network', { offline: user.Username, run: true, cmd:'userNotify' });

                }

            });
        }
    });

};

/*  Exports
-------------------------------------------------- */
exports.connectionStore     = connectionStore;
exports.disconnectionStore  = disconnectionStore;
