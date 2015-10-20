"use strict";

/*
 * Results Methods
 */

/*
 * result
 * 
 * @param: id      : ID of Result in Reference to ResultList          (string) 
 * @param: object  : A String Representation of Possible Error Stack  (object) 
 * 
 */

var result = function(id, object) {

    return { result: resultList[id], object: object };

}

/*
 * resultList
 */

var resultList = {

    new_message: {
      "type:": 	 "message",
      "id":      "new_message",
      "message": "You have a new message!"
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
exports.result 		  = result;
exports.resultList 	= resultList;
