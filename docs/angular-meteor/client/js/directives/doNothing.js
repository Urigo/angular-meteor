angular.module("meteor-angular-docs").directive('doNothing', function () {
  return {
    restrict: 'AE',
    link: function (scope, element) {
      element.html(element.html());
    }
  };

});