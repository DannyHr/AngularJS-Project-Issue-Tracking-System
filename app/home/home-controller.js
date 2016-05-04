'use strict';

angular.module('issueTracker.home', [])

	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', 'authentication', function ($q, authentication) {
				if (!authentication.isAuthenticated()) {
					return $q.when(true);
				}

				console.log('Already Logged In');
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
					})
			};

			$scope.register = function (userData) {
				authentication.registerUser(userData)
					.then(function (registeredUser) {
						$location.path('/dashboard');
					})
			};
		}]);