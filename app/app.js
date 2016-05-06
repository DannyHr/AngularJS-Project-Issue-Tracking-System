'use strict';

angular.module('issueTracker', [
		'ngRoute',
		'ngCookies',
		'issueTracker.controllers.home',
		'issueTracker.controllers.dashboard',
		'issueTracker.controllers.projects',
		'issueTracker.controllers.projectEdit',
		'issueTracker.controllers.issues',
		'issueTracker.services.issues',
		'issueTracker.services.projects',
		'issueTracker.users.authentication',
		'issueTracker.users.identity',
		'issueTracker.common',
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
			} else if (rejection == 'Not lead') {
				$location.path('/dashboard');
			}
		});

		authentication.refreshCookie();
	}])
	.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');