var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', [
  'angular-meteor.reactive'
]);

angularMeteorReactiveScope.run(['$rootScope', '$parse', '$reactive', function ($rootScope, $parse, $reactive) {
  Object.getPrototypeOf($rootScope).getReactively = function (property, objectEquality) {
    return $reactive(this, this).getReactively(property, objectEquality);
  };

  Object.getPrototypeOf($rootScope).helpers = function (helpers) {
    let self = this;

    let reactiveScope = $reactive(self, self);

    reactiveScope.properties(helpers);

    self.stopOnDestroy(reactiveScope);
  };

  Object.getPrototypeOf($rootScope).stopOnDestroy = function (stoppable) {
    this.$on('$destroy', () => stoppable.stop());
  }
}]);
