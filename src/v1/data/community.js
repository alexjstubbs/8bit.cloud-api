/* Community API Init
-------------------------------------------------- */

var  mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   ObjectId = Schema.ObjectId
,   models = require('./models')(mongoose);

var init = function(mongoose) {

    // Remove all old community docs
    models.Community.find({ }).remove( function(err) {
        if (err) return console.error(err);
    });
    
    // Store new/only community doc
    var newCommunity = new models.Community({
    
      title     : "Together Retro"
    , subtitle  : "Racketboy"
    , URL       : "http://www.racketboy.com"
    , RSS       : "http://www.rackerboy.com?rss2"
    , Image     : "http://www.racketboy.com/images/tr-lost-vikings.png"
    , Styles    : {width: "90%", height: "90%", position: "relative", left: "21px"}
    , Local     : false
    
    });

    newCommunity.save(function(err, newCommunity) {
      if (err) return console.error(err);
      console.dir(newCommunity);
    });

}

exports.init = init;