import _ from '../lib/underscore';
import { name as utilsName, utils } from './utils';
import { name as mixerName, Mixer } from './mixer';

export const name = 'angular-meteor.core';
export const Core = '$$Core';

angular.module(name, [
  utilsName,
  mixerName
])


/*
  A mixin which provides us with core Meteor functions.
 */
.factory(Core, [
  '$q',
  utils,
  Mixer,

  function($q, $$utils, $Mixer) {
    function $$Core() {}

    // Calls Meteor.autorun() which will be digested after each run and automatically destroyed
    $$Core.autorun = function(fn, options = {}) {
      fn = this.$bindToContext($Mixer.caller, fn);

      if (!_.isFunction(fn)) {
        throw Error('argument 1 must be a function');
      }
      if (!_.isObject(options)) {
        throw Error('argument 2 must be an object');
      }

      const computation = Tracker.autorun(fn, options);
      // Reset to a function that will also stop the listener we just added
      computation.stop = this.$$autoStop(computation);
      return computation;
    };

    // Calls Meteor.subscribe() which will be digested after each invokation
    // and automatically destroyed
    $$Core.subscribe = function(subName, fn, cb) {
      fn = this.$bindToContext($Mixer.caller, fn || angular.noop);
      cb = cb ? this.$bindToContext($Mixer.caller, cb) : angular.noop;

      // Additional callbacks specific for this library
      // onStart - right after Meteor.subscribe()
      const hooks = {
        onStart: angular.noop
      };

      if (!_.isString(subName)) {
        throw Error('argument 1 must be a string');
      }
      if (!_.isFunction(fn)) {
        throw Error('argument 2 must be a function');
      }
      if (!_.isFunction(cb) && !_.isObject(cb)) {
        throw Error('argument 3 must be a function or an object');
      }

      if (_.isFunction(cb)) {
        cb = {
          onReady: cb,
        };
      }

      for (const hook in hooks) {
        if (hooks.hasOwnProperty(hook) && cb[hook]) {
          // Don't use any of additional callbacks in Meteor.subscribe
          hooks[hook] = cb[hook];
          delete cb[hook];
        }
      }

      const result = {};

      let startStopBalance = 0;

      const onReadyHook = cb.onReady || angular.noop;
      cb.onReady = function () {
        result.isLoading = false;
        result.error = null;
        onReadyHook();
      };

      const onStopHook = cb.onStop || angular.noop;
      cb.onStop = function (error) {
        startStopBalance -= 1;

        if (startStopBalance === 0) {
          result.isLoading = false;
          result.error = error;
        }
        onStopHook(error);
      };

      const computation = this.autorun(() => {
        let args = fn();
        if (angular.isUndefined(args)) args = [];

        if (!_.isArray(args)) {
          throw Error(`reactive function's return value must be an array`);
        }

        const oldError = result.error;
        result.isLoading = true;
        result.error = null;
        startStopBalance += 1;
        hooks.onStart();

        const subscription = Meteor.subscribe(subName, ...args, cb);

        // In case no new subscription is established in Meteor.
        // Happens if the autorun was triggered, but the params of the subscription didn't change.
        if (result.subscriptionId === subscription.subscriptionId) {
          startStopBalance -= 1;

          if (startStopBalance === 0) {
            result.isLoading = false;
            result.error = oldError;
          }
        }

        Tracker.autorun(() => {
          // Subscribe to changes on the ready-property by calling the ready-method.
          subscription.ready();

          // Re-run the digest cycle if we are not in one already.
          this.$$throttledDigest();
        });

        result.ready = subscription.ready.bind(subscription);
        result.subscriptionId = subscription.subscriptionId;
      });

      // Once the computation has been stopped,
      // any subscriptions made inside will be stopped as well
      result.stop = computation.stop.bind(computation);
      return result;
    };

    // Calls Meteor.call() wrapped by a digestion cycle
    $$Core.callMethod = function(...args) {
      let fn = args.pop();
      if (_.isFunction(fn)) fn = this.$bindToContext($Mixer.caller, fn);
      return Meteor.call(...args, fn);
    };

    // Calls Meteor.apply() wrapped by a digestion cycle
    $$Core.applyMethod = function(...args) {
      let fn = args.pop();
      if (_.isFunction(fn)) fn = this.$bindToContext($Mixer.caller, fn);
      return Meteor.apply(...args, fn);
    };

    // Stops a process once the scope has been destroyed
    $$Core.$$autoStop = function(stoppable) {
      let removeListener;
      const baseStop = stoppable.stop.bind(stoppable);

      // Once the process has been stopped the destroy event listener will be removed
      // to avoid memory leaks and unexpected behaviours
      const stop = (...args) => {
        removeListener();
        return baseStop(...args);
      };

      removeListener = this.$on('$destroy', stop);
      return stop;
    };

    // Digests scope only if there is no phase at the moment
    $$Core.$$throttledDigest = function() {
      const isDigestable = !this.$$destroyed &&
        !this.$$phase &&
        !this.$root.$$phase;

      if (isDigestable) {
        // If a digest cycle in one autorun triggers another autorun,
        // we want to run this second autorun in a non-reactive manner.
        // thus preventing inner autoruns from being dependent on their parents.
        Tracker.nonreactive(() => this.$digest());
      }
    };

    // Creates a promise only that the digestion cycle will be called at its fulfillment
    $$Core.$$defer = function() {
      const deferred = $q.defer();
      // Once promise has been fulfilled, digest
      deferred.promise = deferred.promise.finally(this.$$throttledDigest.bind(this));
      return deferred;
    };

    // Binds an object or a function to the provided context and digest it once it is invoked
    $$Core.$bindToContext = function(context, fn) {
      if (_.isFunction(context)) {
        fn = context;
        context = this;
      }

      return $$utils.bind(fn, context, this.$$throttledDigest.bind(this));
    };

    return $$Core;
  }
]);
