// /public/scripts/orgController.js
(function( ng, app ) {
	'use strict';
app.controller('orgController', ['$scope', '$http', function ($scope, $http)
{
	$scope.message = 'Use this screen to determine sample size.';
	
	$scope.conf_level=[0,1,2,3,4];
	$scope.truevalues=[50,68,90,95,99];
	$scope.Zvalues=[0.674,0.945,1.645,1.96,2.575];
	$scope.percent = 95 ;
	$scope.sliderval = 3;
	$scope.responserate = 25;
	$scope.sampleSize = 0;
	$scope.confInterval = 10;
	$scope.deparmentsList =[];
	
	$scope.getDepartmentList = function() {
		$scope.message = "Department List";
		// call the create function from our service (returns a promise object)
		$http.get('/api/org/' + $scope.myOrgProfile.orgprofile.alias_name +'/departments/')
			// if successful creation, call our get function to get all the new todos
		 .success(function(data) {
				$scope.deparmentsList = data; // assign our new list of users
				$scope.message = "Department list loaded!";
			//	console.log(data);
		});
	};
	$scope.loadOrganizationProfile=function() {
		$http.get('/galileo/org/profile')
			.success(function(data) {
			$scope.message = 'Organization profile was loaded!'
				$scope.myOrgProfile = data;
				$scope.percent = $scope.myOrgProfile.orgprofile.desired_confidence;
				$scope.responserate = $scope.myOrgProfile.orgprofile.likely_response_rate;
				for(var i=0; i< 5; i++)
				{
					if($scope.truevalues[i] === $scope.percent)
					{
						$scope.sliderval = i;
						var ss = ($scope.Zvalues[i]*$scope.Zvalues[i])*0.25/ (0.0001*$scope.confInterval*$scope.confInterval);
						$scope.sampleSize  = ss ; // / (1+ ((ss-1)/$scope.myOrgProfile.orgprofile.company_strength));
						break;
					}
				}
				$scope.getDepartmentList();
		});
	};
	$scope.loadOrganizationProfile();
	
	$scope.updateOrgProfile = function() {
		//$scope.myOrgProfile.orgprofile.desired_confidence = $scope.percent;
		//form validation
		if($scope.myOrgProfile.orgprofile==null|| $scope.myOrgProfile.orgprofile.alias_name === null || $scope.myOrgProfile.orgprofile.alias_name === ""
		|| $scope.myOrgProfile.orgprofile.company_strength === null || $scope.myOrgProfile.orgprofile.company_strength === "" ||
		 isNaN($scope.myOrgProfile.orgprofile.company_strength) ==true||
		$scope.myOrgProfile.orgprofile.company_strength <5 || $scope.myOrgProfile.orgprofile.company_strength > 1000000)
			/*	|| $scope.myOrgProfile.orgprofile.likely_response_rate <1 || $scope.myOrgProfile.orgprofile.desired_confidence< 50*/
		{
		//input validation failed - alert user
			$scope.message = "Invalid input!" ;
			return;
		}
		else
		{
			$scope.message = "Updating Profile!";
			var org = {
				"alias_name" : $scope.myOrgProfile.orgprofile.alias_name,
				"company_strength": $scope.myOrgProfile.orgprofile.company_strength,
				"desired_confidence": $scope.myOrgProfile.orgprofile.desired_confidence,
				"likely_response_rate": $scope.myOrgProfile.orgprofile.likely_response_rate
			};			
			// call the create function from our service (returns a promise object)
			$http.post('/galileo/org/profile', org)
				// if successful creation, call our get function to get all the new todos
			 .success(function(data) {
			//		$scope.myOrgProfile = data; // assign our new list of users
					$scope.message = "Profile was updated!";
			//		$scope.getDepartmentList();
			});
			$scope.message = "Your organizaiton's profile was updated!";
		}		
	};
}]);
}) (angular, shrewdApp);