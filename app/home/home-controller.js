'use strict';

angular.module('issueTracker.controllers.home', [])

	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', '$rootScope', function ($q, $rootScope) {
				if (!$rootScope.isAuthenticated) {
					return $q.when(true);
				}

				return $q.reject('Already Logged');
			}]
		};

		$routeProvider.when('/', {
			templateUrl: 'home/home.html',
			controller: 'HomeCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('HomeCtrl', [
		'$scope',
		'$location',
		'authentication',
		function ($scope, $location, authentication) {
			$scope.login = function (userData) {
				authentication.loginUser(userData)
					.then(function (loggedUser) {
						$location.path('/dashboard');
						toastr.success('You have successfully logged in.', 'Login');
					}, function (error) {
						toastr.error(error.data.error_description, 'Login');
					})
			};

			$scope.register = function (userData) {
				authentication.registerUser(userData)
					.then(function (loggedUser) {
						toastr.success('You have successfully registered.', 'Register');
						$scope.login(userData);
						$location.path('/dashboard');
					}, function(error){
						console.log(error)
						toastr.error(error.data.ModelState[''][0], 'Register');
					})
			};
		}]);