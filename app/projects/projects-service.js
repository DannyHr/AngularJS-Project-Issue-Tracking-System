'use strict';

angular.module('issueTracker.projects', [])
	.factory('projectsSvc', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			function getProjectsByFilter(pageSize, pageNumber, filter) {
				var url = BASE_URL + 'Projects/' +
					'?pageSize=' + (pageSize || 10) +
					'&pageNumber=' + (pageNumber || 1);

				if (filter) {
					url += ('&filter=' + filter);
				}

				var deferred = $q.defer();
				$http.get(url)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function getProjectsById(id) {
				var url = BASE_URL + 'Projects/' + id;

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
				getProjectsByFilter: getProjectsByFilter,
				getProjectsById: getProjectsById
			}
		}
	]);