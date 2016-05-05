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
		'identity',
		'issuesSvc',
		'projectsSvc',
		function ($scope, identity, issuesSvc, projectsSvc) {


			issuesSvc.getCurrentUserIssues(10, 1, 'DueDate desc')
				.then(function (response) {
					$scope.assignedIssues = response.Issues;
					$scope.projectsWithAssignedIssues = [];

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
									console.log($scope.projectsWithAssignedIssues)
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

							console.log(response.Projects);
							$scope.currentUserLeadProjects = response.Projects;
						})
				})
		}]);