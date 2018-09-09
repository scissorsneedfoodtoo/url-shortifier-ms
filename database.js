// 'use strict'

const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

// connect to mLab url-data db
mongoose.connect(MONGODB_URI, { useMongoClient: true }) // { useMongoClient: true } arg to prevent error msg from polluting the console

// open connection through mongoose
let db = mongoose.connection

// check for errors
db.on('error', console.error.bind(console, 'connection error:'));

// successful connection
db.on('open', function() {
  console.log('Connected and listening to port ' + process.env.PORT)
});

// export
module.exports = db
