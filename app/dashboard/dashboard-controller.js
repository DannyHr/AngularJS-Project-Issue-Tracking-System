'use strict';

angular.module('issueTracker.dashboard', [])

	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', '$rootScope', function ($q, $rootScope) {
				if ($rootScope.isAuthenticated) {
					return $q.when(true);
				}

				console.log('Unauthorized Access');
				return $q.reject('Unauthorized Access');
			}]
		};

		$routeProvider.when('/dashboard', {
			templateUrl: 'dashboard/dashboard.html',
			controller: 'DashboardCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('DashboardCtrl', [
		'$scope',
		'authentication',
		function ($scope) {
			$scope.loggedUser = 'asd';
		}]);