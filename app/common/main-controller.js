angular.module('issueTracker.common', [])
	.controller('MainCtrl', [
		'$scope',
		'identity',
		function ($scope, identity) {
			identity.getCurrentUser()
				.then(function (response) {
					$scope.currentUser = response;
					$scope.isAuthenticated = true;
				})
		}
	]);