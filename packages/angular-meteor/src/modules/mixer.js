import _ from '../lib/underscore';

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
  // Used to store method's caller
  let caller;

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
  this._extend = (obj, options) => {
    const { pattern, context } = _.defaults({}, options, {
      pattern: /.*/, // The patterns of the keys which will be filtered
    });

    const mixins = this._mixins.map((mixin) => {
      // Filtering the keys by the specified pattern
      const keys = _.keys(mixin)
        .filter(k => k.match(pattern))
        .filter(k => _.isFunction(mixin[k]));

      return keys.reduce((boundMixin, methodName) => {
        const methodHandler = mixin[methodName];

        // Note that this is not an arrow function so we can conserve the conetxt
        boundMixin[methodName] = function(...args) {
          // Storing original caller so we will know who actually called the
          // method event though it is bound to another context
          const methodContext = context || this;
          const recentCaller = caller;
          caller = this;

          try {
            return methodHandler.apply(methodContext, args);
          }
          finally {
            // No matter what happens, restore variable to the previous one
            caller = recentCaller;
          }
        };

        return boundMixin;
      }, {});
    });

    return _.extend(obj, ...mixins);
  };

  // Caller property can not be set
  Object.defineProperty(this, 'caller', {
    configurable: true,
    enumerable: true,

    get: () => {
      return caller;
    }
  });
});
