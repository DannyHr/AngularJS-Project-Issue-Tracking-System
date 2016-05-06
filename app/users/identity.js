angular.module('issueTracker.users.identity', [])
	.factory('identity', [
		'$http',
		'$q',
		'BASE_URL',
		function ($http, $q, BASE_URL) {

			var deferred = $q.defer();

			var currentUser = undefined;

			function getCurentUser() {
				if (currentUser) {
					return $q.when(currentUser);
				} else {
					return deferred.promise;
				}
			}

			function requestCurrentUserProfile() {
				var userProfileDeferred = $q.defer();

				$http.get(BASE_URL + 'Users/me')
					.then(function (response) {
						currentUser = response.data;
						deferred.resolve(currentUser);
						userProfileDeferred.resolve();
					}, function (error) {
						userProfileDeferred.reject(error);
					});

				return userProfileDeferred.promise;
			}

			function removeUserProfile() {
				currentUser = undefined;
			}

			return {
				getCurrentUser: getCurentUser,
				requestCurrentUserProfile: requestCurrentUserProfile,
				removeUserProfile: removeUserProfile
			}
		}
	]);