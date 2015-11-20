var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', []);

angularMeteorReactiveScope.run(['$rootScope', '$parse', function ($rootScope, $parse) {
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
    angular.forEach(helpers, (func, name) => {
      self.stopOnDestroy(Tracker.autorun(() => {
        var newValue = func();
        if (angular.isUndefined(self[name])) {
          self[name] = angular.copy(newValue);
        }
        else {
          if ((!_.isObject(newValue) && !_.isArray(newValue)) || (!_.isObject(self[name]) && !_.isArray(self[name]))) {
            self[name] = newValue
          }
          else {
            jsondiffpatch.patch(self[name], jsondiffpatch.diff(self[name], newValue));
          }
        }

        if (!$rootScope.$$phase)
          self.$digest();
      }));
    });
  };

  Object.getPrototypeOf($rootScope).stopOnDestroy = function (stoppable) {
    this.$on('$destroy', () => stoppable.stop());
  }
}]);
