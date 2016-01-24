angular.module('angular-meteor.view-model', [
  'angular-meteor.utils',
  'angular-meteor.mixer',
  'angular-meteor.scope'
])


.factory('$$ViewModel', [
  '$$utils',
  '$$Mixer',

function($$utils, $$Mixer) {
  function $$ViewModel(vm = this) {
    this.$$vm = vm;
  }

  $$ViewModel.$viewModel = function(vm) {
    if (!_.isObject(vm))
      throw Error('argument 1 must be an object');

    $$Mixer.mixins.forEach((mixin) => {
      let keys = _.keys(mixin).filter(k => k.match(/^\$[^\$]*$/));
      let proto = _.pick(mixin, keys);
      let boundProto = $$utils.bind(proto, this);
      _.extend(vm, boundProto);
    });

    $$Mixer.construct(this, vm);
    return vm;
  };

  return $$ViewModel;
}])


.run([
  '$$Mixer',
  '$$ViewModel',

function($$Mixer, $$ViewModel) {
  $$Mixer.mixin($$ViewModel);
}]);