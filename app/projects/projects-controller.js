'use strict';

angular.module('issueTracker.controllers.projects', [])
	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', '$rootScope', function ($q, $rootScope) {
				if ($rootScope.isAuthenticated) {
					return $q.when(true);
				}

				console.error('Unauthorized Access');
				return $q.reject('Unauthorized Access');
			}]
		};

		$routeProvider.when('/projects/:id', {
			templateUrl: 'projects/project.html',
			controller: 'ProjectsCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('ProjectsCtrl', [
		'$scope',
		'$routeParams',
		'$location',
		'projectsSvc',
		'issuesSvc',
		'identity',
		function ($scope, $routeParams, $location, projectsSvc, issuesSvc, identity) {
			projectsSvc.getProjectById($routeParams.id)
				.then(function (response) {
					$scope.currentProject = response;

					identity.getCurrentUser()
						.then(function (currentUser) {
							$scope.isLead = currentUser.Id == response.Lead.Id;
							console.log($scope.isLead)
						})
				}, function (error) {
					console.error(error)
				});

			issuesSvc.getIssuesByProjectId($routeParams.id)
				.then(function (respose) {
					$scope.currentProjectIssues = respose;
				}, function (error) {
					console.error(error);
				})

			$scope.goToEditProjectPage = function () {
				$location.path('/projects/' + $routeParams.id + '/edit')
			}
		}
	]);