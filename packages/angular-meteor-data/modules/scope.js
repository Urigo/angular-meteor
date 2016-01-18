angular.module('angular-meteor.scope', [
  'angular-meteor.mixer',
])


.run([
  '$rootScope',
  '$$Mixer',

function($rootScope, $$Mixer) {
  let Scope = $rootScope.constructor;
  let $new = $rootScope.$new;

  Scope.prototype.$new = function(isolate, parent) {
    let shouldExtend = !this.$$ChildScope;
    let scope = $new.call(this, isolate, parent);

    if (!isolate) {
      if (shouldExtend) $$Mixer.extend(this.$$ChildScope);
      $$Mixer.construct(scope);
    }

    return scope;
  };
}]);