angular.module('angular-meteor', [
  // new
  'angular-meteor.utilities',
  'angular-meteor.router',
  'angular-meteor.mixer',
  'angular-meteor.scope',
  'angular-meteor.core',
  'angular-meteor.view-model',
  'angular-meteor.reactive',

  // legacy
  'angular-meteor.utils',
  'angular-meteor.subscribe',
  'angular-meteor.collection',
  'angular-meteor.object',
  'angular-meteor.user',
  'angular-meteor.methods',
  'angular-meteor.session',
  'angular-meteor.camera'

])

.constant('$angularMeteorSettings', {
  suppressWarnings: false
})

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
