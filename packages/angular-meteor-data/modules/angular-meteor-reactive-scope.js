var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', [
  'angular-meteor.reactive'
]);

angularMeteorReactiveScope.run(['$rootScope', '$parse', '$reactive', function ($rootScope, $parse, $reactive) {
  Object.getPrototypeOf($rootScope).getReactively = function (property, objectEquality) {
    let self = this;
    let getValue = $parse(property);
    objectEquality = !!objectEquality;

    if (!self.hasOwnProperty('$$trackerDeps')) {
      self.$$trackerDeps = {};
    }

    if (!self.$$trackerDeps[property]) {
      self.$$trackerDeps[property] = new Tracker.Dependency();

      self.$watch(() => getValue(self),
        (newVal, oldVal) => {
          if (newVal !== oldVal) {
            self.$$trackerDeps[property].changed();
          }
        }, objectEquality);
    }

    self.$$trackerDeps[property].depend();

    return getValue(self);
  };

  Object.getPrototypeOf($rootScope).helpers = function (helpers) {
    var self = this;

    let reactiveScope = $reactive(self, self);

    reactiveScope.properties(helpers);

    self.stopOnDestroy(reactiveScope);
  };

  Object.getPrototypeOf($rootScope).stopOnDestroy = function (stoppable) {
    this.$on('$destroy', () => stoppable.stop());
  }
}]);
