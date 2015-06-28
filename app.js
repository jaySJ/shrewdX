// server.js
'use strict';
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');
var path = require('path');

var configDB = require('./server/config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./server/config/passport')(passport); // pass passport for configuration

app.configure(function () {
	// set up our express application
	// log
	// serve static files
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.logger('dev')); // log every request to the console

	app.use(express.cookieParser('keyboard cat')); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.disable("x-powered-by"); //SECURITY PRECAUTION: X-Powered-By header in HTTP response header has no functional value. It can be removed safely. 

	app.set('view engine', 'ejs'); // set up ejs for templating
	//CSRF configuration - cross-site request forgery
//	app.use(express.csrf()); // SECURITY PRECAUTION: enable CSRF protection - 
	
	// set views for error and 404 pages
	app.set('views',  path.join(__dirname , '/public/views'));
	app.set('partials', path.join(__dirname + '/public/views/partials'));
	app.use(express.methodOverride());   // have the ability to simulate DELETE and PUT
    app.use(express.favicon(__dirname +'/favicon.ico'));
	
/*	app.use(app.router);*/

	// required for passport
	app.use(express.session(
		{ secret: 'shrewdsessionssecret',  key: "sessionId"
		})
	); // session secret; SECURITY PRECAUTION: using generic cookie name 
	//end CSRF 
																			//("sessionId") instead of using default names which can give away the app server/framework. 
	// passport  js - persistent login sessions
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(app.router);

});
// routes ======================================================================
var routes = require('./server/app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

