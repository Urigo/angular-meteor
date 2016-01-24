angular.module('angular-meteor.mixer', [])


.service('$$Mixer', function() {
  this.mixins = [];

  this.mixin = (mixin) => {
    if (!_.isObject(mixin))
      throw Error('argument 1 must be an object');

    this.mixins = _.union(this.mixins, [mixin]);
    return this;
  };

  this.mixout = (mixin) => {
    if (!_.isObject(mixin))
      throw Error('argument 1 must be an object');

    this.mixins = _.without(this.mixins, mixin);
    return this;
  };

  this.construct = (context, ...args) => {
    if (!_.isObject(context))
      throw Error('argument 1 must be an object');

    this.mixins.filter(_.isFunction).forEach((mixin) => {
      mixin.call(context, ...args);
    });

    return context;
  };

  this.extend = (Klass) => {
    if (!_.isFunction(Klass))
      throw Error('argument 1 must be a function');

    return _.extend(Klass.prototype, ...this.mixins);
  };
});