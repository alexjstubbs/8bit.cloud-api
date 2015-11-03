"use strict"

var chai    = require('chai'),
    should  = chai.should(),
    expect  = chai.expect,
    rp      = require('request-promise'),
    io      = require('socket.io-client'),
    uri     = 'http://localhost:3000/api/v1/',
    suri    = 'http://localhost:6052/network',
    server,
    userObject;

/*
 * Return Socket Options
 */

function opts(token) {
    return {
       'query': 'token=' + token,
        transports: ['websocket'],
        'force new connection': true
    }
}

/*
 * Creates New Random User
 */

userObject = { 
    id: `test-${Math.random().toString(36).substring(10)}`,
    password: `test-${Math.random().toString(36).substring(7)}`,
    email: `test-${Math.random().toString(36).substring(7)}@test.com`
} 

/*
 * Signs up User
 */

function signUpUser(userObject) {
    return rp({
                method: 'POST',
                uri: uri + 'signup/',
                body: userObject,
                json: true 
    });
}

/*
 * Test Suite for Connection and Authentication to API
 */

 /*
 * Test Suite Chain
 */

describe("Sign Up User", function () {
    it("Returned Token", function (done) {

        signUpUser(userObject)
        
        .then((results) => {
            results.should.have.property('token');
            done();
            return results;
        })

        .then((token) => {
           return userSuite(token.token);
        })

        .catch(done);

    });
});

/*
 * Test Suite for User Methods
 */


/*
 * Look Up User
 */

function lookUpUser(token, done) {

    return new Promise((resolve, reject) => { 

        var client = io.connect(suri, opts(token));

        client.once("connect", function() {
            client.emit('api', {model: 'user', method: 'get', payload: userObject.id});
        });

        client.once('event', function(message) {
            resolve(message);
            client.disconnect();
        });   

        client.once('error', function(message) {
            resolve(message);
            client.disconnect();
        });
      
    })
}


/*
 * Test Suite Chain
 */

function userSuite(token, done) {
    describe("User API Methods", function () {

        it("Looked up User", (done) => {

            return lookUpUser(token)
            
            .then((results) => {
                results.should.have.property('id').and.equal(userObject.id);
                done();
            })

            .then(() => {
                 return friendSuite(token);
            })

            .catch(done);

        });

    });
}

/*
 * Test Suite for Friend Methods
 */

/*
 * Adds a Friend
 */

function addAFriend(token, done) {

    return new Promise((resolve, reject) => { 

        var client = io.connect(suri, opts(token));

        client.once("connect", function() {
            client.emit('api', {model: 'friends', method: 'add', payload: userObject.id});
        });

        client.once('event', function(message) {
            resolve(message);
            client.disconnect();
        });   

        client.once('error', function(message) {
            resolve(message);
            client.disconnect();
        });
      
    })
}

/*
 * Gets Friends List
 */

function getFriends(token, done) {

    return new Promise((resolve, reject) => { 

        var client = io.connect(suri, opts(token));

        client.once("connect", function() {
            client.emit('api', {model: 'friends', method: 'get', payload: userObject.id});
        });

        client.once('event', function(message) {
            resolve(message);
            client.disconnect();
        });   

        client.once('error', function(message) {
            resolve(message);
            client.disconnect();
        });
      
    })
}

/*
 * Gets Friends List
 */

function removeAFriend(token, done) {

    return new Promise((resolve, reject) => { 

        var client = io.connect(suri, opts(token));

        client.once("connect", function() {
            client.emit('api', {model: 'friends', method: 'remove', payload: userObject.id});
        });

        client.once('event', function(message) {
            resolve(message);
            client.disconnect();
        });   

        client.once('error', function(message) {
            resolve(message);
            client.disconnect();
        });
      
    })
}


/*
 * Test Suite Chain
 */

function friendSuite(token, done) {
    describe("Friend API Methods", function () {

        it("Added a Friend", (done) => {

            return addAFriend(token)
            
            .then((results) => {
                results.should.have.property('errors').and.equal(0);
                done();
            })

        });

        it("Got Friends List", (done) => {

            return getFriends(token)
           
            .then((results) => {
                results.should.have.property('friends').and.contain(userObject.id);
                done();
            })

            .catch(done);

        });


        it("Removed a Friend", (done) => {

            return removeAFriend(token)
           
            .then((results) => {
                results.should.have.property('errors').and.equal(0);
                done();
            })

            .then(() => {
                return messagesSuite(token);
                done();
            })

            .catch(done);

        });

    });
}


/*
 * Test Suite for Messages Methods
 */

/*
 * Sends a Message
 */

function sendAMessage(token, done) {

    return new Promise((resolve, reject) => { 

        var client = io.connect(suri, opts(token));

        client.once("connect", function() {
            client.emit('api', {model: 'messages', method: 'send', payload: {
                recipient: userObject.id,
                body: "Test Message"
            }});
        });

        client.once('event', function(message) {
            resolve(message);
            client.disconnect();
        });   

        client.once('error', function(message) {
            resolve(message);
            client.disconnect();
        });
      
    })
}

/*
 * Sends a Message
 */

function getMessages(token, done) {

    return new Promise((resolve, reject) => { 

        var client = io.connect(suri, opts(token));

        client.once("connect", function() {
            client.emit('api', {model: 'messages', method: 'get', payload: 0 });
        });

        client.once('event', function(message) {
            resolve(message);
            client.disconnect();
        });   

        client.once('error', function(message) {
            resolve(message);
            client.disconnect();
        });
      
    })
}

/*
 * Deletes a Message
 */

function deleteAMessage(token, uuid, done) {

    return new Promise((resolve, reject) => { 

        var client = io.connect(suri, opts(token));

        client.once("connect", function() {
            client.emit('api', {model: 'messages', method: 'remove', payload: uuid });
        });

        client.once('event', function(message) {
            resolve(message);
            client.disconnect();
        });   

        client.once('error', function(message) {
            resolve(message);
            client.disconnect();
        });
      
    })
}



/*
 * Test Suite Chain
 */

function messagesSuite(token, done) {

    var uuid;

    describe("Messages API Methods", function () {

        it("Sends a Message", (done) => {

            return sendAMessage(token)
            
            .then((results) => {
                results.should.have.property('errors').and.equal(0);
                done();
            })

        });

        it("Gets Messages", (done) => {

            return getMessages(token)
            
            .then((results) => {
                results.should.be.an('array').and.to.have.length.above(0);
                uuid = results[0].id;
                done();
            })

        });

        it("Deletes a Message", (done) => {

            return deleteAMessage(token, uuid)
            
            .then((results) => {
                results.should.have.property('deleted').and.equal(1);
                done();
            })

        });
 
    });
}

