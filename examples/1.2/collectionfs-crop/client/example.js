angular.module('example', ['angular-meteor', 'ngFileUpload', 'xeditable', 'angular-sortable-view', 'ngImgCrop']);

angular.module('example').controller('ExampleCtrl', ['$scope', function ($scope) {
  $scope.images = $scope.$meteorCollectionFS(function() {
    return Images.find({}, {sort: [['metadata.order', 'asc']]});
  }, false, Images);

  $scope.addImages = function (files) {
    if (files.length > 0) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $scope.$apply(function() {
          $scope.imgSrc = e.target.result;
          $scope.myCroppedImage = '';
        });
      };

      reader.readAsDataURL(files[0]);
    }
    else {
      $scope.imgSrc = undefined;
    }
  };

  $scope.saveCroppedImage = function() {
    if ($scope.myCroppedImage !== '') {
      $scope.images.save($scope.myCroppedImage);
    }
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
