// There are a few prettifies that do some strange stuff.  Not sure why.  I'd correct, but I don't have time.

var command = process.argv[2];
var theInput = process.argv;
theInput.splice(0, 3);

var tKeys = require("./keys.js");
var Twitter = require("twitter");
var theKeys = tKeys.twitterKeys;

var spotify = require("spotify");
var inquirer = require("inquirer");
var request = require('request');
var fs = require('fs');
var exec = require('child_process').exec;

var cmd = 'prince -v builds/pdf/book.html -o builds/pdf/book.pdf';

exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
});

switch (command) {
  case 'my-tweets':
    myTweets();
    break;
  case 'spotify-this-song':
    var entertainment = theInput.join(" ");
    spotifyThisSong();
    break;
  case 'movie-this':
    var entertainment = theInput.join("_");
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
  if (!entertainment) {
    console.log("WHOOPS! You added a something that should not be there.  Fix that crap and get back to me.");
    return;
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
      console.log("Here are my tweets:");
      tweets.forEach(function(element) {
        console.log("Date: " + JSON.stringify(element.created_at) + " Tweet: " + JSON.stringify(element.text));
      });
    }
  });
}

//Have the spotify object search, find results and return them.  Only top 20.
function spotifyThisSong() {
  var querySong = entertainment ? entertainment : "The Sign";
  querySong = querySong.toUpperCase();
  spotify.search({
    type: 'track',
    query: querySong,
  }, function(error, data) {
    if (error) {
      console.error('error: ', error);
      return;
    } else {
      matches = [];
      theSongs = data.tracks.items;
      for (var i = 0; i < theSongs.length; i++) {
        if (((JSON.stringify(theSongs[i].name)).toUpperCase()) === ((JSON.stringify(querySong)).toUpperCase())) {
          matches.push(theSongs[i]);
        }
      }
      if (matches.length > 0) {
        console.log("I found " + matches.length + " possible match" + (matches.length === 1 ? " " : "es ") +
          "based on what you gave me in the first 20 hits.");
        for (var j = 0; j < matches.length; j++) {
          console.log("----------------------------------------------------------------");
          console.log("Song: " + matches[j].name);
          console.log("Album: " + matches[j].album.name);
          console.log("Artist: " + matches[j].artists[0].name);
          console.log("Preview: " + matches[j].preview_url);
        }
      } else {
        console.log("Sorry, I couldn't find any hits for you.  Did you type it in correctly?");
      }
    }
  });
}

// Use the request object to get the movie information.  Parse the right parts.
function movieThis() {
  var queryMovie = entertainment ? entertainment : "Mr. Nobody";
  queryMovie = queryMovie.replace(/ /gi, "_");
  theRequest = request.get("http://www.omdbapi.com/?t=" + queryMovie, function(error, response, body) {
    if (error) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      return;
    } else {
      var theBody = JSON.parse(body);
      console.log("I found a possible match based on what you gave me.");
      console.log("----------------------------------------------------------------");
      console.log("Movie Title: " + theBody.Title);
      console.log("Year Released: " + theBody.Year);
      console.log("IMDB Rating: " + theBody.imdbRating);
      console.log("Country of Origin: " + theBody.Country);
      console.log("Language: " + theBody.Language);
      console.log("Plot: " + theBody.Plot);
      console.log("Actors: " + theBody.Actors);
      console.log("Rotten Tomatoes Rating: " + theBody.Ratings[1].Value);
      console.log(encodeURI(theBody.Title));
      console.log((theBody.Title).replace(/ /gi, "_"));
      console.log("Rotten Tomatoes URL: https://www.rottentomatoes.com/search/?search=" + escape(theBody.Title));
    }
  });
}


function doWhatItSays() {
  fs.readFile('./random.txt', function(error, data) {
    if (error) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      return;
    } else {
      var theContent = data.toString().split(",");
      console.log(theContent)

      function goForIt() {
        var theC = 'node liri.js ' + theContent[0] + ' ' + theContent[1];
        console.log(theC);
        exec(theC, function(error, status, data) {
          if (error) {
            console.error('error: ', error);
            console.log('error: ', status);
            return;
          }
        });
      }
      console.log(goForIt());
    }
  });
}
