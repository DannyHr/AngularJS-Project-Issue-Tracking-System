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
		'issuesSvc',
		'projectsSvc',
		'identity',
		function ($scope, $routeParams, issuesSvc, projectsSvc, identity) {
			issuesSvc.getIssuesById($routeParams.id)
				.then(function (response) {
					$scope.currentIssue = response;
					console.log(response)
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
		}
	]);