'use strict';

angular.module('issueTracker.services.projects', [])
	.factory('projectsSvc', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			function getProjectsByFilter(pageSize, pageNumber, filter) {
				var url = BASE_URL + 'Projects/' +
					'?pageSize=' + (pageSize || 10) +
					'&pageNumber=' + (pageNumber || 1);


				url += ('&filter=' + (filter || ''));

				var deferred = $q.defer();
				$http.get(url)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function getProjectById(id) {
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

			function editProjectById(id, data) {
				var url = BASE_URL + 'Projects/' + id;

				var deferred = $q.defer();
				$http.put(url, data)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			function addProject(data) {
				var url = BASE_URL + 'Projects/';

				var deferred = $q.defer();
				$http.post(url, data)
					.then(function (success) {
						deferred.resolve(success.data);
					}, function (error) {
						deferred.reject(error);
					});

				return deferred.promise;
			}

			return {
				getProjectsByFilter: getProjectsByFilter,
				getProjectById: getProjectById,
				editProjectById: editProjectById,
				addProject: addProject
			}
		}
	]);