/* Return Server Messages (REST/Socket)
-------------------------------------------------- */

/* Return Message to User, WebSockets or HTTP
-------------------------------------------------- */
var result = function(id, object) {

    return { result: resultList[id], object: object };

}

/* Message List
-------------------------------------------------- */
var resultList = {

    new_message: {
      "type:": 	 "message",
      "id":      "new_message",
      "message": "Your have a new message!"
     },

    message_sent: {
      "type:": 	 "message",
      "id":      "message_sent",
      "message": "Your message has been sent!"
     },

    message_deleted: {
      "type:":    "message",
      "id":       "message_deleted",
      "message":  "Message was deleted!"
    },

    friend_online: {
      "type:":    "message",
      "id":       "friend_online",
      "message":  "is online!"
    },

    friend_offline: {
      "type:":    "message",
      "id":       "friend_offline",
      "message":  "is offline!"
    },


}


/* Exports
-------------------------------------------------- */
exports.result 		= result;
exports.resultList 	= resultList;
