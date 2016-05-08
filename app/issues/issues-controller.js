'use strict';

angular.module('issueTracker.controllers.issues', [])
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

		$routeProvider.when('/issues/:id', {
			templateUrl: 'issues/issue.html',
			controller: 'IssuesCtrl',
			resolve: routeChecks.authenticated
		});
	}])

	.controller('IssuesCtrl', [
		'$scope',
		'$routeParams',
		'$route',
		'issuesSvc',
		'projectsSvc',
		'identity',
		'ModalService',
		function ($scope, $routeParams, $route, issuesSvc, projectsSvc, identity, ModalService) {
			issuesSvc.getIssueById($routeParams.id)
				.then(function (response) {
					$scope.currentIssue = response;
					$scope.currentStatusId = response.Status.Id;
					$scope.newStatusId = response.Status.Id;
					$scope.availableStatuses = response.AvailableStatuses;

					identity.getCurrentUser()
						.then(function (currentUser) {
							$scope.isAssignee = currentUser.Id == response.Assignee.Id;
							console.log('$scope.isAssignee=' + $scope.isAssignee);

							projectsSvc.getProjectById($scope.currentIssue.Project.Id)
								.then(function (issueProject) {
									$scope.isProjectLead = issueProject.Lead.Id == currentUser.Id;
									console.log('$scope.isProjectLead=' + $scope.isProjectLead);
								})
						})
				}, function (error) {
					console.error(error)
				});

			$scope.changeStatus = function (newStatusId) {
				issuesSvc.changeStatus($scope.currentIssue.Id, newStatusId)
					.then(function (response) {
						console.log(response);
						$route.reload();
					}, function (error) {
						console.error(error);
					})
			};

			$scope.showChangeStatusModal = function () {
				ModalService.showModal({
					templateUrl: 'issues/change-status.html',
					controller: 'IssuesCtrl'
				}).then(function (modal) {
					modal.element.modal();

					$scope.closeModal = function () {
						return modal.close();
					};
				})
			}
		}
	]);