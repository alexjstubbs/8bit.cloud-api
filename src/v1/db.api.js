/* Section
-------------------------------------------------- */

var newUser = function(userObj, callback) {

  var newUser = new __models.User(userObj);

    newUser.save(function(err, newUser) {

      if (err) {
        callback(err);
        return console.error(err);
      }

      else {      
        console.log("New User: "+newUser);
        callback(newUser);
      }

    });

}

/* Exports
-------------------------------------------------- */
exports.newUser =  newUser;