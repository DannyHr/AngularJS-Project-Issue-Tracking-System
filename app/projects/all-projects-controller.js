'use strict';

angular.module('issueTracker.controllers.allProjects', [])
	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', 'identity', function ($q, identity) {
				identity.getCurrentUser()
					.then(function (response) {
						if (response.isAdmin) {
							return $q.when(true);
						}

						console.error('You must have administrator privileges to access this page.');
						return $q.reject('Unauthorized Access');
					});
			}]
		};

		$routeProvider.when('/projects', {
			templateUrl: 'projects/all-projects.html',
			controller: 'AllProjectsCtrl',
			resolve: routeChecks.authenticated
		});
	}])
	.controller('AllProjectsCtrl', [
		'$scope',
		'projectsSvc',
		'identity',
		'ITEMS_PER_PAGE',
		'$location',
		function ($scope, projectsSvc, identity, ITEMS_PER_PAGE, $location) {
			$scope.pageParams = {
				'startPage': 1,
				'pageSize': ITEMS_PER_PAGE
			};

			$scope.getAllProjects = function () {
				projectsSvc.getProjectsByFilter($scope.pageParams.pageSize, $scope.pageParams.startPage)
					.then(function (response) {
						$scope.allProjects = response.Projects;
						$scope.allProjectsTotalCount = response.TotalCount;
					});
			};
			$scope.getAllProjects();

			$scope.goToAddNewProjectPage = function () {
				$location.path('/projects-add');
			};

			$scope.goToProject = function (id) {
				$location.path('/projects/' + id);
			}
		}
	]);