// server.js
// where your node app starts

// init project
const express = require('express')
const mongoose = require('mongoose')
const shortid = require('shortid')
const request = require('request')
let app = express();
let db = require('./database').sync
let URL = require('./models/url-schema')


let saveURL = function(longURL, shortURL) {
  let newURL = new URL({original_url: longURL, short_url: shortURL})
  
  return newURL.save(function (err, newURL) {
    if (err) return console.error(err)
    newURL
  })
}

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public')); // -- original

app.set('view engine','pug');

// http://expressjs.com/en/starter/basic-routing.html
app.get('/',function(req, res){
  res.render('index');
});

// user enters sequence that is not a url
app.get('/:seq', function(req, res) {
  const seq = req.params.seq
  let longURL
  let shortURL
  
  if (shortid.isValid(seq)) { // user enters shortid
    URL.findOne({ short_url: seq}, function(err, entry) {
      if (err) {
        return console.error(err)
      }

      // redirect if shortid url is found
      if (entry) {
        longURL = entry.original_url
        return res.redirect(longURL)
      }

      //no match found -- in the off chance it's a valid shortid but not yet in db
      return res.json({error: 'The short URL ' + seq + ' does not exist in our database.'})
    })
  } else { // invalid long or short url
    
    return res.json({error: 'URL Invalid'})
  }
})

// user enters url
app.get('/*' ,function(req, res) {
  var urlParam = req.params[0]
  let shortURL
  
  // check url and pipe to either invalid or valid url functions -- was the easiest way to handle this async problem
  request(urlParam, function(err, res) {
    if (err) {
      return invalidURL()
    } else if (!err && res.statusCode === 200) {
      return validURL()
    }
  })
  
  function invalidURL() {
    return res.json({error: 'URL Invalid'})
  } // end invalidURL
  
  function validURL() {
    // search db for entry while also stripping the id, but still shows version key
    URL.findOne({ original_url: urlParam }, { _id: 0 }, function(err, entry) {
      if (err) {
        return console.error(err)
      }
      
      if (entry) {
        return res.json(entry)
      } else { // if no entry found
        shortURL = shortid.generate()
        saveURL(urlParam, shortURL)
        return res.json({original_url: urlParam, short_url: shortURL})
      }
    }) // end URL.findOne
  } // end validURL
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  // console.log('Your app is listening on port ' + listener.address().port);
});
