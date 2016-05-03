'use strict';

angular.module('issueTracker.users.authentication', [])
	.factory('authentication', [
		'$q',
		'$http',
		'BASE_URL',
		function ($q, $http, BASE_URL) {
			function loginUser(userData) {
				var deferred = $q.defer();

				var loginUserData = 'username=' + userData.Email + '&password=' + userData.Password + '&grant_type=password';
				$http.post(BASE_URL + 'api/Token', loginUserData, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
					.then(function (response) {
						console.log(response);
						//TODO
					});

				return deferred.promise;
			}

			function registerUser(userData) {
				var deferred = $q.defer();

				$http.post(BASE_URL + 'api/Account/Register', userData)
					.then(function (response) {
						console.log(response);
						//TODO
					});

				return deferred.promise;
			}

			function isAuthenticated() {
				return true;
			}

			return {
				loginUser: loginUser,
				registerUser: registerUser,
				isAuthenticated: isAuthenticated
			}
		}
	]);