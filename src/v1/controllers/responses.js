"use strict";

/*
 * Event Responses
 */

/*
 * response
 * 
 * @param: id      : ID of event/response in Reference to responseList (string) 
 * @param: object  : A String Representation of Possible Error Stack   (object) 
 * 
 */

var response = function(id, object) {

    return { response: reponseList[id], object: object };

}

/*
 * resultList
 */

var responseList = {

    new_message: {
      "type:":   "message",
      "id":      "new_message",
      "message": "You have a new message!"
     },

    new_message: {
      "type:":   "message",
      "id":      "new_message",
      "message": "You have a new message!"
     },

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
exports.response 		  = response;
exports.responseList 	= responseList;
