angular.module('angular-meteor.reactive-scope', [
  'angular-meteor.reactive-utils',
  'angular-meteor.reactive-context'
])


.service('$$ReactiveScope', [
  '$rootScope',
  '$parse',
  '$$ReactiveContext',
  '$$ReactiveUtils',

function($rootScope, $parse, ReactiveContext, utils) {
  this.helpers = function(props) {
    let reactiveContext = new ReactiveContext(this, this);
    reactiveContext.helpers(props);
  };

  this.autorun = function(fn, options = {}) {
    fn = this._bind(fn);

    if (!_.isFunction(fn))
      throw Error('argument 1 must be a function');
    if (!_.isObject(options))
      throw Error('argument 2 must be an object');

    let compution = Meteor.autorun(fn, options);
    this._autoStop(compution);
    return compution;
  };

  this.subscribe = function(name, fn, cb) {
    fn = this._bind(fn || angular.noop);
    cb = cb ? this._bind(cb) : angular.noop;

    if (!_.isString(name))
      throw Error('argument 1 must be a string');
    if (!_.isFunction(fn))
      throw Error('argument 2 must be a function');
    if (!_.isFunction(cb) && !_.isObject(cb))
      throw Error('argument 3 must be a function or an object');

    let result = {};

    let compution = this.autorun(() => {
      let args = fn() || [];

      if (!_.isArray(args))
        throw Error("reactive function's return value must be an array");

      let subscription = Meteor.subscribe(name, ...args, cb);
      this._autoStop(subscription);

      result.ready = subscription.ready.bind(subscription);
      result.subscriptionId  = subscription.subscriptionId;
    });

    result.stop = compution.stop.bind(compution);
    return result;
  };

  this._getReactively = function(context, k, watcher) {
    if (angular.isUndefined(context)) context = this;

    if (!_.isString(k))
      throw Error("'key' must be a string");

    context._dependencies = context._dependencies || {};

    if (!context._dependencies[k]) {
      context._dependencies[k] = new Tracker.Dependency();
      watcher.call(this, context, k);
    }

    context._dependencies[k].depend();
    return $parse(k)(context);
  };

  this.getReactively = function(...args) {
    let context, k, isDeep;

    if (_.isObject(args[0]))
      [context, k, isDeep] = args;
    else
      [k, isDeep] = args;

    if (angular.isUndefined(isDeep)) isDeep = false;

    if (!_.isBoolean(isDeep))
      throw Error("'isDeep' must be a boolean");

    return this._getReactively(context, k, (...args) => this._watchModel(...args, isDeep || false));
  };

  this.getCollectionReactively = function(...args) {
    let context, k;
    if (_.isObject(args[0]))
      [context, k] = args;
    else
      [k] = args;
    return this._getReactively(context, k, this._watchCollection);
  };

  this._watch = function(context, k, watcher) {
    let getVal = _.partial($parse(k), context);
    let initialVal = getVal();

    watcher.call(this, getVal, (val, oldVal) => {
      let hasChanged =
        val !== initialVal ||
        val !== oldVal;

      if (hasChanged) context._dependencies[k].changed();
    });
  };

  this._watchModel = function(context, k, isDeep) {
    this._watch(context, k, (...args) => this.$watch(...args, isDeep));
  };

  this._watchCollection = function(context, k) {
    this._watch(context, k, this.$watchCollection);
  };

  this._autoStop = function(stoppable) {
    this.$on('$destroy', stoppable.stop.bind(stoppable));
  };

  this._throttledDigest = function() {
    let isDigestable =
      !this.$$destroyed &&
      !$rootScope.$$phase;

    if (isDigestable) this.$digest();
  };

  this._bind = function(fn) {
    return utils.bind(fn, this, this._throttledDigest);
  };
}])


.run([
  '$rootScope',
  '$$ReactiveScope',

function($rootScope, ReactiveScope) {
  let ScopeProto = Object.getPrototypeOf($rootScope);
  _.extend(ScopeProto, ReactiveScope);
}]);
