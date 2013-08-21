( function() {
    Deps.afterFlush( function() {
        angular.module('ngMeteor', []).config(['$interpolateProvider', function ($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }]);

        angular.bootstrap(document, ['ngMeteor']);
    });
}) ();
