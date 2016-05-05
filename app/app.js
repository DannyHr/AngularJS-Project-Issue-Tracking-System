'use strict';

angular.module('issueTracker', [
		'ngRoute',
		'ngCookies',
		'issueTracker.home',
		'issueTracker.dashboard',
		'issueTracker.common',
		'issueTracker.users.authentication',
		'issueTracker.users.identity',
		'issueTracker.issues',
		'issueTracker.projects',
		'ngAnimate',
		'ngTouch',
		'ui.bootstrap'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/404'});
	}])
	.run(['$rootScope', '$location', 'authentication', function ($rootScope, $location, authentication) {
		$rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
			if (rejection == 'Unauthorized Access') {
				$location.path('/');
			} else if (rejection == 'Already Logged') {
				$location.path('/dashboard');
			}
		});

		authentication.refreshCookie();
	}])
	.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');