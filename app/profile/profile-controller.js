'use strict';

angular.module('issueTracker.controllers.profile', [])
	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', '$rootScope', function ($q, $rootScope) {
				if ($rootScope.isAuthenticated) {
					return $q.when(true);
				}

				toastr.warning('You have to login to access this page.', 'Login needed');
				return $q.reject('Unauthorized Access');
			}]
		};

		$routeProvider.when('/profile', {
			templateUrl: 'profile/profile.html',
			controller: 'ProfileCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('ProfileCtrl', [
		'$scope',
		'$location',
		'$routeParams',
		'projectsSvc',
		'authentication',
		'identity',
		function ($scope, $location, $routeParams, projectsSvc, authentication, identity) {
			identity.getCurrentUser()
				.then(function (response) {
					$scope.currentUser = response;
					console.log(response)
				}, function (error) {
					console.error(error);
				});

			$scope.changePassword = function (data) {
				authentication.changePassword(data)
					.then(function (response) {
						console.log(response);
					});

				$scope.data = {};
			}
		}
	]);