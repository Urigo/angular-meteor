var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', [
  'angular-meteor.reactive'
]);

angularMeteorReactiveScope.run(['$rootScope', '$reactive', function ($rootScope, $reactive) {
  class ReactiveScope {
    helpers (def) {
      this.stopOnDestroy($reactive(this, this).properties(def));
    }

    autorun(fn) {
      this.stopOnDestroy(Meteor.autorun(fn));
    }

    subscribe (name, fn) {
      this.autorun(() => {
        this.stopOnDestroy(Meteor.subscribe(name, ...fn()));
      })
    }

    getReactively (property, objectEquality) {
      return $reactive(this, this).getReactively(property, objectEquality);
    }

    stopOnDestroy(stoppable) {
      this.$on('$destroy', () => stoppable.stop());
    }
  }

  angular.extend(Object.getPrototypeOf($rootScope), ReactiveScope.prototype);
}]);
