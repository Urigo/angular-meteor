angular.module('angular-meteor.scope', [
  'angular-meteor.mixer'
])


.run([
  '$rootScope',
  '$Mixer',

function($rootScope, $Mixer) {
  let Scope = $rootScope.constructor;
  let $new = $rootScope.$new;

  // Extends and constructs every newly created scope without affecting the root scope
  Scope.prototype.$new = function(isolate, parent) {
    let firstChild = this === $rootScope && !this.$$ChildScope;
    let scope = $new.call(this, isolate, parent);

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
}]);