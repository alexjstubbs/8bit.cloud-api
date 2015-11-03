'use strict';

var chai 	 = require('chai'),
    should 	 = chai.should(),
    io 		 = require('socket.io-client'),
    rp 		 = require('request-promise'),
	Promise  = require('bluebird'),
	uri 	 = "http://localhost:3000/api/v1/signup";

// Make "random" user
function makeUser() {
    return new Promise((resolve, reject) => { 
	    resolve(
	    	{ id: `test-${Math.random().toString(36).substring(10)}`,
	    	  password: `test-${Math.random().toString(36).substring(7)}`,
	    	  email: `test-${Math.random().toString(36).substring(7)}@test.com`
	    	}
	    )
	});
}

// Set Unique Options for Post
function postOptions(userObject) {
	return new Promise((resolve, reject) => { 
	    resolve(
		    {
			    method: 'POST',
			    uri: uri,
			    body: userObject,
			    json: true 
			}
		)
	});
}

function socketConnection(token) {

	console.log(token)

		var socket = io.connect('http://localhost:3000/network', {
		  'query': 'token=' + token.token
		});

		socket.on('connect', function (socket) {
			console.log("[!] Connected and Authenticated");
		});

		socket.on('event', function(data){
			console.log("event", data);
		});

		socket.on('error', function(error){

			console.log("error", error);

			socket.disconnect();
			process.exit();

		});

		socket.on('disconnect', function(){
			console.log("Disconnected");
		});
	
}

// Test Sign Up and basic API calls
function testSignup() {

	return new Promise((resolve, reject) => { 
		return makeUser()

		.then((userObject) => {
			return postOptions(userObject);
		})

		.then((options) => {
			return rp(options);
		})

		.then((token) => {
			socketConnection(token);
		})

		// .then((socket) => {
		// 	console.log('socket', socket);
		// 	// socket.emit('api', {model: 'messages', method: 'get', offset: 0});
		// })

		.catch((error) => {
			console.error(error);
		});

	});
}

// Init Suite 
testSignup();
