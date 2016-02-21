export const name = 'angular-meteor.mixer';
export const Mixer = '$Mixer';

angular.module(name, [])

/*
  A service which lets us apply mixins into Scope.prototype.
  The flow is simple. Once we define a mixin, it will be stored in the `$Mixer`,
  and any time a `ChildScope` prototype is created
  it will be extended by the `$Mixer`.
  This concept is good because it keeps our code
  clean and simple, and easy to extend.
  So any time we would like to define a new behaviour to our scope,
  we will just use the `$Mixer` service.
 */
.service(Mixer, function() {
  this._mixins = [];
  // Apply mixins automatically on specified contexts
  this._autoExtend = [];
  this._autoConstruct = [];

  // Adds a new mixin
  this.mixin = (mixin) => {
    if (!_.isObject(mixin)) {
      throw Error('argument 1 must be an object');
    }

    this._mixins = _.union(this._mixins, [mixin]);
    // Apply mixins to stored contexts
    this._autoExtend.forEach(context => this._extend(context));
    this._autoConstruct.forEach(context => this._construct(context));
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
  this._extend = (obj) => {
    return _.extend(obj, ...this._mixins);
  };
});
