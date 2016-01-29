angular.module('angular-meteor', [
  'angular-meteor.router',
  'angular-meteor.utils',
  'angular-meteor.mixer',
  'angular-meteor.scope',
  'angular-meteor.core',
  'angular-meteor.view-model',
  'angular-meteor.reactive'
])


.run([
  '$Mixer',
  '$$Core',
  '$$ViewModel',
  '$$Reactive',

function($Mixer, $$Core, $$ViewModel, $$Reactive) {
  // Load all mixins
  $Mixer
    .mixin($$Core)
    .mixin($$ViewModel)
    .mixin($$Reactive);
}]);