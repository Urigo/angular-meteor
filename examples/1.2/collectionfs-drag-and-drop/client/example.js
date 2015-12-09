angular.module('example', ['angular-meteor', 'ngFileUpload']);

angular.module('example').controller('ExampleCtrl', ['$scope', function ($scope) {
  $scope.images = $scope.$meteorCollectionFS(Images, false, Images);

  $scope.addImages = function (files) {
    $scope.images.save(files);
  };

  $scope.removeImage = function(image) {
    $scope.images.remove(image);
  };
}]);