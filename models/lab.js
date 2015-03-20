// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

var classifications = "itap cs ecn tech".split(" ");

// define the schema for our user model
var labSchema = mongoose.Schema({
  name: String,
  building: String,
  room: String,

  classification : { type: String, enum: classifications },
  computers : [
    {
      os: String,
      description : String,
      total : Number,
      available: Number
    }
  ],
  printers : [
    {
      name: String, //color, bw
      total : Number
    }
  ],
  scanners : [
    {
      name: String,
      total: Number,
      available: Number
    }
  ],

  limitations : String, //Open only to...
  schedule : {
    link : String
  }
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Lab', labSchema);
