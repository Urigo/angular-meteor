angular.module('example', ['angular-meteor', 'ngFileUpload', 'xeditable']);

angular.module('example').controller('ExampleCtrl', ['$scope', function ($scope) {
  $scope.images = $scope.$meteorCollectionFS(Images, false);

  $scope.addImages = function (files) {
    $scope.images.save(files);
  };

  $scope.updateDescription = function($data, image) {
    image.update({$set: {'metadata.description': $data}});
  };

  $scope.removeImage = function(image) {
    $scope.images.remove(image);
  };
}]);