angular.module('issueTracker.common.footer', [])
	.directive('footer', [function () {
		return {
			restrict: 'A',
			templateUrl: 'common/footer-directive.html',
			link: function (scope, element) {

			}
		};
	}]);
