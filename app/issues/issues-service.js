'use strict';

angular.module('issueTracker.services.issues', [])
	.factory('issuesSvc', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			function getCurrentUserIssues(pageSize, pageNumber, orderBy) {
				var url = BASE_URL + 'Issues/me' +
					'?orderBy=' + (orderBy || 'DueDate desc') +
					'&pageSize=' + (pageSize || 10) +
					'&pageNumber=' + (pageNumber || 1);


				var deferred = $q.defer();
				$http.get(url)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function getIssueById(issueId) {
				var url = BASE_URL + 'Issues/' + issueId;

				var deferred = $q.defer();
				$http.get(url)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function getIssuesByProjectId(projectId) {
				var url = BASE_URL + 'Projects/' + projectId + '/Issues';

				var deferred = $q.defer();
				$http.get(url)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function addIssue(data) {
				var url = BASE_URL + 'Issues/';

				var deferred = $q.defer();
				$http.post(url, data)
					.then(function (success) {
						deferred.resolve(success);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function changeStatus(issueId, newStatusId) {
				var url = BASE_URL + 'Issues/' + issueId + '/changestatus?statusid=' + newStatusId;

				var deferred = $q.defer();
				$http.put(url)
					.then(function (success) {
						deferred.resolve(success);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function editIssue(issueId, data) {
				var url = BASE_URL + 'Issues/' + issueId;

				var deferred = $q.defer();
				$http.put(url, data)
					.then(function (success) {
						deferred.resolve(success);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function getIssueComments(issueId) {
				var url = BASE_URL + 'Issues/' + issueId + '/comments';

				var deferred = $q.defer();
				$http.get(url)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			return {
				getCurrentUserIssues: getCurrentUserIssues,
				getIssueById: getIssueById,
				getIssuesByProjectId: getIssuesByProjectId,
				addIssue: addIssue,
				changeStatus: changeStatus,
				editIssue: editIssue,
				getIssueComments: getIssueComments
			}

		}
	]);