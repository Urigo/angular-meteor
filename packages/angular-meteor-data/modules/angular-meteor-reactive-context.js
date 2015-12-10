angular.module('angular-meteor.reactive', ['angular-meteor.reactive-scope']).factory('$reactive', ['$rootScope', '$parse', ($rootScope, $parse) => {
  class ReactiveContext {
    constructor(context) {
      if (!context || !angular.isObject(context)) {
        throw new Error('[angular-meteor][ReactiveContext] The context for ReactiveContext is required and must be an object!');
      }

      this.context = context;

      if (this._isScope(this.context)) {
        this.scope = this.context;
      }

      this.stoppables = [];
      this.propertiesTrackerDeps = {};
    }

    attach(scope) {
      if (!this.scope && this._isScope(scope)) {
        this.scope = scope;
      }

      return this;
    }

    _isScope(obj) {
      return obj instanceof Object.getPrototypeOf($rootScope).constructor;
    }

    _handleCursor(cursor, name) {
      if (angular.isUndefined(this.context[name])) {
        this._setValHelper(name, cursor.fetch());
      }
      else {
        let diff = jsondiffpatch.diff(this.context[name], cursor.fetch());
        jsondiffpatch.patch(this.context[name], diff);
      }

      let initial = true;
      let handle = cursor.observe({
        addedAt: (doc, atIndex) => {
          if (!initial) {
            this.context[name].splice(atIndex, 0, doc);
            this._propertyChanged(name);
          }
        },
        changedAt: (doc, oldDoc, atIndex) => {
          let diff = jsondiffpatch.diff(this.context[name][atIndex], doc);
          jsondiffpatch.patch(this.context[name][atIndex], diff);
          this._propertyChanged(name);
        },
        movedTo: (doc, fromIndex, toIndex) => {
          this.context[name].splice(fromIndex, 1);
          this.context[name].splice(toIndex, 0, doc);
          this._propertyChanged(name);
        },
        removedAt: (oldDoc, atIndex) => {
          this.context[name].splice(atIndex, 1);
          this._propertyChanged(name);
        }
      });
      initial = false;

      return handle;
    };

    _handleNonCursor(data, name) {
      if (angular.isUndefined(this.propertiesTrackerDeps[name]) && angular.isDefined(this.context[name])) {
        console.warn(`[angular-meteor][ReactiveContext] Your tried to create helper named '${name}' on your context, but there's already property with that name - angular-meteor will override it!`);

        this.context[name] = undefined;
      }

      if (angular.isUndefined(this.context[name])) {
        this._setValHelper(name, data);
      }
      else {
        if ((!_.isObject(data) && !_.isArray(data)) ||
          (!_.isObject(this.context[name]) && !_.isArray(this.context[name]))) {
          this.context[name] = data;
        }
        else {
          let diff = jsondiffpatch.diff(this.context[name], data)
          jsondiffpatch.patch(this.context[name], diff);
          this._propertyChanged(name);
        }
      }
    }

    helpers(props) {
      _.each(props, (v, k) => {
        if (_.isFunction(v))
          this._setFnHelper(k, v);
        else
          this._setValHelper(k, v);
      });

      return this;
    }

    _setValHelper(k, v) {
      this.propertiesTrackerDeps[k] = new Tracker.Dependency();
      v = _.clone(v);

      Object.defineProperty(this.context, k, {
        configurable: true,
        enumerable: true,

        get: () => {
          this.propertiesTrackerDeps[k].depend();
          return v;
        },
        set: (newValue) => {
          v = newValue;
          this.propertiesTrackerDeps[k].changed();
        }
      });
    }

    _setFnHelper(k, fn) {
      this.stoppables.push(Tracker.autorun((comp) => {
        let data = fn.apply(this.context);

        Tracker.nonreactive(() => {
          if (this._isMeteorCursor(data)) {
            let stoppableObservation = this._handleCursor(data, k);

            comp.onInvalidate(() => {
              stoppableObservation.stop();
              // empty set once cursor is invalidated
              this.context[k].splice(0);
            });
          }
          else {
            this._handleNonCursor(data, k);
          }

          this._propertyChanged(k);
        });
      }));
    }

    _isMeteorCursor(obj) {
      return obj instanceof Mongo.Collection.Cursor;
    }

    _propertyChanged(k) {
      if (this.scope && !$rootScope.$$phase) {
        this.scope.$digest();
      }

      this.propertiesTrackerDeps[k].changed();
    }

    subscribe(name, fn) {
      fn = fn || angular.noop;

      if (this.scope && this.scope !== this.context) {
        this.stoppables.push(this.scope.subscribe(name, fn));
      }
      else {
        this.autorun(() => {
          let args = fn() || [];
          this.stoppables.push(Meteor.subscribe(name, ...args));
        });
      }

      return this;
    }

    autorun(fn) {
      if (this.scope && this.scope !== this.context) {
        this.scope.autorun(fn);
      }
      else {
        this.stoppables.push(Meteor.autorun(fn));
      }

      return this;
    }

    stop() {
      angular.forEach(this.stoppables, (stoppable) => {
        stoppable.stop();
      });

      this.stoppables = [];

      return this;
    }
  }

  return function(context) {
    let reactiveContext = new ReactiveContext(context);

    // manipulates the original context so it could access reactive methods
    _.keys(ReactiveContext.prototype)
      .filter((k) => k.charAt(0) != '_')
      .forEach((k) => context[k] = reactiveContext[k].bind(reactiveContext));

    return reactiveContext;
  };
}]);
