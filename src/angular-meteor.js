// lib
import './lib/get-updates';
import './lib/diff-array';
// legacy
import './modules/angular-meteor-settings';
import './modules/angular-meteor-ironrouter';
import './modules/angular-meteor-utils';
import './modules/angular-meteor-subscribe';
import './modules/angular-meteor-collection';
import './modules/angular-meteor-object';
import './modules/angular-meteor-user';
import './modules/angular-meteor-methods';
import './modules/angular-meteor-session';
import './modules/angular-meteor-camera';
import './modules/angular-meteor-stopper';

// new
import { name as utilsName } from './modules/utils';
import { name as mixerName, Mixer } from './modules/mixer';
import { name as scopeName } from './modules/scope';
import { name as coreName, Core } from './modules/core';
import { name as viewModelName, ViewModel } from './modules/view-model';
import { name as reactiveName, Reactive } from './modules/reactive';
import { name as templatesName } from './modules/templates';

const name = 'angular-meteor';
export default name;

angular.module(name, [
  // new
  utilsName,
  mixerName,
  scopeName,
  coreName,
  viewModelName,
  reactiveName,
  templatesName,

  // legacy
  'angular-meteor.ironrouter',
  'angular-meteor.utils',
  'angular-meteor.subscribe',
  'angular-meteor.collection',
  'angular-meteor.object',
  'angular-meteor.user',
  'angular-meteor.methods',
  'angular-meteor.session',
  'angular-meteor.camera'

])

.run([
  Mixer,
  Core,
  ViewModel,
  Reactive,

  function($Mixer, $$Core, $$ViewModel, $$Reactive) {
    // Load all mixins
    $Mixer
      .mixin($$Core)
      .mixin($$ViewModel)
      .mixin($$Reactive);
  }
])

// legacy
// Putting all services under $meteor service for syntactic sugar
.service('$meteor', [
  '$meteorCollection',
  '$meteorCollectionFS',
  '$meteorObject',
  '$meteorMethods',
  '$meteorSession',
  '$meteorSubscribe',
  '$meteorUtils',
  '$meteorCamera',
  '$meteorUser',
  function($meteorCollection, $meteorCollectionFS, $meteorObject,
    $meteorMethods, $meteorSession, $meteorSubscribe, $meteorUtils,
    $meteorCamera, $meteorUser) {
    this.collection = $meteorCollection;
    this.collectionFS = $meteorCollectionFS;
    this.object = $meteorObject;
    this.subscribe = $meteorSubscribe.subscribe;
    this.call = $meteorMethods.call;
    this.session = $meteorSession;
    this.autorun = $meteorUtils.autorun;
    this.getCollectionByName = $meteorUtils.getCollectionByName;
    this.getPicture = $meteorCamera.getPicture;

    // $meteorUser
    [
      'loginWithPassword',
      'requireUser',
      'requireValidUser',
      'waitForUser',
      'createUser',
      'changePassword',
      'forgotPassword',
      'resetPassword',
      'verifyEmail',
      'loginWithMeteorDeveloperAccount',
      'loginWithFacebook',
      'loginWithGithub',
      'loginWithGoogle',
      'loginWithMeetup',
      'loginWithTwitter',
      'loginWithWeibo',
      'logout',
      'logoutOtherClients'
    ].forEach((method) => {
      this[method] = $meteorUser[method];
    });
  }
]);
