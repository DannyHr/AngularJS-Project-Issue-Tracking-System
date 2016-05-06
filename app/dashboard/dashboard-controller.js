'use strict';

angular.module('issueTracker.controllers.dashboard', [])

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

		$routeProvider.when('/dashboard', {
			templateUrl: 'dashboard/dashboard.html',
			controller: 'DashboardCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('DashboardCtrl', [
		'$scope',
		'$location',
		'identity',
		'issuesSvc',
		'projectsSvc',
		function ($scope, $location, identity, issuesSvc, projectsSvc) {
			issuesSvc.getCurrentUserIssues(10, 1, 'DueDate desc')
				.then(function (response) {
					$scope.assignedIssues = response.Issues;
					$scope.projectsWithAssignedIssues = [];

					console.log($scope.assignedIssues)

					var uniqueProjectIds = [];
					if (response.Issues.length > 0) {
						response.Issues.forEach(function (i) {
							uniqueProjectIds[i.Project.Id] = i.Project.Id;
						});
					}

					if (uniqueProjectIds.length > 0) {
						uniqueProjectIds.forEach(function (id) {
							projectsSvc.getProjectsById(id)
								.then(function (response) {
									$scope.projectsWithAssignedIssues.push(response);
								}, function (error) {
									console.error(error);
								});
						})
					}

				});

			identity.getCurrentUser()
				.then(function (currentUser) {
					projectsSvc.getProjectsByFilter(10, 1, 'Lead.Id="' + currentUser.Id + '"')
						.then(function (response) {

							$scope.currentUserLeadProjects = response.Projects;
						})
				});

			$scope.goToProject = function (id) {
				$location.path('projects/' + id)
			};

			$scope.goToIssue = function (id) {
				$location.path('issues/' + id)
			};
		}]);