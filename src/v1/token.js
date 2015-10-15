/* Jwt Functions
-------------------------------------------------- */
var jwt = require('jsonwebtoken');

module.exports.issueToken = function(payload) {
  var token = jwt.sign(payload, "digdug");
  return token;
};

module.exports.verifyToken = function(token, verified) {
  return jwt.verify(token, "digdug", {}, verified);
};
