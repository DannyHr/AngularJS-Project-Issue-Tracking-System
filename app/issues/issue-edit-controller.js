'use strict';

angular.module('issueTracker.controllers.issueEdit', [])
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

		$routeProvider.when('/issues/:id/edit', {
			templateUrl: 'issues/issue-edit.html',
			controller: 'IssueEditCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('IssueEditCtrl', [
		'$scope',
		'$q',
		'$routeParams',
		'$route',
		'$location',
		'projectsSvc',
		'issuesSvc',
		'identity',
		'usersSvc',
		function IssueEditCtrl($scope, $q, $routeParams, $route, $location, projectsSvc, issuesSvc, identity, usersSvc) {
			$scope.editedIssue = {};
			$scope.editedIssue.stringLabels = '';

			issuesSvc.getIssueById($routeParams.id)
				.then(function (response) {
					console.log(response)
					identity.getCurrentUser()
						.then(function (currentUser) {
							console.log(currentUser)
							$scope.isAssignee = currentUser.Id == response.Assignee.Id;
							if (!currentUser.isAdmin && !$scope.isAssignee) {
								console.error('Unauthorized Access - You should be issue assignee');
								$location.path('/dashboard')
							}

							return $q.when(true);
						});

					$scope.currentIssue = response;
					$scope.currentIssueTitle = response.Title;
					$scope.currentIssueId = response.Id;
					$scope.currentIssueProjectId = response.Project.Id;

					projectsSvc.getProjectById($scope.currentIssueProjectId)
						.then(function (currentProject) {
							$scope.currentProject = currentProject;
							usersSvc.getAllUsers()
								.then(function (response) {
									$scope.allUsers = response;
									$scope.editedIssue.AssigneeId = angular.copy($scope.allUsers[0]);
									$scope.editedIssue.PriorityId = angular.copy($scope.currentProject.Priorities[0]);

								}, function (error) {
									console.error(error)
								});
						});
				}, function (error) {
					console.error(error)
				});

			$scope.editIssue = function () {
				var labels = [];
				if ($scope.editedIssue.stringLabels) {
					$scope.editedIssue.stringLabels.split(' ').forEach(function (label) {
						labels.push({Name: label})
					});
				}

				var data = {
					Title: $scope.currentIssue.Title,
					Description: $scope.currentIssue.Description,
					DueDate: $scope.editedIssue.DueDate,
					AssigneeId: $scope.currentIssue.AssigneeId,
					PriorityId: $scope.currentIssue.PriorityId,
					Labels: labels
				};

				issuesSvc.editIssue($scope.currentIssue.Id, data)
					.then(function (respond) {
						console.log(respond);
						toastr.success('Issue has been successfully edited.', 'Issue Edited');
						$route.reload();
					}, function (error) {
						toastr.error('Issue couldn\'t be edited. Check console for more information', 'Issue Editing failed');
						console.error(error);
					})
			};
		}
	]);