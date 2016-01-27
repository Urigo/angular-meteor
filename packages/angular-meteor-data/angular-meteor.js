angular.module('angular-meteor', [
  'angular-meteor.router',
  'angular-meteor.utils',
  'angular-meteor.mixer',
  'angular-meteor.scope',
  'angular-meteor.view-model',
  'angular-meteor.core',
  'angular-meteor.reactive'
])


.run([
  '$Mixer',
  '$$ViewModel',
  '$$Core',
  '$$Reactive',

function($Mixer, $$ViewModel, $$Core, $$Reactive) {
  // Load all mixins
  $Mixer
    .mixin($$ViewModel)
    .mixin($$Core)
    .mixin($$Reactive);
}]);