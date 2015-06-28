// /public/scripts/usersController.js
(function ( ng, app ) {
	'use strict';
    
app.controller( 'ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
   $scope.submit = function() {
     alert($scope.myForm.$dirty);
  };
  
  $scope.ok = function () {
     $modalInstance.close();
  };

  $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
  };
}]);
    
}) (angular, shrewdApp);