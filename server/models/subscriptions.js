// app/models/user.js
// load the things we need
"use strict";
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var subscriptionsSchema = mongoose.Schema({
 
	alias_name: String, 
	subscription: { type: Number, default: 5, min:1, max: 5 },  // 1 .. 5
	users_limit: { type: Number, default: 25, min:5 }, //limit for number of users
	primary_contact: String, //email 
	feature_level: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Subscriptions', subscriptionsSchema);

