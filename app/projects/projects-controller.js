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
		'$route',
		'projectsSvc',
		'issuesSvc',
		'usersSvc',
		'identity',
		'ModalService',
		function ($scope, $routeParams, $location, $route, projectsSvc, issuesSvc, usersSvc, identity, ModalService) {
			$scope.newIssue = {};
			$scope.newIssue.stringLabels = '';

			projectsSvc.getProjectById($routeParams.id)
				.then(function (response) {
					$scope.currentProject = response;

					identity.getCurrentUser()
						.then(function (currentUser) {
							$scope.isLead = currentUser.Id == response.Lead.Id;
							$scope.isAdmin = currentUser.isAdmin;
						})
				}, function (error) {
					console.error(error)
				});

			issuesSvc.getIssuesByProjectId($routeParams.id)
				.then(function (response) {
					$scope.currentProjectIssues = response;
					console.log(response)
				}, function (error) {
					console.error(error);
				});

			$scope.goToEditProjectPage = function () {
				$location.path('/projects/' + $routeParams.id + '/edit')
			};

			usersSvc.getAllUsers()
				.then(function (response) {
					$scope.allUsers = response;
					$scope.newIssue.AssigneeId = angular.copy($scope.allUsers[0]);
					$scope.newIssue.PriorityId = angular.copy($scope.currentProject.Priorities[0]);
				}, function (error) {
					console.error(error)
				});

			$scope.createIssue = function () {
				var labels = [];
				if ($scope.newIssue.stringLabels) {
					$scope.newIssue.stringLabels.split(' ').forEach(function (label) {
						labels.push({Name: label})
					});
				}

				var data = {
					Title: $scope.newIssue.Title,
					Description: $scope.newIssue.Description,
					DueDate: $scope.newIssue.DueDate,
					ProjectId: $scope.currentProject.Id,
					AssigneeId: $scope.newIssue.AssigneeId,
					PriorityId: $scope.newIssue.PriorityId,
					Labels: labels
				};

				issuesSvc.addIssue(data)
					.then(function (respond) {
						console.log(respond);
						toastr.success('Issue successfully added to project #' + $scope.currentProject.Id, 'Issue added');
						$route.reload();
						issuesSvc.getIssuesByProjectId($routeParams.id)
							.then(function (response) {
								$scope.currentProjectIssues = response;
								console.log(response)
							}, function (error) {
								console.error(error);
							});
					})
			};

			$scope.showAddIssueModal = function () {
				ModalService.showModal({
					templateUrl: 'projects/add-issue.html',
					controller: 'ProjectsCtrl'
				}).then(function (modal) {
					modal.element.modal();

					$scope.closeModal = function () {
						return modal.close();
					};
				})
			}
		}
	]);