'use strict';

angular.module('issueTracker.services.users', [])
	.factory('usersSvc', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {
			function getAllUsers() {
				var url = BASE_URL + 'Users/';

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
				getAllUsers: getAllUsers
			}
		}
	]);