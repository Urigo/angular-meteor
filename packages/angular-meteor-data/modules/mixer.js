angular.module('angular-meteor.mixer', [])


/*
  A service which stores mixins which can be appended later on by their decleration order.
  Mainly used to extend ChildScope prototypes.
 */
.service('$Mixer', function() {
  this._mixins = [];

  // Adds a new mixin
  this.mixin = (mixin) => {
    if (!_.isObject(mixin))
      throw Error('argument 1 must be an object');

    this._mixins = _.union(this._mixins, [mixin]);
    return this;
  };

  // Removes a mixin. Useful mainly for test purposes
  this._mixout = (mixin) => {
    this._mixins = _.without(this._mixins, mixin);
    return this;
  };

  // Invoke function mixins with the provided context and arguments
  this._construct = (context, ...args) => {
    this._mixins.filter(_.isFunction).forEach((mixin) => {
      mixin.call(context, ...args);
    });

    return context;
  };

  // Extend prototype with the defined mixins
  this._extend = (Klass) => {
    return _.extend(Klass.prototype, ...this._mixins);
  };
});