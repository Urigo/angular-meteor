angular.module('angular-meteor.core', [
  'angular-meteor.utilities',
  'angular-meteor.mixer'
])


/*
  A mixin which provides us with core Meteor functions.
 */
.factory('$$Core', [
  '$q',
  '$$utils',

function($q, $$utils) {
  function $$Core() {}

  // Calls Meteor.autorun() which will be digested after each run and automatically destroyed
  $$Core.autorun = function(fn, options = {}) {
    fn = this.$bindToContext(fn);

    if (!_.isFunction(fn))
      throw Error('argument 1 must be a function');
    if (!_.isObject(options))
      throw Error('argument 2 must be an object');

    let computation = Tracker.autorun(fn, options);
    this.$$autoStop(computation);
    return computation;
  };

  // Calls Meteor.subscribe() which will be digested after each invokation and automatically destroyed
  $$Core.subscribe = function(name, fn, cb) {
    fn = this.$bindToContext(fn || angular.noop);
    cb = cb ? this.$bindToContext(cb) : angular.noop;

    if (!_.isString(name))
      throw Error('argument 1 must be a string');
    if (!_.isFunction(fn))
      throw Error('argument 2 must be a function');
    if (!_.isFunction(cb) && !_.isObject(cb))
      throw Error('argument 3 must be a function or an object');

    let result = {};

    let computation = this.autorun(() => {
      let args = fn();
      if (angular.isUndefined(args)) args = [];

      if (!_.isArray(args))
        throw Error("reactive function's return value must be an array");

      let subscription = Meteor.subscribe(name, ...args, cb);
      result.ready = subscription.ready.bind(subscription);
      result.subscriptionId  = subscription.subscriptionId;
    });

    // Once the computation has been stopped, any subscriptions made inside will be stopped as well
    result.stop = computation.stop.bind(computation);
    return result;
  };

  // Calls Meteor.call() wrapped by a digestion cycle
  $$Core.callMethod = function(...args) {
    let fn = args.pop();
    if (_.isFunction(fn)) fn = this.$bindToContext(fn);
    return Meteor.call(...args, fn);
  };

  // Calls Meteor.apply() wrapped by a digestion cycle
  $$Core.applyMethod = function(...args) {
    let fn = args.pop();
    if (_.isFunction(fn)) fn = this.$bindToContext(fn);
    return Meteor.apply(...args, fn);
  };

  $$Core.$$autoStop = function(stoppable) {
    this.$on('$destroy', stoppable.stop.bind(stoppable));
  };

  // Digests scope only if there is no phase at the moment
  $$Core.$$throttledDigest = function() {
    let isDigestable =
      !this.$$destroyed &&
      !this.$$phase &&
      !this.$root.$$phase;

    if (isDigestable) this.$digest();
  };

  // Creates a promise only that the digestion cycle will be called at its fulfillment
  $$Core.$$defer = function() {
    let deferred = $q.defer();
    // Once promise has been fulfilled, digest
    deferred.promise = deferred.promise.finally(this.$$throttledDigest.bind(this));
    return deferred;
  };

  // Binds an object or a function to the scope to the view model and digest it once it is invoked
  $$Core.$bindToContext = function(fn) {
    return $$utils.bind(fn, this, this.$$throttledDigest.bind(this));
  };

  return $$Core;
}]);
