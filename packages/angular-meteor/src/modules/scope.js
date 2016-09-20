import { name as mixerName, Mixer } from './mixer';

export const name = 'angular-meteor.scope';

angular.module(name, [
  mixerName
])

.run([
  '$rootScope',
  Mixer,
  function($rootScope, $Mixer) {
    const Scope = $rootScope.constructor;
    const $new = $rootScope.$new;

    // Apply extensions whether a mixin in defined.
    // Note that this way mixins which are initialized later
    // can be applied on rootScope.
    $Mixer._autoExtend.push(Scope.prototype);
    $Mixer._autoConstruct.push($rootScope);

    Scope.prototype.$new = function() {
      const scope = $new.apply(this, arguments);
      // Apply constructors to newly created scopes
      return $Mixer._construct(scope);
    };
  }
]);
