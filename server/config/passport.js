// config/passport.js
/*jslint node: true */
'use strict';
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../models/user');
var Subscriptions   = require('../models/subscriptions');
// expose this function to our app using module.exports
module.exports = function(passport) {

  //=========================================================================
  //passport session setup ==================================================
  //=========================================================================
  //required for persistent login sessions
  //passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	//=========================================================================
    //LOCAL SIGNUP ============================================================
    //=========================================================================
    //we are using named strategies since we have one for login and one for signup
	//by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
		lastnameField : 'lastname',
		firstnameField : 'firstname',
        passwordField : 'password',
		aliasField : 'alias',
		groupField: 'user_group',
		departmentField: 'department',
		locationField: 'location',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne won't fire unless data is sent back
        process.nextTick(function() {
			if(validateEmail(email) === false){
				return done(null, false, req.flash('signupMessage', 'Please enter a valid email address.'));
			}
			if(!validateRole(req.body.user_group))
				return done(null, false, req.flash('signupMessage', 'Sorry we do not recognize the requested role. Please contact sales@shrewdhr.com to gain access.'));
			
			Subscriptions.findOne({'alias_name' : req.body.alias}, function (err, org) {
				if(err)
					return done(null, false, req.flash('signupMessage', 'Sorry we cannot find your subscription. Please contact sales@shrewdhr.com to gain access.'));
					if(!org)
					{
						return done(null, false, req.flash('signupMessage', 'Sorry we cannot find your subscription. Please contact sales@shrewdhr.com to gain access.'));					
					}
				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to signup already exists
				User.findOne({ 'local.email' :  email }, function(err, user) {
					// if there are any errors, return the error
					if (err)
						return done(err);

					// check to see if theres already a user with that email
					if (user) {
						return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
					}
                    else
                    {
						// if there is no user with that email
						// create the user
						var newUser = new User();

						// set the user's local credentials
						newUser.local.firstname  = req.body.firstname;
						newUser.local.lastname   = req.body.lastname;
						newUser.local.email    = email;
				        newUser.local.password = newUser.generateHash(password);
						newUser.local.alias = req.body.alias;
						newUser.local.group = req.body.user_group;
						newUser.local.location = req.body.location;
						newUser.local.department = req.body.department;
						newUser.local.dateEnrolled = new Date();

						// save the user
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			});
        });
    }));
	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
		aliasField : 'alias',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user1) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user1)   // req.flash is the way to set flashdata using connect-flash
                return done(null, false, req.flash('loginMessage', 'No such user found.'));
			
			if (!user1.validCompanyAlias( req.body.alias)) // req.flash is the way to set flashdata using connect-flash
				return done(null, false, req.flash('loginMessage', 'This email is not associated with this company name. Please provide correct details.')); 
		
            if (!user1.validPassword(password))// if the user is found but the password is wrong
                return done(null, false, req.flash('loginMessage', 'Sorry! The login, password and alias do not match.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user1);
        });
    }));
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 
function validateRole(group_role) {
   if(group_role === "user-admin" || group_role ==="user-exec" || group_role ==="user-manager"|| group_role ==="user-member")
    return true;
	else return false;
}