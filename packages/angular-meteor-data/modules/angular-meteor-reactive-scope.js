var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', [
  'angular-meteor.reactive'
]);

angularMeteorReactiveScope.run(['$rootScope', '$reactive', '$parse', function ($rootScope, $reactive, $parse) {
  class ReactiveScope {
    helpers (def) {
      this.stopOnDestroy($reactive(this).helpers(def));
    }

    autorun(fn) {
      return this.stopOnDestroy(Meteor.autorun(fn));
    }

    subscribe (name, fn = angular.noop, resultCb) {
      let result = {};
      let autorunComp = this.autorun(() => {
        let args = fn.apply(this) || [];
        if (!angular.isArray(args)) {
          throw new Error(`[angular-meteor][ReactiveContext] The return value of arguments function in subscribe must be an array! `);
        }

        let subscriptionResult = Meteor.subscribe(name, ...args, resultCb);
        this.stopOnDestroy(subscriptionResult);
        result.ready = subscriptionResult.ready.bind(subscriptionResult);
        result.subscriptionId  = subscriptionResult.subscriptionId;
      });

      result.stop = autorunComp.stop.bind(autorunComp);

      return result;
    }

    getReactively (property, objectEquality) {
      if (!this.$$trackerDeps) {
        this.$$trackerDeps = {};
      }

      if (angular.isUndefined(objectEquality)) {
        objectEquality = false;
      }

      if (!this.$$trackerDeps[property]) {
        this.$$trackerDeps[property] = new Tracker.Dependency();

        this.$watch(property, (newVal, oldVal) => {
            if (newVal !== oldVal) {
              this.$$trackerDeps[property].changed();
            }
          }, objectEquality);
      }

      this.$$trackerDeps[property].depend();

      return $parse(property)(this);
    }

    stopOnDestroy(stoppable) {
      this.$on('$destroy', () => stoppable.stop());

      return stoppable;
    }
  }

  angular.extend(Object.getPrototypeOf($rootScope), ReactiveScope.prototype);
}]);
