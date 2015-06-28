// app/models/user.js
// load the things we need
"use strict";
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local            : {
        email        : String,
		token		 : String,
        password     : String,
		alias		 : String,
		group		 : String, //user-admin, user-exec, user-manager, user-member
		firstname	 : String,
		lastname	 : String,
		department	 : String,
		location	 : { type: String, default: "Headquarters" },
		dateEnrolled : Date
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
		alias		 : String,
		group		 : String, //user-admin, user-manager, user-member
		firstname	 : String,
		lastname	 : String,
		department	 : String,
		location	 : String, 		
		dateEnrolled : Date 
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String,
		alias		 : String,
		group		 : String, //user-admin, user-manager, user-member	
		firstname	 : String,
		lastname	 : String,
		department	 : String,
		location 	 : String,
		dateEnrolled : Date
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
		alias		 : String,
		group		 : String, //user-admin, user-manager, user-member
		firstname	 : String,
		lastname	 : String,
		department	 : String,
		location 	 : String,
		dateEnrolled : Date
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// checking if password is valid
userSchema.methods.validCompanyAlias= function(alias) {
	if(alias == this.local.alias)
		return true;
	else return false; //    return compareSync();
};

//====================================================
// Role-based authorization  - NOT sure it goes here, but the general methods should look like this 6/22/2014
/*
module.exports() = function(app) {
function loadUser(req, res, next) {
  // You would fetch your user from the db
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

function andRestrictToSelf(req, res, next) {
  // If our authenticated user is the user we are viewing
  // then everything is fine :)
  if (req.authenticatedUser.id == req.user.id) {
    next();
  } else {
    // You may want to implement specific exceptions
    // such as UnauthorizedError or similar so that you
    // can handle these can be special-cased in an error handler
    // (view ./examples/pages for this)
    next(new Error('Unauthorized'));
  }
}

function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.authenticatedUser.role == role) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  }
}

// Middleware for faux authentication
// you would of course implement something real,
// but this illustrates how an authenticated user
// may interact with middleware

app.use(function(req, res, next){
  req.authenticatedUser = users[0];
  next();
});

app.get('/', function(req, res){
  res.redirect('/user/0');
});

app.get('/user/:id', loadUser, function(req, res){
  res.send('Viewing user ' + req.user.name);
});

app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res){
  res.send('Editing user ' + req.user.name);
});

app.delete('/user/:id', loadUser, andRestrictTo('admin'), function(req, res){
  res.send('Deleted user ' + req.user.name);
});

*/
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

