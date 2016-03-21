import _ from '../lib/underscore';

export const name = 'angular-meteor.utilities';
export const utils = '$$utils';

angular.module(name, [])

/*
  A utility service which is provided with general utility functions
 */
.service(utils, [
  '$rootScope',

  function($rootScope) {
    const self = this;

    // Checks if an object is a cursor
    this.isCursor = (obj) => {
      return obj instanceof Meteor.Collection.Cursor;
    };

    // Cheecks if an object is a scope
    this.isScope = (obj) => {
      return obj instanceof $rootScope.constructor;
    };

    // Checks if an object is a view model
    this.isViewModel = (obj) => {
      return _.isObject(obj) && obj.$$dependencies;
    };

    // Checks if two objects are siblings
    this.areSiblings = (obj1, obj2) => {
      return _.isObject(obj1) && _.isObject(obj2) &&
        Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2);
    };

    // Binds function into a scpecified context. If an object is provided, will bind every
    // value in the object which is a function. If a tap function is provided, it will be
    // called right after the function has been invoked.
    this.bind = (fn, context, tap) => {
      tap = _.isFunction(tap) ? tap : angular.noop;
      if (_.isFunction(fn)) return bindFn(fn, context, tap);
      if (_.isObject(fn)) return bindObj(fn, context, tap);
      return fn;
    };

    function bindFn(fn, context, tap) {
      return (...args) => {
        const result = fn.apply(context, args);
        tap.call(context, {
          result,
          args
        });
        return result;
      };
    }

    function bindObj(obj, context, tap) {
      return _.keys(obj).reduce((bound, k) => {
        bound[k] = self.bind(obj[k], context, tap);
        return bound;
      }, {});
    }
  }
]);
