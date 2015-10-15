/* Jwt Functions
-------------------------------------------------- */
var jwt 	= require('jsonwebtoken'),
	config  = require('./config.json');


module.exports.issueToken = function(payload) {
  var token = jwt.sign(payload, config.secret);
  return token;
};

module.exports.verifyToken = function(token, verified) {
  return jwt.verify(token, config.secret, {}, verified);
};
