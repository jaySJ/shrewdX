// /public/scripts/services.js
angular.module('usersService', [])
	// super simple service
	// each function returns a promise object 
	.factory('Users', function($http) {
		return {
			get : function() {
				return $http.get('/api/users');
			},
			create : function(userData) {
				return $http.post('/api/users', userData);
			},
			delete : function(id) {
				return $http.delete('/api/users/' + id);
			}
		}
	},
	.factory('Departments', function($http) {
		return {
			get : function() {
				return $http.get('/api/departments');
			},
			create : function(todoData) {
				return $http.post('/api/departments', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/departments/' + id);
			}
		}
	}
);
appServices.factory('TokenInterceptor', function ($q, $window, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
 
        response: function (response) {
            return response || $q.when(response);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});