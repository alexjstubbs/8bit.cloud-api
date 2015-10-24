"use strict";

/* 
 * JSON Schema Validation and Conditionals
 */

var r           = require('rethinkdb');

// User Schema
var Schemas = {

    // User Schema
    User:  {

        id                      : "User",
        type                    : "object",
        required                : ["id", "password", "email"],
        
        properties: {
            id: {
                msg             : "signup_error",
                type            : "string",
                minLength       : "2",
                maxLength       : "15",
            },
            password: {
                type            : "string",
                minLength       : "6",
                maxLength       : "120",
            },
            email: {
                type            : "string", 
                format          : "email",
                maxLength       : "50",
            },
            avatar: {
                oneOf: [ 
                    { type      : "null" }, 
                    { type      : "string" }, 
                ],
                default         : "/satic/defaultAvatar.png",
            },
            token: {
                oneOf: [
                    { type      : "null" }, 
                    { type      : "string" },
                ],
                default         : null,
            },
            messages: {
                "$ref"          : this.Messages,
            },
            lastseen: {
                oneOf: [
                    { type      : "date-time" }, 
                    { type      : "string" },
                    { type      : "null" },
                ],
                default         : r.now(), 
            },
            ip: {
                oneOf: [ 
                    { type      : "ipv4" }, 
                    { type      : "ipv6" },
                    { type      : "null" },
                ],
                default         : null,
            },
            activities: {
                "$ref"          : this.Activities,
            },
            friends: {       
                oneOf: [ 
                    { type      : "object" },
                    { type      : "null" },
                ],
                default         : [],
            },
            online: {
                oneOf: [ 
                    { type      : "boolean" },
                    { type      : "null" },
                ],
                default: false,
            }

        }
    },

    // Messages Schema
    Messages:  {

        id                      : "Messages",
        type                    : "object",
        required                : ["from", "to", "type", "Body"],
        
        properties: {
            from: {
                type            : "string",
                minLength       : "2",
                maxLength       : "15",
            },
            ip: {
                oneOf: [ 
                    { type      : "ipv4" }, 
                    { type      : "ipv6" },
                    { type      : "null" },
                ] 
            },
            to: {
                type            : "string",
                minLength       : "2",
                maxLength       : "15",
            },
            type: {
                oneOf: [ 
                    { type      : "string" },
                    { type      : "null" },
                ],
                default         : "private_message",
            },
            body: {
                type            : "string",
                minLength       : "1",
                maxLength       : "2500",
            },
            attachment: {
                oneOf: [ 
                    { type      : "string" },
                    { type      : "null" },
                ]
            },
            timestamp: {
                oneOf: [
                    { type      : "date-time" }, 
                    { type      : "string" },
                    { type      : "null" },
                ],
                default         : r.now(),
            }
        }       
    },

    // Activities Schema
    Activities:  {

        id                      : "Activities",
        type                    : "object",
        required                : ["type", "username", "info"],
        
        properties: {
            type: {
                type            : "string",
                maxLength       : "100",
            },
            username: {
                type            : "string",
                minLength       : "2",
                maxLength       : "15",
            },
            software: {
                type            : "string",
                maxLength       : "25",
            },
            info: {
                type            : "string",
                maxLength       : "100",
            },
            timestamp: {
                oneOf: [
                    { type      : "date-time" }, 
                    { type      : "string" },
                    { type      : "null" },
                ],
                default         : r.now(),
            }
        }
    },

    // Events Schema
    Events:  {

        id                      : "Events",
        type                    : "object",
        required                : ["type"],

        properties: {
            type: {
                type            : "string",
                maxLength       : "25",
            },
            append: {
                type            : "string",
                maxLength       : "100",
            },
            git: {
                type            : "string",
                maxLength       : "250",
            },
            hash: {
                type            : "string",
                maxLength       : "256",
            },
            timestamp: {
                oneOf: [
                    { type      : "date-time" }, 
                    { type      : "string" },
                    { type      : "null" },
                ],
                default         : r.now(),
            }
        }
    },

    // Community Schema
    Community:  {

        id                      : "Community",
        type                    : "object",
        required                : ["title", "description", "url", "image"],

        properties: {
            title: {
                type            : "string",
                maxLength       : "85",
            },
            description: {
                type            : "string",
                maxLength       : "3000",
            },
            subtitle: {
                type            : "string",
                maxLength       : "85",
            },
            url: {
                type            : "string",
                format          : "uri",
                minLength       : "6",
                maxLength       : "85",
            },
            rss: {
                type            : "string",
                format          : "uri",
                minLength       : "6",
                maxLength       : "85",
            },
            image: {
                type            : "string",
                format          : "uri",
                minLength       : "6",
                maxLength       : "85",
            },
            styles: {
                type            : "string",
                maxLength       : "3000",
            },
            local: {
                oneOf: [
                    { type      : "string" },
                    { type      : "boolean" },
                    { type      : "null" },
                ],
                default         : false,
            },
            timestamp: {
                oneOf: [
                    { type      : "date-time" }, 
                    { type      : "string" },
                    { type      : "null" },
                ],
                default         : r.now(),
            }
        }
    }

}

// Exports
exports.Schemas = Schemas;