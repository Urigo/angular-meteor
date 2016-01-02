angular.module('angular-meteor.reactive-scope', ['angular-meteor.reactive-context'])

.service('$$ReactiveScope', function ($rootScope, $parse, $$ReactiveContext) {
  this.helpers = function(props = {}) {
    let reactiveContext = new $$ReactiveContext(this, this);
    reactiveContext.helpers(props);
  };

  this.autorun = function(fn, options = {}) {
    if (!_.isFunction(fn))
      throw Error('argument 1 must be a function')
    if (!_.isObject(options))
      throw Error('argument 2 must be an object');

    let compution = Meteor.autorun(fn.bind(this), options);
    this._autoStop(compution);
    return compution;
  };

  this.subscribe = function(name, fn = angular.noop, cb = angular.noop) {
    if (!_.isString(name))
      throw Error('argument 1 must be a string');
    if (!_.isFunction(fn))
      throw Error('argument 2 must be a function');
    if (!_.isFunction(cb) && !_.isObject(cb))
      throw Error('argument 3 must be a function or an object');

    let result = {};

    let compution = this.autorun(() => {
      let args = fn.call(this) || [];

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

  this.getReactively = function(...args) {
    let context, k, isDeep;

    if (_.isObject(args[0]))
      [context, k, isDeep] = args;
    else
      [k, isDeep] = args;

    if (angular.isUndefined(context)) context = this;
    if (angular.isUndefined(isDeep)) isDeep = false;

    if (!_.isString(k))
      throw Error("'key' must be a string");
    if (!_.isBoolean(isDeep))
      throw Error("'isDeep' must be a boolean");

    context._dependencies = context._dependencies || {};

    if (!context._dependencies[k]) {
      context._dependencies[k] = new Tracker.Dependency();
      this._watchModel(context, k, isDeep);
    }

    context._dependencies[k].depend();
    return $parse(k)(context);
  };

  this._watchModel = function(context, k, isDeep) {
    let getVal = _.partial($parse(k), context);
    let initialVal = getVal();

    this.$watch(getVal, (val, oldVal) => {
      let hasChanged =
        val !== initialVal ||
        val !== oldVal

      if (hasChanged) context._dependencies[k].changed();
    }, isDeep);
  };

  this._autoStop = function(stoppable) {
    this.$on('$destroy', stoppable.stop.bind(stoppable));
  };
})

.run(function($rootScope, $$ReactiveScope) {
  let ScopeProto = Object.getPrototypeOf($rootScope);
  _.extend(ScopeProto, $$ReactiveScope);
});
