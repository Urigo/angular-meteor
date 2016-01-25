angular.module('angular-meteor.mixer', [])


/*
  A service which stores mixins which can be appended later on by their decleration order.
  Mainly used to extend ChildScope prototypes.
 */
.service('$$Mixer', function() {
  this.mixins = [];

  // Adds a new mixin
  this.mixin = (mixin) => {
    if (!_.isObject(mixin))
      throw Error('argument 1 must be an object');

    this.mixins = _.union(this.mixins, [mixin]);
    return this;
  };

  // Removes a mixin. Useful mainly for test purposes
  this.mixout = (mixin) => {
    if (!_.isObject(mixin))
      throw Error('argument 1 must be an object');

    this.mixins = _.without(this.mixins, mixin);
    return this;
  };

  // Invoke function mixins with the provided context and arguments
  this.construct = (context, ...args) => {
    if (!_.isObject(context))
      throw Error('argument 1 must be an object');

    this.mixins.filter(_.isFunction).forEach((mixin) => {
      mixin.call(context, ...args);
    });

    return context;
  };

  // Extend prototype with the defined mixins
  this.extend = (Klass) => {
    if (!_.isFunction(Klass))
      throw Error('argument 1 must be a function');

    return _.extend(Klass.prototype, ...this.mixins);
  };
});