'use strict';

angular.module('issueTracker.controllers.projectEdit', [])
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

		$routeProvider.when('/projects/:id/edit', {
			templateUrl: 'projects/project-edit.html',
			controller: 'ProjectEditCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('ProjectEditCtrl', [
		'$scope',
		'$q',
		'$routeParams',
		'$route',
		'$location',
		'projectsSvc',
		'issuesSvc',
		'identity',
		function ($scope, $q, $routeParams, $route, $location, projectsSvc, issuesSvc, identity) {
			projectsSvc.getProjectById($routeParams.id)
				.then(function (response) {
					identity.getCurrentUser()
						.then(function (currentUser) {
							$scope.isLead = currentUser.Id == response.Lead.Id;
							if (!$scope.isLead && !currentUser.isAdmin) {
								console.error('Unauthorized Access - You should be project leader');
								$location.path('/dashboard')
							}

							return $q.when(true);
						});

					$scope.currentProject = response;
					$scope.currentProjectName = response.Name;
					$scope.currentProjectLeadId = response.Lead.Id;
				}, function (error) {
					console.error(error)
				});

			issuesSvc.getIssuesByProjectId($routeParams.id)
				.then(function (respose) {
					$scope.currentProjectIssues = respose;
				}, function (error) {
					console.error(error);
				});

			$scope.editProject = function () {
				var data = {};
				data.Name = $scope.currentProject.Name;
				data.Description = $scope.currentProject.Description;
				data.LeadId = $scope.currentProjectLeadId;

				if ($scope.currentProject.NewLabels) {
					var labels = $scope.currentProject.NewLabels.split(' ');
					data.Labels = [];

					for (var i = 0; i < labels.length; i++) {
						if (labels[i]) {
							data.Labels.push({'Name': labels[i]});
						}
					}
				} else {
					data.Labels = $scope.currentProject.Labels;
				}

				if ($scope.currentProject.NewPriorities) {
					var priorities = $scope.currentProject.NewPriorities.split(' ');
					data.Priorities = [];

					for (i = 0; i < priorities.length; i++) {
						if (priorities[i]) {
							data.Priorities.push({'Name': priorities[i]});
						}
					}
				} else {
					data.Priorities = $scope.currentProject.Priorities;
				}

				projectsSvc.editProjectById($routeParams.id, data)
					.then(function (response) {
						console.log(response);
						toastr.success('Project #' + $routeParams.id + ' has been edited successfully', 'Project Edit');
						$route.reload();
					}, function (error) {
						console.error(error);
						toastr.error('An error has occurred', 'Project Edit');
					})
			}
		}
	]);