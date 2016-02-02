angular.module('example', ['angular-meteor', 'ngFileUpload', 'xeditable', 'angular-sortable-view']);

angular.module('example').controller('ExampleCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  $scope.images = $scope.$meteorCollectionFS(function() {
    return Images.find({}, {sort: [['metadata.order', 'asc']]});
  }, false);

  $scope.addImages = function (files) {
    $scope.images.save(files);
  };

  $scope.updateDescription = function($data, image) {
    image.update({$set: {'metadata.description': $data}});
  };

  $scope.updateOrder = function(indexFrom, indexTo) {
    var imagesOrder = [];

    angular.forEach($scope.images, function (image, index) {
      image.metadata.order = index + 1;
      imagesOrder.push({image: image, order: image.metadata.order});
    });

    var moved = $scope.images.splice(indexTo, 1)[0];
    $scope.images.splice(indexFrom, 0, moved);

    _.forEach(imagesOrder, function(imageOrder) {
      imageOrder.image.update({ $set: { 'metadata.order': imageOrder.order } });
    });
  };

  $scope.removeImage = function(image) {
    $scope.images.remove(image);
  };
}]);
