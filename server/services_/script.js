//var angular = require("angular");
// create the module called shrewdApp
    var shrewdApp = angular.module('shrewdApp', ['ngRoute']);

    // configure our routes
    shrewdApp.config(function($routeProvider) {
        $routeProvider
            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'shrewdController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : './views/pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : './views/pages/contact.html',
                controller  : 'contactController'
            });
			// route for the profile page
            .when('/profile', {
                templateUrl : './views/pages/profile.ejs',
                controller  : 'profileController'
            });
    });

    // create the controller and inject Angular's $scope
    shrewdApp.controller('shrewdController', function($scope) {
        // create a message to display in our view
        $scope.message = 'shrewdController!';
    });

    shrewdApp.controller('aboutController', function($scope) {
        $scope.message = 'An about page.';
    });

    shrewdApp.controller('contactController', function($scope) {
        $scope.message = ' ';
    });
	
	shrewdApp.controller('profileController', function($scope) {
        $scope.message = ' Profile Controller. Hello {{user.local.email}} ';
    });