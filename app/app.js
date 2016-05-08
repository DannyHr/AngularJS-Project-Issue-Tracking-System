'use strict';

angular.module('issueTracker', [
		'ngRoute',
		'ngCookies',
		'ngAnimate',
		'ngTouch',
		'angularModalService',
		'ui.bootstrap',
		'issueTracker.controllers.home',
		'issueTracker.controllers.dashboard',
		'issueTracker.controllers.projects',
		'issueTracker.controllers.allProjects',
		'issueTracker.controllers.projectEdit',
		'issueTracker.controllers.projectAdd',
		'issueTracker.controllers.issues',
		'issueTracker.controllers.issueEdit',
		'issueTracker.controllers.profile',
		'issueTracker.services.users',
		'issueTracker.services.issues',
		'issueTracker.services.projects',
		'issueTracker.users.authentication',
		'issueTracker.users.identity',
		'issueTracker.common',
		'issueTracker.common.footer'
	])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/404'});
	}])
	.run(['$rootScope', '$location', 'authentication', function ($rootScope, $location, authentication) {
		$rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
			console.log(rejection);
			if (rejection == 'Unauthorized Access') {
				$location.path('/');
			} else if (rejection == 'Already Logged') {
				$location.path('/dashboard');
			}
		});

		$rootScope.maxSize = 20;
		$rootScope.itemsPerPage = 10;

		toastr.options = {
			"closeButton": true,
			"debug": false,
			"newestOnTop": true,
			"progressBar": true,
			"positionClass": "toast-bottom-right",
			"preventDuplicates": false,
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "5000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		};

		authentication.refreshCookie();
	}])
	.constant('ITEMS_PER_PAGE', '10')
	.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');