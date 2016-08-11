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

      if (_.isObject(cb)) {
        for (const hook in hooks) {
          if (hooks.hasOwnProperty(hook) && cb[hook]) {
            // Don't use any of additional callbacks in Meteor.subscribe
            hooks[hook] = cb[hook];
            delete cb[hook];
          }
        }
      }

      const result = {};

      const computation = this.autorun(() => {
        let args = fn();
        if (angular.isUndefined(args)) args = [];

        if (!_.isArray(args)) {
          throw Error(`reactive function's return value must be an array`);
        }

        const subscription = Meteor.subscribe(subName, ...args, cb);

        hooks.onStart();

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

    // Autoruns function except it is invoked with an extra deferred object as the
    // first argument. Returns the promise assosiated with the deferred object.
    // The promise also has a stop method which will stop the computation.
    // Originally implemented for `$$Auth.$awaitUser()`.
    $$Core.$$autoPromise = function(fn, options) {
      const deferred = this.$$defer();
      const promise = deferred.promise;

      // Note the promise is being fulfilled in the next event loop to avoid
      // nested computations, otherwise the outer computation will cancel the
      // inner one once the scope has been destroyed which will lead to subscription
      // failures. Happens mainly after resolving a route.
      deferred.resolve = this.$$afterFlush.bind(this, deferred.resolve);
      deferred.reject = this.$$afterFlush.bind(this, deferred.reject);
      fn = _.partial(fn, deferred);

      // Checks if there are some invalidate callbacks on the current computation
      const someInvalidateCallbacks = Tracker.active &&
        !!Tracker.currentComputation._onInvalidateCallbacks.length;

      // There might be a case where an invalidate callback will stop the computation in
      // which case we want to autorun the function after that callback has been invoked
      const whenAvailable = someInvalidateCallbacks ? Tracker.afterFlush : setTimeout;

      let stopped = false;
      promise.stop = () => stopped = true;

      whenAvailable(() => {
        if (stopped) return;
        const computation = this.autorun(fn, options);
        promise.stop = computation.stop.bind(computation);
      });

      return promise;
    };

    // Calls a function with the provided args after flush
    $$Core.$$afterFlush = function(fn, ...args) {
      fn = this.$bindToContext(fn);
      fn = _.partial(fn, ...args);
      return Tracker.afterFlush(fn);
    };

    // Invokes a deferred digestion
    $$Core.$$deferredDigest = function() {
      setTimeout(this.$$throttledDigest.bind(this));
    };

    // Digests scope only if there is no phase at the moment
    $$Core.$$throttledDigest = function() {
      const isDigestable = !this.$$destroyed &&
        !this.$$phase &&
        !this.$root.$$phase;

      if (isDigestable) this.$digest();
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
