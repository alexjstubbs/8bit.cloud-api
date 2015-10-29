var io 	   = require('socket.io-client'),
	jwt    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IkFsZXgiLCJpYXQiOjE0NDU3OTUwMzd9.pMd9Qa9c-uZk26WWm4N3so3FzjT81BzJ4IonDRwST_Y";

var payload = { recipient: "Alex", body: "Hey, what's up?" };

var socket = io.connect('http://localhost:6052/network', {
  'query': 'token=' + jwt
});

socket.on('connect', function () {
	console.log("Connected and Authenticated");
	socket.emit('api', {model: 'messages', method: 'send', payload: payload});
	// socket.disconnect();
	// process.exit();
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