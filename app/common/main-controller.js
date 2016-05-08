angular.module('issueTracker.common', [])
	.controller('MainCtrl', [
		'$scope',
		'$location',
		'$rootScope',
		'authentication',
		'identity',
		function ($scope, $location, $rootScope, authentication, identity) {
			$rootScope.isAuthenticated = authentication.checkIsAuthenticated();
			identity.getCurrentUser()
				.then(function (success) {
					$rootScope.isAdmin = success.isAdmin;
				});

			$scope.logout = function () {
				$location.path('/');
				authentication.logoutUser();
				toastr.success('You have been successfully logged out.', 'Logout');
			}
		}
	]);