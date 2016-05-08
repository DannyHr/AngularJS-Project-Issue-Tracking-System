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
		'$rootScope',
		'$location',
		'identity',
		'issuesSvc',
		'projectsSvc',
		'ITEMS_PER_PAGE',
		function ($scope, $rootScope, $location, identity, issuesSvc, projectsSvc, ITEMS_PER_PAGE) {
			$scope.pageParams1 = {
				'startPage': 1,
				'pageSize': ITEMS_PER_PAGE
			};

			$scope.pageParams2 = {
				'startPage': 1,
				'pageSize': ITEMS_PER_PAGE
			};

			$scope.pageParams3 = {
				'startPage': 1,
				'pageSize': ITEMS_PER_PAGE
			};

			identity.getCurrentUser()
				.then(function (currentUser) {
					$scope.isAdmin = currentUser.isAdmin;

					$scope.getCurrentUserIssues = function () {
						issuesSvc.getCurrentUserIssues($scope.pageParams1.pageSize,
							$scope.pageParams1.startPage,
							'DueDate desc')
							.then(function (response) {
								$scope.assignedIssues = response.Issues;
								$scope.assignedIssuesTotalCount = response.TotalCount;
								$scope.projectsWithAssignedIssues = [];

								var uniqueProjectIds = [];
								if (response.Issues.length > 0) {
									response.Issues.forEach(function (i) {
										uniqueProjectIds[i.Project.Id] = i.Project.Id;
									});
								}

								if (uniqueProjectIds.length > 0) {
									uniqueProjectIds.forEach(function (id) {
										projectsSvc.getProjectById(id)
											.then(function (response) {
												$scope.projectsWithAssignedIssues.push(response);
											}, function (error) {
												console.error(error);
											});
									})
								}
							});
					};
					$scope.getCurrentUserIssues();

					$scope.getProjectsLed = function () {
						projectsSvc.getProjectsByFilter($scope.pageParams2.pageSize, $scope.pageParams2.startPage, 'Lead.Id="' + currentUser.Id + '"')
							.then(function (response) {
								$scope.currentUserLeadProjects = response.Projects;
								$scope.currentUserLeadProjectsTotalCount = response.TotalCount;

							})
					};
					$scope.getProjectsLed();
				});

			$scope.goToProject = function (id) {
				$location.path('/projects/' + id);
			};

			$scope.goToIssue = function (id) {
				$location.path('/issues/' + id);
			};

			$scope.goToAddNewProjectPage = function () {
				$location.path('/projects/add');
			};

			$scope.goToAllProjectsPage = function () {
				$location.path('/projects');
			};
		}]);