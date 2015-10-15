/* Schemas & Models Module
-------------------------------------------------- */
var mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   ObjectId = Schema.ObjectId;

module.exports = function(mongoose) {

/* Schemas
-------------------------------------------------- */

    var communitySchema = new Schema({
          id            : ObjectId
        , title         : String
        , description   : String
        , subtitle      : String
        , URL           : String
        , RSS           : String
        , Image         : String
        , Styles        : Object
        , Local         : Boolean
        , Timestamp     : { type: Date, default: Date.now }
    }, { capped: { size : 5242880, max: 1, autoIndexId: true } });

    var eventsSchema = new Schema ({
          id            : ObjectId
        , Type          : String
        , Append        : String
        , Git           : String
        , Hash          : String
        , Timestamp     : { type: Date, default: Date.now }
    }, { capped: { size : 5242880, max: 3, autoIndexId: true } });

    var messageSchema = new Schema ({
          id            : ObjectId
        , From          : String
        , IP            : String
        , Avatar        : String
        , To            : String
        , Type          : String
        , Body          : String
        , Attachment    : String
        , Invite        : String
        , Timestamp     : { type: Date, default: Date.now }
    }, { capped: { size : 5242880, max: 50, autoIndexId: true } });

    var userSchema = new Schema ({
          id            : ObjectId
        , Username      : { type: String, required: true, unique: true, sparse: true }
        , validPassword : { type: String, required: true } // 469df27ea91ab84345e0051c81868535
        , Email         : { type: String, required: true, unique: true, sparse: true }
        , Avatar        : String
        , Token         : String
        , Checksum      : String
        , Messages      : [messageSchema]
        , LastSeen      : { type: Date, default: Date.now }
        , IP            : String
        , Activities    : [activitySchema]
        , Friends       : Object
        , Online        : Boolean
    });

    var activitySchema = new Schema ({
          id            : ObjectId
        , Type          : String
        , Username      : String
        , Software      : String
        , Info          : String
        , Local         : String
        , Timestamp     : { type: Date, default: Date.now }
    }, { capped: { size : 1024, max: 4, autoIndexId: true } });

/* Models
-------------------------------------------------- */

    var models = {
      Community : mongoose.model('Community', communitySchema),
      Events    : mongoose.model('Events', eventsSchema),
      Messages  : mongoose.model('Messages', messageSchema),
      Activity  : mongoose.model('Activity', activitySchema),
      User      : mongoose.model('User', userSchema),
    };

    return models;
};
