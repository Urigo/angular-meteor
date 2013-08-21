angular.module('ngMeteor', []).config(['$interpolateProvider', function ($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
}]);

angular.element(document).ready(function() {
	angular.bootstrap(document, ['ngMeteor']);
});


