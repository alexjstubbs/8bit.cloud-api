"use strict";

/*
 * Error Methods
 */

/*
 * error
 * 
 * @param: id     : ID of Error in Reference to errorList            (string) 
 * @param: stack  : A String Representation of Possible Error Stack  (optional, string) 
 * 
 */

var error = function(id, stack) {
    if (errorList.hasOwnProperty(id)) { 
            return errorList[id]; 
    }
    else { 
        let errorMsg = errorList["general_error"];
        errorMsg.stack = stack;
        return errorMsg; 
    }
}

/*
 * errorList
 */
 
var errorList = {

    general_error: {
     "type:":   "error",
     "id":      "general_error",
     "message": "Something has gone wrong. Contact support@ignition.io if this message persists.",
     "url":     "https://docs.ignition.io/troubleshooting"
    },

    rate_limit: {
      "type:":   "error",
      "id":      "rate_limit",
      "message": "Account reached its API rate limit. We are receiving too many requests from this IP. Contact support@ignition.io if this message persists.",
      "url":     "https://docs.ignition.io/rate-limits"
    },

    no_such_user: {
      "type:":   "error",
      "id":      "no_such_user",
      "message": "User does not exist.",
      "url":     "https://docs.ignition.io/no-such-user"
    },

    username_taken: {
      "type:":   "error",
      "id":      "username_taken",
      "message": "Username is already taken.",
      "url":     "https://docs.ignition.io/username-taken"
    },

    signup_error: {
      "type:":   "error",
      "id":      "signup_error",
      "message": "Could not create your new profile. Contact support@ignition.io if this message persists.",
      "url":     "https://docs.ignition.io/signup-error"
    },

    password_notmatched: {
      "type:":   "error",
      "id":      "password_notmatched",
      "message": "Your passwords do not match.",
      "url":     "https://docs.ignition.io/password-notmatched"
    },

    email_taken: {
      "type:":   "error",
      "id":      "email_taken",
      "message": "An account under this email already exists.",
      "url":     "https://docs.ignition.io/email-taken"
    },

    user_disconnected: {
      "type:":   "error",
      "id":      "user_disconnected",
      "message": "The remote user has disconnected.",
      "url":     "https://docs.ignition.io/user-disconnected"
    },

    no_such_message: {
      "type:":   "error",
      "id":      "no_such_message",
      "message": "No message exists with that ID in the database.",
      "url":     "https://docs.ignition.io/no-such-message"
    },

    message_error: {
      "type:":   "error",
      "id":      "message_error",
      "message": "There was a problem sending your messages. Contact support@ignition.io if this message persists.",
      "url":     "https://docs.ignition.io/message-error"
    },

    messages_error: {
      "type:":   "error",
      "id":      "messages_error",
      "message": "There was a problem retrieving your messages. Contact support@ignition.io if this message persists.",
      "url":     "https://docs.ignition.io/messages-error"
    },

    user_error: {
      "type:":   "error",
      "id":      "user_error",
      "message": "There was a problem looking up the user. User may not exist or the database is returning an incomplete profile.",
      "url":     "https://docs.ignition.io/user-error"
    },

    database_error: {
      "type:":   "error",
      "id":      "database_error",
      "message": "There was a general error with the database. Please check your submission and try again. Contact support@ignition.io if this message persists.",
      "url":     "https://docs.ignition.io/database-error"
    },

    incomplete_request: {
      "type:":   "error",
      "id":      "incomplete_request",
      "message": "Your request contained incomplete information needed by the server. Try your request again.",
      "url":     "https://docs.ignition.io/incomplete-request"
    },

    cannot_remove: {
      "type:":   "error",
      "id":      "cannot_remove",
      "message": "The server returned an error when attempting to remove the document. This error has been logged for review.",
      "url":     "https://docs.ignition.io/cannot_remove"
    },

    error_issuing_token: {
      "type:":   "error",
      "id":      "error_issuing_token",
      "message": "A server token could not be issued. Contact support@ignition.io if this message persists.",
      "url":     "https://docs.ignition.io/error-issuing-token"
    },

    wrong_token: {
      "type:":   "error",
      "id":      "wrong_token",
      "message": "Your server token has either expired or is malformed. Try to sign back in for a new token.",
      "url":     "https://docs.ignition.io/wrong-token"
    },

    wrong_password: {
      "type:":   "error",
      "id":      "wrong_passowrd",
      "message": "Your password does not match. You can reset your password.",
      "url":     "https://docs.ignition.io/wrong-password"
    },

}


/* Exports
-------------------------------------------------- */
exports.error       = error;
exports.errorList   = errorList;
