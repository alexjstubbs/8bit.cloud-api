/* Init Functions
-------------------------------------------------- */
var mongoose    = require('mongoose')
,   Schema      = mongoose.Schema
,   ObjectId    = Schema.ObjectId
,   _           = require('lodash')
,   token       = require('./token')
,   bunyan      = require('bunyan')
,   errors      = require('./errors').error
,   results     = require('./clientResults').result
,   result
,   error;


/* Get Profile
-------------------------------------------------- */
var getProfile = function(models, parms, id, socket) {

    __models.User.find({ Username: parms }, {'Username':1, 'Activities':1, 'Online':1, 'IP':1, 'LastSeen':1, 'Avatar':1, '_id':0}, function (err, user) {

        if (err) {

            error = errors('no_such_user');

            socket.emit('network', error);

        }

        if (user) {

            socket.emit('network', { userProfile: user });

        }

        if (!user) {

            error = errors('no_such_user');

            socket.emit('network', error);

        }

    });
};

/* Delete Message
-------------------------------------------------- */
var deleteMessage = function(models, parms, id, socket) {

    __models.User.findOne({ _id: id }, function (err, user) {

        if (err) {

            console.log(err);

            error = errors('database_error');

            socket.emit('network', error);

        }

        // User who contains document found
        if (user) {

            // Find subdocument and remove from memory
            var message = user.Messages.id(parms);

            if (message) {

                var doc = message.remove();

                // Save parent document
                user.save(function (err) {

                    if (err) {

                        error = errors('cannot_remove');

                        socket.emit('network', error);

                    }

                    else {

                        result = results('message_deleted', null);

                        socket.emit('network', result);

                    }

                });

            }

            else {

                error = errors('no_such_message');

                socket.emit('network', error);

            }
        }

    });
};

/*  Pass a Message
-------------------------------------------------- */
var passMessage = function(models, parms, id, socket) {

    var nsp = __io.of('/network');

    // Not empty
    if (parms) {

        __models.User.findOne({ _id: id }, function (err, sender) {

            if (err) {

                error = errors('no_such_user');

                socket.emit('network', error);

            }

            else {

                parms.From   = sender.Username;
                parms.IP     = sender.IP;
                parms.Avatar = sender.Avatar;

                __models.User.findOne({ Username: parms.To }, function (err, user) {

                    if (err) {

                        error = errors('no_such_user');

                        socket.emit('network', error);

                    }

                    // No errors
                    else {

                        // User does exist...
                        if (user) {

                            var newMessage = new __models.Messages(parms);

                            newMessage.save(function(err, message) {

                                if (err) {

                                    error = errors('message_error');

                                    socket.emit('network', error);

                                }

                                // No errors saving message. Save $_id to Message array in the recipients profile record
                                else {

                                    user.update({$addToSet: { 'Messages' : message }},{upsert:true}, function(err, data) {

                                        if (err) {

                                            error = errors('message_error');

                                            socket.emit('network', error);

                                        }

                                        else {

                                            // Inform User of message Recieved
                                            var personalRoom = 'user:'+user._id;

                                            var result = results('new_message', {
                                                Username: sender.Username
                                            });

                                            nsp.to(personalRoom).emit('network', result);

                                            // Inform User of Message Sent
                                            result = results('message_sent', null);

                                            socket.emit('network', result);

                                        }

                                    });

                                }

                            });

                        }

                        else {

                            error = errors('no_such_user');

                            socket.emit('network', error);

                        }
                    }

                });
            }
        });
    }

};


/* Get Messages
-------------------------------------------------- */
var getMessages = function(models, parms, id, socket) {


    __models.User.findOne({ _id: id }, function (err, user) {


        if (err) {

            error = errors('messages_error');

            socket.emit('network', error);

        }


        if (!user) {

            error = errors('no_such_user');

            socket.emit('network', error);

        }

        else {

            socket.emit('network', { messages: user.Messages });

       }


    });

};

/* Get Friends
-------------------------------------------------- */
var getFriends = function(models, parms, id, socket) {

    __models.User.findOne({ _id: id }, function (err, user) {

        if (err) {

            console.log(err);

            error = errors('database_error');

            socket.emit('network', error);

        }

        if (!user) {

            error = errors('no_such_user');

            socket.emit('network', error);

        }

        else {

            // Has Friends
            if (user.Friends) {

                __models.User.find({'_id': { $in: user.Friends}}, {'Username':1, 'Activities':1, 'Avatar':1, 'LastSeen':1, 'Online':1, "IP":1, '_id':1}, function(err, docs) {

                    if (err) {

                        console.log(err);

                        error = errors('database_error');

                        socket.emit('network', error);

                    }

                    else {

                        if (!docs) {

                            error = errors('user_error');

                            socket.emit('network', error);

                        }

                        else {

                            socket.emit('network', {friends: docs});

                        }
                    }

                });
            }

            else {
                socket.emit('network', {friends: null});

            }
        }

    });

};

/* Add a Friend
-------------------------------------------------- */

var addFriend = function(models, parms, id, socket) {

    __models.User.findOne({Username: parms.username}, function(err, user) {

        if (err || !user) {

            error = errors('no_such_user');

            socket.emit('network', error);

        }

        else {

            __models.User.update({_id: id }, {$addToSet: { 'Friends' : user._id }},{upsert:true}, function(err, data) {

                    if (err && user) {
                        __log.info(err);
                        socket.emit({error: 'Could not add friend.'});
                    }

                    // Success
                    if (user) {

                        socket.emit({response: 'success'});

                        if (parms.Message) {

                            var _parms = {
                                Avatar: null,
                                From: user.Username,
                                To: parms.username,
                                Body: parms.Message,
                                Type: 'friend_request'
                            };

                            var room = 'friend:'+user._id;

                            socket.join(room);

                        }

                        else {

                            var _parms = {
                                Avatar : null,
                                From   : user.Username,
                                To     : parms.username,
                                Body   : 'I have added you to my friends list.',
                                Type   : 'friend_request'
                            };
                        }

                        passMessage(models, _parms, id, socket);

                    }

                    if (!user) {
                        socket.emit({response: 'Wrong Token.'});
                    }
            });

            }
        });

};

/* Get Activities
-------------------------------------------------- */
var getActivities = function(models, parms, id, socket) {

    var activityPayload = [];

    __models.User.findOne({ _id: id }, function (err, user) {
        if (err) {
            console.log(err);
        }

        if (!err && user) {
            // socket.emit('network', {activities: user.Activities});

            activityPayload.push(user.Activities);

            __models.User.find({'_id': { $in: user.Friends}}, {'Username':1, 'Activities':1, 'Avatar':1, 'Online':1, "IP":1, '_id':1}, function(err, docs) {

                if (err) {

                    // Has No Friends
                    // error = errors('database_error');
                    //
                    // socket.emit('network', error);

                }

                else {

                    if (!docs) {

                        socket.emit('network', {activities: activityPayload});

                    }

                    else {

                        activityPayload.push(docs[0].Activities);
                        activityPayload = _.flatten(activityPayload);

                        socket.emit('network', {activities: activityPayload});

                    }
                }

            });



        }


        if (!user) {
            socket.emit({response: 'Wrong Token.'});
        }
    });

};

/* Store Activity
-------------------------------------------------- */
var storeActivity = function(models, parms, id, socket) {


    __models.User.findOne({ _id: id }, function (err, user) {


        if (err) {
            console.log(err);
        }

        // Success
        if (!err && user) {

            parms.Username = user.Username;

            var newActivity = new __models.Activity(parms);

            newActivity.save(function(err, activity) {

                if (err) {

                    error = errors('message_error');

                    socket.emit('network', error);

                }

                else {

                    user.update({$addToSet: { 'Activities' : activity }},{upsert:true}, function(err, data) {

                        if (err) {

                            console.log(err);

                            // error = errors('message_error');
                            //
                            // socket.emit('network', error);

                        }

                        else {

                            // result = results('message_sent', null);
                            //
                            // socket.emit('network', result);

                        }

                    });

                }


            });
            // socket.emit('network', {activities: user.Activities});
        }

        if (!user) {
            socket.emit({response: 'Wrong Token.'});
        }
    });

};

/* User Signup
-------------------------------------------------- */
var newProfile = function(userObject, callback) {

    // Search for E-mail
    __models.User.findOne({ Email: userObject.Email }, function (err, email) {

        if (err) {

            error = errors('no_such_user');

            callback(error);

            __log.info(err);

        }

        if (!email) {

            // E-mail not Taken
            __models.User.findOne({ Username: userObject.Username }, function (err, user) {

                // General Error with Database
                if (err) {

                    console.log(err);

                    error = errors('database_error');

                    callback(error);

                    __log.info(err);

                }

                // Success: No such profile. Create one.
                if (!user) {

                    var newProfile = new __models.User(userObject);

                        newProfile.save(function(err, profile) {

                            if (err) {

                                console.log(err);

                                error = errors('database_error');

                                callback(error);
                            }

                            else {

                                callback({profile: profile });

                            }

                        });
                }

                // User Exists
                if (user) {

                    error = errors('username_taken');

                    callback(error);

                    __log.info(error);

                }

            });

        }

        // Email Taken
        else {

            error = errors('email_taken');

            callback(error);

        }


    });

};

/* Client Messages
-------------------------------------------------- */
var clientMessage = function(res, obj) {
    res.status(200).json(obj);
}

/* Exports
-------------------------------------------------- */

exports.getProfile      = getProfile;
exports.deleteMessage   = deleteMessage;
exports.getMessages     = getMessages;
exports.passMessage     = passMessage;
exports.getActivities   = getActivities;
exports.storeActivity   = storeActivity;
exports.getFriends      = getFriends;
exports.newProfile      = newProfile;
exports.addFriend       = addFriend;
exports.clientMessage   = clientMessage;
