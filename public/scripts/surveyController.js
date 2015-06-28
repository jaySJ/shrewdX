// /public/scripts/surveyController.js
(function( ng, app ) {
	'use strict';
    app.controller('surveyController', ['$scope', '$http', function ($scope, $http)
    {
        $scope.message ="Ready";
        $scope.model = [];
        $scope.departmentsList =[];
        $scope.departments = [];
        $scope.itemList= ['Documents/Data', 'Document(/Specification) Numbers', 'Signature/Approval', 'Material/Software Resources', 'Money/Funds', 'Product Knowledge', 
                          'Production Process Knowledge', 'Business Process Knowledge', 'Technical Knowledge', 'Contacts (Internal/External)', 'Review/Feedback/QA' , 'Training'];
        $scope.items = [];
        $scope.getDepartmentList = function(orgname) {
            $scope.message = "Department List";
            // call the create function from our service (returns a promise object)
            $http.get('/api/org/' + orgname +'/departments/')
                // if successful creation, call our get function to get all the new todos
             .success(function(data) {
                    $scope.departmentsList = data; // assign our new list of users
                    $scope.message = "Please indicate the frequency of your interactions with the following " + $scope.departmentsList.length + 
                        " departments in the past 3 months. Drag and drop the departments into the bins.";
                    for(var i = 0; i< $scope.departmentsList.length; i++)
                    {
                        $scope.departments.push ( {"id": i, "value": $scope.departmentsList[i]._id.department + " | " + '\r\n' + $scope.departmentsList[i]._id.location} );
                    }				
            });
        };
        $scope.getItemList = function() {
            $scope.message = "Item List";
            // call the create function from our service (returns a promise object)
    //		$http.get('/api/org/' + orgname +'/departments/')
            // if successful creation, call our get function to get all the new todos
    //		 .success(function(data) {
    //				$scope.deparmentsList = data; // assign our new list of users
                    $scope.message = "Please indicate what you received from " + " in the past 3 months. \n Drag and drop the items into appropriate bins.";
                    for(var i = 1; i< $scope.itemList.length; i++)
                    {
                        $scope.items.push ( {"id": i, "value": $scope.itemList[i]} );
                    }				
    //		});
        };
        $scope.loadOrganizationProfile=function() {
            $http.get('/galileo/org/profile')
                .success(function(data) {
                    $scope.myOrgProfile = data;
                    $scope.getDepartmentList($scope.myOrgProfile.orgprofile.alias_name);
                    $scope.message = 'Organization profile was loaded!' + $scope.myOrgProfile.orgprofile.alias_name;				
            });
        };
        $scope.loadOrganizationProfile();
        $scope.getItemList();	
    }]);
}) (angular, shrewdApp);