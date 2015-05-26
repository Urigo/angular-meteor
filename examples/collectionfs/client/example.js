angular.module('example', ['angular-meteor']);

angular.module('example').controller('ExampleCtrl', ['$meteor', '$scope', function ($meteor, $scope) {

    $scope.images = $meteor.collection(Images, false, Images);

    $('#upload-file').bind("change", function (event) {
      $scope.images.save(event.target.files[0]);
    });

    $scope.addImage = function () {
      $('#upload-file').click();
    };

    $scope.removeImage = function(image) {
      $scope.images.remove(image);
    };

    $scope.url = function (image, store) {
        if (!image) return null;

        return image.url({store: store});
    }
}]);
