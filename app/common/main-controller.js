angular.module('issueTracker.common', [])
	.controller('MainCtrl', [
		'$scope',
		'$location',
		'$rootScope',
		'authentication',
		function ($scope, $location, $rootScope, authentication) {
			$rootScope.isAuthenticated = authentication.checkIsAuthenticated();
			console.log($rootScope.isAuthenticated);

			$scope.logout = function () {
				$location.path('/');
				authentication.logoutUser();
			}
		}
	]);