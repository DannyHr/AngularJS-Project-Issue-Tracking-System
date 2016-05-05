'use strict';

angular.module('issueTracker.issues', [])
	.factory('issuesSvc', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			function getCurrentUserIssues(orderBy, pageSize, pageNumber) {
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

			return {
				getCurrentUserIssues: getCurrentUserIssues
			}
		}
	]);