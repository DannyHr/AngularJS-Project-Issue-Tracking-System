'use strict';

angular.module('issueTracker.controllers.projectAdd', [])
	.config(['$routeProvider', function ($routeProvider) {
		var routeChecks = {
			authenticated: ['$q', '$rootScope', function ($q, $rootScope) {
				if ($rootScope.isAdmin) {
					return $q.when(true);
				}

				toastr.error('You are not authorized to access this page', 'Administrator permissions needed');
				return $q.reject('Unauthorized Access');
			}]
		};

		$routeProvider.when('/projects-add', {
			templateUrl: 'projects/project-add.html',
			controller: 'ProjectAddCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('ProjectAddCtrl', [
		'$scope',
		'$q',
		'$routeParams',
		'$location',
		'usersSvc',
		'projectsSvc',
		function ($scope, $q, $routeParams, $location, usersSvc, projectsSvc) {
			$scope.newProject = {};

			usersSvc.getAllUsers()
				.then(function (response) {
					$scope.allUsers = response;
				}, function (error) {
					console.error(error)
				});

			$scope.addProject = function () {
				var data = {};
				data.Name = $scope.newProject.Name;
				data.Description = $scope.newProject.Description;
				data.LeadId = $scope.newProject.Lead.Id;
				data.ProjectKey = $scope.newProject.ProjectKey;
				data.Labels = [];
				data.Priorities = [];

				if ($scope.newProject.stringLabels) {
					var labels = $scope.newProject.stringLabels.split(' ');

					for (var i = 0; i < labels.length; i++) {
						if (labels[i]) {
							data.Labels.push({'Name': labels[i]});
						}
					}
				}

				if ($scope.newProject.stringPriorities) {
					var priorities = $scope.newProject.stringPriorities.split(' ');

					for (i = 0; i < priorities.length; i++) {
						if (priorities[i]) {
							data.Priorities.push({'Name': priorities[i]});
						}
					}
				}

				projectsSvc.addProject(data)
					.then(function (response) {
						console.log(response);
						toastr.success('Project successfully added.', 'Project Added');
						$location.path('/projects/' + response.Id);
					}, function (error) {
						console.error(error);
						toastr.error('Project couldn\'t be added. Check console for more information', 'Project Adding');
					})
			}
		}
	]);