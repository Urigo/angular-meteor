angular.module('perf', ['angular-meteor'])
  .controller('MainCtrl', function($scope, $meteorCollection, $meteorMethods, $meteorSubscribe, $timeout) {
    var initialDataStart = new Date();
    var initialDataScopeApplys = 0;
    var initialDataRecieved = false;

    $scope.items = $meteorCollection(SampleData);

    $meteorSubscribe.subscribe('data').then(function() {
      $scope.initialDataReady = true;
      initialDataRecieved = true;
      $timeout(function() {
        $scope.initialDataTotalTime = new Date() - initialDataStart;
        $scope.initialDataScopeApplys = initialDataScopeApplys;
      });
    });

    $scope.$watch(function() {
      if (angular.isDefined(initialDataRecieved) && !initialDataRecieved)
        initialDataScopeApplys++;
    });

    $scope.addItems = function(numOfItems) {
      $meteorMethods.call('addItems', numOfItems);
    };

    $scope.removeItem = function(id) {
      $meteorMethods.call('removeItem', id);
    };

    $scope.removeItems = function(numOfItems) {
      $meteorMethods.call('removeItems', numOfItems);
    };
  });
