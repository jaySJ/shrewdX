// routes/index.js
"use strict";
// load up the user model
var User       		= require('../models/user');
var Organization			= require('../models/organization');

module.exports = function(app, passport) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('startup.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	// app.post('/signup', do all our passport stuff here);

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
/*	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile-new.ejs', {
			currUser : req.user // get the user out of session and pass to template
		});
	});
*/
	// =====================================
	// GALILEO SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/galileo', isLoggedIn, function(req, res) {
		Organization.findOne({ 'alias_name' :  req.user.local.alias }, function(err, org) {
			res.render('index.ejs', {
				currUser : req.user, // get the user out of session and pass to template
				currOrg  : org
			});
		});
	});
	
	app.get('/galileo/account', isLoggedIn, function(req, res) {
		res.send( {user : req.user} );// get the user out of session and pass to template
	});
	
	app.get('/galileo/org/profile', isLoggedIn, function(req, res) {
	//	res.send( {orgprofile : req.org} );// get the user out of session and pass to template
		// TODO: this might be inefficient since you are querying the database everytime, instead of storing in the session or caching
		Organization.findOne({ 'alias_name' :  req.user.local.alias }, function(err, org) {
			res.send( {orgprofile : org} );// get the user out of session and pass to template
			if (err){
				res.send(err);
			}
		});//*/
	});
	app.post('/galileo/org/profile', isLoggedIn, function(req, res){
		//input validation
		if(req.body === null || req.body.alias_name === null || req.body.company_strength === null || req.body.alias_name === ""  
			|| req.body.company_strength === "" || req.body.company_strength <5 || req.body.company_strength > 1000000 
			|| req.body.likely_response_rate <1 || req.body.desired_confidence< 50 || isNaN(req.body.company_strength) ==true 
			|| isNaN(req.body.likely_response_rate) ==true || isNaN(req.body.desired_confidence) ==true)
		{
			//input validation failed
			return;
		}
		else {
		// input validated; POST data to database
			Organization.findOne({ 'alias_name' :  req.user.local.alias }, function(err, org) {
					org.alias_name = req.body.alias_name;
					org.company_strength = req.body.company_strength;
					org.likely_response_rate = req.body.likely_response_rate;
					org.desired_confidence = req.body.desired_confidence;
					org.save(function (err, result) {
						if (err)
							res.send(err); 
				  //      res.redirect('/galileo/admin/profile');
					});
			});
		}
	});	
	app.post('/galileo/account/profile', isLoggedIn, function(req, res) {
	//input validation
		if(req.body === null || req.body.firstname == null || req.body.firstname==="" 
		|| req.body.lastname==null || req.body.lastname==="" || req.body.department ==null 
		|| req.body.department =="" || req.body.location==null || req.body.location ==="")
		{
			//input validation failed
			return;
		}
	//	res.send( {user : req.user} );// get the user out of session and pass to template
		User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
				user.local.firstname = req.body.firstname;
				user.local.lastname = req.body.lastname;
				user.local.department = req.body.department;
				user.local.location = req.body.location;
				user.save(function (err, result) {
					if (err)
						res.send(err); 
              //      res.redirect('/galileo/admin/profile');
                });
		});
	});
	app.post('/galileo/account/pwd/', isLoggedIn, function(req, res) {
	
	if(req.body === null || req.body.password==null || req.body.password=="" || !validEmail(req.body.email) )
		{
			//input validation failed
			return;
		}
	//	res.send( {user : req.user} );// get the user out of session and pass to template
		User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
				user.local.password = user.generateHash(req.body.password);
				user.save(function (err, result) {
					if (err)
						res.send(err);
              //      res.redirect('/galileo/admin/profile');
                });
				// if there are any errors, return the error		
		});
	});
	
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});	
	//gets all member's data // DANGER: Currently all passwords are part of the members JSON - need to remove password to a different table with key-value of username-password
	app.get('/api/members', isLoggedIn, andRestrictTo('site-admin','user-admin'), function (req, res) {
		User.find(function (err, members) {
			if (err)
				res.send(err);
			res.json(members);
		});
	});
	//get member data for current organization
	app.get('/api/org/:alias/members/', isLoggedIn, andRestrictTo('site-admin','user-admin'), function (req, res) {
		if(req.user.local.alias ===req.params.alias)
		{
			User.find({ 'local.alias' :  req.params.alias }, function(err, members) {
				if (err)
					res.send(err);
				res.json(members);
			});
		}
			else res.send(err);
	});
	//get member data for current organization
	app.get('/api/org/:alias/departments/', isLoggedIn, andRestrictTo('site-admin','user-admin'), function (req, res) {
		if(req.user.local.alias ===req.params.alias)
		{
		
			var o = {};
			o.map = function () { emit( { department: this.local.department,
										  location:this.local.location},
										{exists:1}) 
								};
			o.reduce = function (k, vals) { return vals.length }
			User.mapReduce(o, function (err, departments) {
					if (err)
						res.send(err);
					res.json(departments);
					//console.log(departments);
			});		
		/*	User.distinct('local.department', 'local.location', function(err, members){
				if (err)
					res.send(err);
				res.json(members);
			});*/
		}
		else res.send(err);
	});
	// create members and send back all users after creation
	app.post('/api/members', isLoggedIn, andRestrictTo('site-admin','user-admin'), function(req, res, done) {
			if(!validEmail(req.body.email)){
				res.send(req.flash('signupMessage', 'Please enter a valid email address.'));
			}
			if(!validateRole (req.body.user_group))
				res.send(req.flash('signupMessage', 'Sorry we do not recognize the requested role. Please contact sales@shrewdhr.com to gain access.'));
			
		// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to signup already exists
			User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err);

				// check to see if theres already a user with that email
				if (user) {
				//	return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
					res.send(req.flash('signupMessage', 'That email is already taken.'));
					res.redirect('/galileo');
				} else {
					// if there is no user with that email
					//check limit
					// create the user
					// create a user, information comes from AJAX request from Angular
					var newUser = new User();
					User.create( { local :{
						email : req.body.email,
						alias : req.user.local.alias,
						password : newUser.generateHash(req.body.password),
						group : req.body.user_group,	
						department : req.body.department,
						location : req.body.location,
						dateEnrolled :  new Date(),
						done : false
					}}, function(err, user) {
						res.redirect('/galileo');
					});
				}
		});
	});
	
	app.delete('/api/members/email/:email', isLoggedIn, andRestrictTo('site-admin','user-admin'), function(req, res, done)
	{
		User.findOne({ 'local.email' :  req.params.email }, function(err, user) {
		// if there are any errors, return the error
			if (err)
				return done(err);
			// check to see if theres already a user with that email
			if (user) {
				//don't delete someone from other customers, don't delete yourself
				if( req.user.local.alias === user.local.alias  && req.user.local.email !== user.local.emails )
				{
					// check to see if theres already a user with that email
						User.remove({ 'local.email' :  req.params.email }, function(err, user) {
							// if there are any errors, return the error
							if (err) // deletion failed - couldn't find email
								return done(err);
							//deleted successfully
						//	res.redirect('/galileo');
						});
				}
			}
		});
		res.redirect('/galileo');
	});
	
	app.delete('/api/members/:id', isLoggedIn, andRestrictTo('site-admin','user-admin'), function(req, res, done)
	{
		//	console.log('about to remove');
			User.remove({ '_id' :  req.params.id }, function(err, user) {
				// if there are any errors, return the error
				if (err) // deletion failed - couldn't find email
					return done(err);
				//deleted successfully
			});
	});

	app.get('/api/departments', isLoggedIn, function (req, res) {
		User.find(function (err, departments) {
			if (err)
				res.send(err); 
			res.json(departments);
		});
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/galileo', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/galileo', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	// Organization profile ===============================
	// =====================================
	// show the login form
	app.get('/orgprofile', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('orgprofile.ejs', { message: req.flash('loginMessage') }); 
	});
	
	app.get('/partials/:name', function(req, res){
		var name = req.params.name;
		res.render('partials/' + name, {
			currUser : req.user, // get the user out of session and pass to template
			currMessage : req.message
		});
	});
	//  Handle Errors gracefully
	app.use(function(err, req, res, next) {
		if(!err) return next();
		console.log(err.stack);
		res.json({error: true});
	});
	app.get('/user/:id/resetpassword', loadUser, andRestrictToSelfOr('admin'), function(req, res){
		res.send('Only viewable for admin and the user himself'); 
	});
  /*  app.get('*', function (req, res) {
        res.sendFile('public/views/index.html');
    });*/
};

exports.partials = function(req, res){
  var filename = req.params.filename;
  if(!filename) return;  // might want to change this
  res.render("partials/" + filename );
};

exports.index = function(req, res){
  res.render('index');
};
 
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}

//added myself from other places
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

function andRestrictToSelfOr(role) {
  return function(req, res, next) {
    if ((req.authenticatedUser.id == req.user.id) || (req.authenticatedUser.role == role)) {       
      next();     
    } else {
      next(new Error('Unauthorized'));     
    }
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

function andRestrictTo(role1, role2) {
  return function(req, res, next) {
    if (req.user.local.group === role1 || req.user.local.group === role2) {
      next();
    } else {
	  console.log("current user's role:" + req.user.local.group);
   //   next(new Error('User is not authorized to view this table'));
    }
  }
}

//TODO: FOLLOWING TWO Functions (validateRole() && ValidateEmail()) are replicated in passport.js. Need to be moved elsewhere
function validateRole(group_role) {
   if(group_role === "user-admin" || group_role ==="user-exec" || group_role ==="user-manager"|| group_role ==="user-member")
	return true;
   else return false;
}

function validEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*
//See more at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
$httpProvider.responseInterceptors.push(function($q, $location) 
	{ 
		return function(promise) 
			{ return promise.then( // Success: just return the response 
				function(response){ return response; }, 
				// Error: check the error status to get only the 401 
				function(response) { if (response.status === 401) 
					$location.url('/login'); 
					return $q.reject(response); 
				} ); 
			} 
	});

//See more at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
{ // Initialize a new promise 
	var deferred = $q.defer(); // Make an AJAX call to check if the user is logged in 
	$http.get('/loggedin').success(function(user){ 
		// Authenticated 
		if (user !== '0') $timeout(deferred.resolve, 0); // Not Authenticated 
		else { 
					$rootScope.message = 'You need to log in.'; 
					$timeout(function(){deferred.reject();}, 0); 
					$location.url('/login'); 
			}
	});
}
	
	/* ************* Example usage  *******************
	$routeProvider .when('/', { 
		templateUrl: '/views/main.html' }) 
		.when('/admin', { templateUrl: 'views/admin.html', controller: 'AdminCtrl', resolve: { loggedin: checkLoggedin } }) 
		.when('/login', { templateUrl: 'views/login.html', controller: 'LoginCtrl' }) 
		.otherwise({ redirectTo: '/' });
	*/