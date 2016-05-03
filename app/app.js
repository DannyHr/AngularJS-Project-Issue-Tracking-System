'use strict';

angular.module('issueTracker', [
		'ngRoute',
		'issueTracker.dashboard',
		'issueTracker.users.authentication'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/404'});
	}])
	.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');