let reactive = angular.module('angular-meteor.reactive', []);

reactive.factory('$reactive', ['$rootScope', '$parse', ($rootScope, $parse) => {
  class ReactiveContext {
    constructor(context, scope) {
      this.context = context;
      this.scope = scope;
      this.computations = [];
      this.callbacks = [];
      this.trackerDeps = {};
    }

    properties (props) {
      angular.forEach(props, (func, name) => {
        this.computations.push(Tracker.autorun(() => {
          var newValue = func();
          if (angular.isUndefined(this.context[name])) {
            this.context[name] = angular.copy(newValue);
          }
          else {
            if ((!_.isObject(newValue) && !_.isArray(newValue)) ||
              (!_.isObject(this.context[name]) && !_.isArray(this.context[name]))) {
              this.context[name] = newValue
            }
            else {
              jsondiffpatch.patch(this.context[name], jsondiffpatch.diff(this.context[name], newValue));
            }
          }

          if (this.scope && !$rootScope.$$phase)
            this.scope.$digest();

          this._propertyChanged(name);
        }));
      });

      return this;
    }

    getReactively(property, objectEquality) {
      let scope = this.scope || $rootScope;
      let getValue = $parse(property);
      objectEquality = !!objectEquality;

      if (!this.trackerDeps[property]) {
        this.trackerDeps[property] = new Tracker.Dependency();

        scope.$watch(() => getValue(this.context),
          (newVal, oldVal) => {
            if (newVal !== oldVal) {
              this.trackerDeps[property].changed();
            }
          }, objectEquality);
      }

      this.trackerDeps[property].depend();

      return getValue(this.context);
    }

    onPropertyChanged(cb) {
      this.callbacks.push(cb);
    }

    _propertyChanged(propName) {
      angular.forEach(this.callbacks, (cb) => {
        cb(propName)
      });
    }

    stop () {
      angular.forEach(this.computations, (comp) => {
        comp.stop();
      });
    }
  }

  return function(context) {
    return new ReactiveContext(context);
  };
}]);
