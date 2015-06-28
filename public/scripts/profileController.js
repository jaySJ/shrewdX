// /public/scripts/usersController.js
(function( ng, app ) {
	'use strict';
app.controller('profileController', ['$scope','$http', function ($scope, $http)
{
	$scope.message = 'Please update and press Submit';

	$scope.getProfile = function() {
		$http.get ('/galileo/account')
		.success(function(data) {
			$scope.myProfile = data;
			$scope.message = 'Please update and press Submit';
		//	console.log(data);
		});
	};
	$scope.getProfile();
	$scope.IsAdmin = function(){
		return (($scope.myProfile.user.local.group === "user-admin") || ($scope.myProfile.user.local.group === "site-admin"));
	}
	$scope.IsUser = function(){
		return $scope.myProfile.user.local.group === "user-member";
	}
	$scope.IsManager = function(){
		return $scope.myProfile.user.local.group == "user-manager";
	}
	$scope.IsExec = function(){
		return $scope.myProfile.user.local.group == "user-exec";
	}
	$scope.updateProfile = function() {
		if($scope.myProfile.user.local !=null &&
		$scope.myProfile.user.local.lastname != null && $scope.myProfile.user.local.firstname != ""
		&& $scope.myProfile.user.local.firstname != null && $scope.myProfile.user.local.firstname != ""
		&& $scope.myProfile.user.local.department != null && $scope.myProfile.user.local.department != ""
		&& $scope.myProfile.user.local.location != null && $scope.myProfile.user.local.location != ""
		&& $scope.myProfile.user.local.group != null && $scope.myProfile.user.local.group != "")
		{
			var member = { "email": $scope.myProfile.user.local.email,
			"lastname": $scope.myProfile.user.local.lastname,
			"firstname": $scope.myProfile.user.local.firstname, 
			"department": $scope.myProfile.user.local.department, 
			"location": $scope.myProfile.user.local.location, 
			"user_group": $scope.myProfile.user.local.group};
			$scope.message = "Updating Profile!";
			// call the create function from our service (returns a promise object)	
			$http.post('/galileo/account/profile/', member)
				// if successful creation, call our get function to get all the new todos
			 .success(function(data) {
				//	$scope.formData = {}; // clear the form so our user is ready to enter another							
					$scope.myProfile = data; // assign our new list of users							
					$scope.message = "Profile was updated!";
				//	console.log(data);
			});
			$scope.message = "Profile was updated!";
		}
		else{
			$scope.message = "Required name fields are empty!";
		}
	};
	
	$scope.updateProfilePwd = function() {
		if($scope.pwd === $scope.pwd2 && $scope.pwd!=null)
		{
			var member = { "email": $scope.myProfile.user.local.email,
			"password": $scope.pwd}
			$scope.message = "Updating Profile!";
			// call the create function from our service (returns a promise object)
			$http.post('/galileo/account/pwd/', member)
				// if successful creation, call our get function to get all the new todos
			 .success(function(data) {
					$scope.myProfile = data; // assign our new list of users							
					$scope.message = "Profile was updated!";
				//	console.log(data);
			});
			$scope.message = "Profile was updated!";
		}
		else{
			$scope.message = "Passwords don't match. Please re-enter matching passwords!";
		}
	};
}]);

}) (angular, shrewdApp);