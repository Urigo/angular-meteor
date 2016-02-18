import { module as mixerModule, Mixer } from './mixer';

export const module = 'angular-meteor.scope';

angular.module(module, [
  mixerModule
])

.run([
  '$rootScope',
  Mixer,
  function($rootScope, $Mixer) {
    const Scope = $rootScope.constructor;
    const $new = $rootScope.$new;

    // Extends and constructs every newly created scope without affecting the root scope
    Scope.prototype.$new = function(isolate, parent) {
      const firstChild = this === $rootScope && !this.$$ChildScope;
      const scope = $new.call(this, isolate, parent);

      // If the scope is isolated we would like to extend it aswell
      if (isolate) {
        // The scope is the prototype of its upcomming child scopes, so the methods would
        // be accessable to them as well
        $Mixer._extend(scope);
      }
      // Else, if this is the first child of the root scope we would like to apply the extensions
      // without affection the root scope
      else if (firstChild) {
        // Creating a middle layer where all the extensions are gonna be applied to
        scope.__proto__ = this.$$ChildScope.prototype =
          $Mixer._extend(Object.create(this));
      }

      return $Mixer._construct(scope);
    };
  }
]);
