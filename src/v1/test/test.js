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
 * Test Suite
 */


/*
 * Creates New Random User
 */

userObject = { id: `test-${Math.random().toString(36).substring(10)}`,
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
    })

}

/*
 * Test Suite
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
           return lookUpUserSuite(token.token);
        })

        .catch(done);

    });
});

/*
 * Test Suite
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

function lookUpUserSuite(token, done) {
    describe("Looks up User", function () {

        it("Found User", (done) => {

            return lookUpUser(token)
            
            .then((results) => {
                results.should.have.property('id').and.equal(userObject.id);
                done();
            })

            .catch(done);

        });
    });
}






// var models         = require('../models'),
//     config         = require('../config.json'),
//     db             = require('../controllers/db'),
//     io             = require('socket.io-client'),
//     rp             = require('request-promise'),
//     child_process  = require('child_process'),
//     chai           = require('chai'),
//     chaiAsPromised = require("chai-as-promised"),
//     Promise        = require('bluebird'),
//     assert         = chai.assert,
//     expect         = chai.expect,
//     uri            = "http://localhost:3000/api/v1/signup",
//     token,
//     data,
//     socket;

//     // Use Promises with Chai
//     chai.use(chaiAsPromised);
//     chai.should();

// var user = { 
//     id: `test-${Math.random().toString(36).substring(10)}`,
//     password: `test-${Math.random().toString(36).substring(7)}`,
//     email: `test-${Math.random().toString(36).substring(7)}@test.com`
// }

// var options = {
//     method: 'POST',
//     uri: uri,
//     body: user,
//     json: true 
// }

// beforeEach(() => {
//     setTimeout(function(){
//       foo = true;
//     }, 150);
// })

// before(() => {
//     // var child = child_process.spawn('node', ['server'], {
//     //     cwd: '../'
//     // });
// });

// after('Clean up and Exit API Node Instance', () => {
//     // user = { 
//     //  id: `test-${Math.random().toString(36).substring(10)}`,
//     //  password: `test-${Math.random().toString(36).substring(7)}`,
//     //  email: `test-${Math.random().toString(36).substring(7)}@test.com`
//     // }
// });

// // Create User
// describe('Create User', function() {
//   it('respond with JSON Web Token', function() {

//     return rp(options)

//     .then((results) => {
//         expect(results).to.have.property('token');
//         token = results.token;
//     });

//   });
// });

// // Connect, Authenticate
// describe('Connect to API with Token', function() {

//     it('Resolves Server API URI', function() {
        
//        socket = io.connect(uri, {
//             'query': 'token=' + token.token
//         });
    
//         socket.on('connect', function () {
//             return true;
//         });

//     });

// });

// describe('API is communicating', function() {
//     it('send back payloads', function() {
//         socket.on('event', function(data){
//             data = data;
//             return data;
//             wrapp();
//         });
//     });
// });


// // Get User via API
// describe('Get a User profile', function() {
  
//     it('Send API command', function() {
//         socket.emit('api', {model: 'messages', method: 'get', offset: 0});
//     });

// });

// describe('Get a User profile', function() {
//     it('Received User Profile', function() {   
//         socket.on('event', function(data){
//           console.log(data);
//            expect(data).to.be.an('object')
//         }); 
        
//     });
// });


