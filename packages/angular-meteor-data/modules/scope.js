angular.module('angular-meteor.scope', [
  'angular-meteor.mixer'
])


.run([
  '$rootScope',
  '$$Mixer',

function($rootScope, $$Mixer) {
  let Scope = $rootScope.constructor;
  let $new = $rootScope.$new;

  // Extends and constructs every newly created ChildScope prototype by the stored mixins
  Scope.prototype.$new = function(isolate, parent) {
    // $$ChildScope is the ChildScope class which will be created the first time an instance
    // of an isolated scope is created
    let shouldExtend = !this.$$ChildScope;
    // Calls the original method
    let scope = $new.call(this, isolate, parent);

    // In case it's a child scope construct it and extend it's prototype if needed
    if (!isolate) {
      if (shouldExtend) $$Mixer.extend(this.$$ChildScope);
      $$Mixer.construct(scope);
    }

    return scope;
  };
}]);