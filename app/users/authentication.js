'use strict';

angular.module('issueTracker.users.authentication', [])
	.factory('authentication', [
		'$q',
		'$http',
		'$cookies',
		'$rootScope',
		'BASE_URL',
		'identity',
		function ($q, $http, $cookies, $rootScope, BASE_URL, identity) {

			var AUTHENTICATION_COOKIE_KEY = 'AuthToken';

			function preserveUserData(data) {
				var accessToken = data.access_token;
				$http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
				$cookies.put(AUTHENTICATION_COOKIE_KEY, accessToken);
			}

			function removeUserData() {
				$http.defaults.headers.common.Authorization = undefined;
				$cookies.remove(AUTHENTICATION_COOKIE_KEY);
			}

			function loginUser(userData) {
				var deferred = $q.defer();

				var loginUserData = 'username=' + userData.Email + '&password=' + userData.Password + '&grant_type=password';
				$http.post(BASE_URL + 'api/Token', loginUserData, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
					.then(function (response) {
						console.log('Successfully logged in');
						preserveUserData(response.data);

						$rootScope.isAuthenticated = true;

						identity.requestCurrentUserProfile()
							.then(function (response) {
								deferred.resolve(response);
							})
					});

				return deferred.promise;
			}

			function registerUser(userData) {
				var deferred = $q.defer();

				$http.post(BASE_URL + 'api/Account/Register', userData)
					.then(function (response) {
						console.log('Successfully registered');
						deferred.resolve(response);
					});

				return deferred.promise;
			}

			function logoutUser() {
				removeUserData();
				$rootScope.isAuthenticated = false;
				identity.removeUserProfile();
			}

			function checkIsAuthenticated() {
				return !!$cookies.get(AUTHENTICATION_COOKIE_KEY);
			}

			function refreshCookie() {
				if (checkIsAuthenticated()) {
					$http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get(AUTHENTICATION_COOKIE_KEY);
					identity.requestCurrentUserProfile();
				}
			}

			return {
				loginUser: loginUser,
				registerUser: registerUser,
				logoutUser: logoutUser,
				checkIsAuthenticated: checkIsAuthenticated,
				refreshCookie: refreshCookie
			}
		}
	]);