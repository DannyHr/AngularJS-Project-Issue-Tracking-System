'use strict';

angular.module('issueTracker.dashboard', [
		'issueTracker.users.authentication'
	])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'dashboard/dashboard.html',
			controller: 'DashboardCtrl'
		});
	}])

	.controller('DashboardCtrl', [
		'$scope',
		'$location',
		'authentication',
		function ($scope, $location, authentication) {
			$scope.login = function (userData) {
				authentication.loginUser(userData)
					.then(function (loggedUser) {
						console.log(loggedUser);
						//TODO
					})
			};

			$scope.register = function (userData) {
				authentication.registerUser(userData)
					.then(function (registeredUser) {
						console.log(registeredUser);
						//TODO
					})
			};
		}]);