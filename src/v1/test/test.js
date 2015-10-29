"use strict"

var models         = require('../models'),
    config         = require('../config.json'),
    db             = require('../controllers/db'),
    io             = require('socket.io-client'),
    rp             = require('request-promise'),
    child_process  = require('child_process'),
    chai           = require('chai'),
    chaiAsPromised = require("chai-as-promised"),
    Promise        = require('bluebird'),
    assert         = chai.assert,
    expect         = chai.expect,
    uri            = "http://localhost:3000/api/v1/signup",
    token,
    data,
    socket;

    // Use Promises with Chai
    chai.use(chaiAsPromised);
    chai.should();

var user = { 
    id: `test-${Math.random().toString(36).substring(10)}`,
    password: `test-${Math.random().toString(36).substring(7)}`,
    email: `test-${Math.random().toString(36).substring(7)}@test.com`
}

var options = {
    method: 'POST',
    uri: uri,
    body: user,
    json: true 
}

beforeEach(() => {
    data = null;
})

before(() => {
    // var child = child_process.spawn('node', ['server'], {
    //     cwd: '../'
    // });
});

after('Clean up and Exit API Node Instance', () => {
    // user = { 
    //  id: `test-${Math.random().toString(36).substring(10)}`,
    //  password: `test-${Math.random().toString(36).substring(7)}`,
    //  email: `test-${Math.random().toString(36).substring(7)}@test.com`
    // }
});

// Create User
describe('Create User', function() {
  it('respond with JSON Web Token', function() {

    return rp(options)

    .then((results) => {
        expect(results).to.have.property('token');
        token = results.token;
    });

  });
});

// Connect, Authenticate
describe('Connect to API with Token', function() {

    it('Resolves Server API URI', function() {
        
       socket = io.connect(uri, {
            'query': 'token=' + token.token
        });
    
        socket.on('connect', function () {
            return true;
        });

    });

});

describe('API is communicating', function() {
    it('send back payloads', function() {
        socket.on('event', function(data){
            data = data;
            return data;
        });
    });
});

// Get User via API
describe('Get a User profile', function() {
  
    it('Send API command', function() {
        socket.emit('api', {model: 'messages', method: 'get', offset: 0});
    });

    it('Received User Profile', function() {
        
        expect(data).to.be.an('array')
        

    });

});


