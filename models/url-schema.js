//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const urlSchema = mongoose.Schema({
  original_url: String,
  short_url: String
});

//Export function to create 'url' model class
module.exports = mongoose.model('url', urlSchema )

