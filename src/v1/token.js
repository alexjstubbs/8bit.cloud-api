/*
 * JSON Web Tokens
 */

var jwt     = require('jsonwebtoken'),
    Promise = require('bluebird'),
    config  = require('./config.json');

/*
 * issueToken
 * 
 * description: Issues a JSON Web Token via Secret Key
 *
 * @param: payload  : JSON Object Payload (object) 
 * 
 */

exports.issueToken = (payload) => {
    return new Promise((resolve, reject) => {
        var token = jwt.sign(payload, config.secret);
        resolve(token);
    });
};

/*
 * verifyToken
 * 
 * description: Verifies the JSON Web Token
 *
 * @param: token    : JSON web token input (string) 
 * @param: verified :                      (string) 
 * 
 */

exports.verifyToken = (token, verified) => {
    return new Promise((resolve, reject) => {
        resolve(jwt.verify(token, config.secret, {}, verified));
    });
};
