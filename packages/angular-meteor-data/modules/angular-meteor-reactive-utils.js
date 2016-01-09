angular.module('angular-meteor.reactive-utils', [])


.service('$$ReactiveUtils', [
  '$rootScope', 

function($rootScope) {
  this.isCursor = (obj) => {
    return obj instanceof Meteor.Collection.Cursor;
  };

  this.isScope = (obj) => {
    let Scope = Object.getPrototypeOf($rootScope).constructor;
    return obj instanceof Scope;
  };

  this.areSiblings = (obj1, obj2) => {
    return _.isObject(obj1) && _.isObject(obj2) &&
      Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2);
  };

  this.bind = (fn, context, tap = angular.noop) => {
    if (_.isFunction(fn)) return this._bindFn(fn, context, tap);
    if (_.isObject(fn)) return this._bindObj(fn, context, tap);
    return fn;
  };

  this._bindFn = (fn, context, tap) => {
    return (...args) => {
      let result = fn.apply(context, args);
      tap.call(context, {result, args});
      return result;
    };
  };

  this._bindObj = (obj, context, tap) => {
    return _.keys(obj).reduce((bound, k) => {
      bound[k] = this.bind(obj[k], context, tap);
      return bound;
    }, {});
  };
}]);
