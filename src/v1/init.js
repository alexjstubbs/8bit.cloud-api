/* Init Functions
-------------------------------------------------- */
var  mongoose = require('mongoose')
,   Schema = mongoose.Schema
,   ObjectId = Schema.ObjectId
,   _ = require('lodash')
,   FeedParser = require('feedparser')
,   request = require('request')
,   timestamp = '[' + new Date().toUTCString() + '] '
,   cheerio = require('cheerio');

module.exports = function(models) {


/* Community
-------------------------------------------------- */

function communityInit(models) {

    var retro = [];

    // Get Racketboys Feed

    var req = request('http://www.racketboy.com/together-retro/feed')
      , feedparser = new FeedParser();

      req.on('response', function (res) {

      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser);

    });

    feedparser.on('error', function(error) {
        console.log(timestamp, error)
    });


    feedparser.on('readable', function() {
      // This is where the action is!
      var stream = this
        , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        , item;

      while (item = stream.read()) {
        retro.push(item)
      }
    });


    feedparser.on('end', function(error) {

    $ = cheerio.load(retro[0].description);

    // Store new/only community doc
    var newCommunity = new models.Community({

          title        : retro[0].title
        , subtitle     : "Racketboy"
        , description  : retro[0].description
        , URL          : $('a[href*=viewtopic]').attr("href")
        , RSS          : retro[0].xmlurl
        , Image        : $("img:first-child").attr("src")
        , Styles       : {width: "90%", height: "90%", position: "relative", left: "21px"}
        , Local        : false

    });

    newCommunity.save(function(err, newCommunity) {
      if (err) return console.error(err);
      console.log(timestamp, "init: Community");
    });


    });


}


/* Events
-------------------------------------------------- */

function eventsInit(models) {

    // var newEvent = new models.Events ({
    //
    //       Type      : "Update"
    //     , Append    : "v2.0"
    //     , Git       : "https://github.com/alexjstubbs/ignition.git"
    //     , Hash      : "398fab7a388849569b2fc6e3d23307996a6fb862"
    //
    // });
    //
    //
    // newEvent.save(function(err, newEvent) {
    //   if (err) return console.error(err);
    //   console.log(timestamp, "init: Events");
    // });


}


var init = {
    Community  : communityInit(models),
    Events  : eventsInit(models),
};

    return init;
}
