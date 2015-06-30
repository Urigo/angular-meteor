angular.module('example', ['angular-meteor']);

angular.module('example').controller('ExampleCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  $scope.images = $meteor.collectionFS(Images, false, Images);

  $('#upload-file').bind("change", function (event) {
    $scope.images.save(event.target.files[0]);
  });

  $scope.removeImage = function(image) {
    $scope.images.remove(image);
  };
}]);