angular.module('example', ['angular-meteor']);

angular.module('example').controller('ExampleCtrl', ['$scope', function ($scope) {
  $scope.images = $scope.$meteorCollectionFS(Images, false, Images);

  $('#upload-file').bind("change", function (event) {
    $scope.images.save(event.target.files[0]);
  });

  $scope.removeImage = function(image) {
    $scope.images.remove(image);
  };
}]);