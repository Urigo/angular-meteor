angular.module('angular-meteor.view-model', [
  'angular-meteor.utils',
  'angular-meteor.mixer'
])


/*
  A mixin which gives us the ability to wrap an object with scope functions bounded to the scope.
  Mainly used on controllers which are also used as the view models. Note that only a single
  view model can be bounded to a scope, otherwise it will have an unexpected behaviour.
 */
.factory('$$ViewModel', [
  '$$utils',
  '$$Mixer',

function($$utils, $$Mixer) {
  function $$ViewModel(vm = this) {
    // Defines the view model on the scope.
    this.$$vm = vm;
  }

  // Gets an object, wraps it with scope functions and returns it
  $$ViewModel.$viewModel = function(vm) {
    if (!_.isObject(vm))
      throw Error('argument 1 must be an object');

    // Apply mixin functions
    $$Mixer.mixins.forEach((mixin) => {
      // Filter only the methods which start with a single $
      let keys = _.keys(mixin).filter(k => k.match(/^\$[^\$]*$/));
      let proto = _.pick(mixin, keys);
      // Bind all the methods to the prototype
      let boundProto = $$utils.bind(proto, this);
      // Add the methods to the view model
      _.extend(vm, boundProto);
    });

    // Apply mixin constructors on the view model
    $$Mixer.construct(this, vm);
    return vm;
  };

  return $$ViewModel;
}]);