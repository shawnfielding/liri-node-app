var command = process.argv[2];
var entertainment = process.argv[3];


var tKeys = require("./keys.js");
var Twitter = require("twitter");
var theKeys = tKeys.twitterKeys;

var spotify = require("spotify");


var request = require('request');
var fs = require('fs');


switch (command) {
  case 'my-tweets':
    myTweets();
    break;
  case 'spotify-this-song':
    spotifyThisSong();
    break;
  case 'movie-this':
    movieThis();
    break;
  case 'do-what-it-says':
    doWhatItSays();
    break;

}
//Make the twitter object that passes in the oauth and query.
//Retrieve the tweets object (an array).
//loop through the array and pull out the tweet and the date/time and log it.
function myTweets() {
  if (entertainment) {
    console.log("WHOOPS! You added a something that should not be there.  Fix that crap and get back to me.")
    return
  }
  var client = new Twitter({
    consumer_key: theKeys.consumer_key,
    consumer_secret: theKeys.consumer_secret,
    access_token_key: theKeys.access_token_key,
    access_token_secret: theKeys.access_token_secret
  });
  var tweets = client.get('statuses/user_timeline', {
    user_id: '796805766564954113',
    count: 20,
  }, function(error, tweets,
    response) {
    if (error) {
      console.error('error: ', error);

    } else {
      tweets.forEach(function(element) {
        console.log("Date: " + JSON.stringify(element["created_at"]) + " Tweet: " + JSON.stringify(element[
          "text"]));
      });
    }
  });
}


function spotifyThisSong() {
  var querySong = entertainment ? entertainment : "The Sign";
  var theSong = {};
  spotify.search({
    type: 'track',
    query: querySong
  }, function(error, data) {
    if (error) {
      console.error('error: ', error);
    } else {
      matches = []
      theSongs = data.tracks.items;
      for (var i = 0; i < theSongs.length; i++) {
        if (JSON.stringify(theSongs[i].name) == JSON.stringify(querySong)) {
          matches.push(theSongs[i]);
        }
      }
      console.log(matches.length);
    }
  });
}

// theSong.name = JSON.stringify(data.tracks.items[0].name);
// theSong.album = JSON.stringify(data.tracks.items[0].album.name);
// theSong.artist = JSON.stringify(data.tracks.items[0].artists[0].name);
// theSong.songPreview = JSON.stringify(data.tracks.items[0].preview_url);
// console.log(JSON.stringify(theSong));



function movieThis() {};

function doWhatItSays() {};
