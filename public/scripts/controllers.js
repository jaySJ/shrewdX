// /public/scripts/controllers.js
(function( ng, app ) {
	'use strict';
// configure app routes
app.
    config(function($routeProvider, $locationProvider) {
		$routeProvider           
			.when('/Galileo/manage/profile', 
            {
                templateUrl: '/partials/profile-update.ejs', 
                controller: 'profileController'
            })
			.when('/Galileo/manage/pwd', 
            {
                templateUrl: '/partials/pwd-update.ejs', 
                controller: 'profileController'
            })
			.when('/Galileo/manage/org/networx', {
				templateUrl: '/partials/organization-view.ejs',
				controller: 'orgController'
			})
			.when('/Galileo/manage/org/update', {
				templateUrl: '/partials/organization-update.ejs',
				controller: 'orgController'
			})
			.when('/Galileo/manage/dept/update', {
				templateUrl: '/partials/department-view.ejs',
				controller: 'orgController'
			})
			.when('/Galileo/survey1', {
				templateUrl: '/partials/survey-1.ejs',
				controller: 'surveyController'
			})
			.when('/Galileo/survey2', {
				templateUrl: '/partials/survey-2.ejs',
				controller: 'surveyController'
			})
			.when('/Galileo/survey3', {
				templateUrl: '/partials/survey-1.ejs',
				controller: 'surveyController'
			})
			/*.when('/logout', {
				redirectTo:("/")
			})*/
			.otherwise({redirectTo:("/")});
			// configure html5 to get links working
			// If you don't do this, you URLs will be base.com/#/home rather than base.com/home
			$locationProvider.html5Mode(true);
     });
/* TODO - create services to update data ??
app.factory('userProfileService', function ($scope) {
        var currUser = {};

        return {
            setCurrUser:function (data) {
                currUser = $scope.currUser;
                console.log(data);
            },
            getCurrUser:function () {
                return currUser;
            }
        };
    });
*/
    /*
app.controller('TodoController', function($scope) {
   $scope.filteredTodos = []
  ,$scope.currentPage = 1
  ,$scope.numPerPage = 10
  ,$scope.maxSize = 5;
  
  $scope.makeTodos = function() {
    $scope.todos = [];
    for (i=1;i<=1000;i++) {
      $scope.todos.push({ text:'todo '+i, done:false});
    }
  };
  $scope.makeTodos(); 
  
  $scope.numPages = function () {
    return Math.ceil($scope.todos.length / $scope.numPerPage);
  };
  
  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;
    $scope.filteredTodos = $scope.todos.slice(begin, end);
  });
});*/



}) (angular, shrewdApp);

function validEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validRole(group_role) {
   if(group_role === "user-admin" || group_role ==="user-exec" || group_role ==="user-manager"|| group_role ==="user-member")
    return true;
	else return false;
}