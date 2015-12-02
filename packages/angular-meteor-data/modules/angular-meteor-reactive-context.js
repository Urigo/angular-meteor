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
      this.callbacks = [];
    }

    attach(scope) {
      if (!this.scope && this._isScope(scope)) {
        this.scope = scope;
      }

      return this;
    }

    _isScope(obj) {
      return obj instanceof $rootScope.constructor;
    }

    _handleCursor(cursor, name) {
      if (angular.isUndefined(this.context[name])) {
        this.context[name] = [];
      }

      return cursor.observe({
        addedAt: (doc, atIndex) => {
          this.context[name].splice(atIndex, 0, doc);
          this._propertyChanged(name);
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
    }

    _handleNonCursor(data, name) {
      if (angular.isUndefined(this.context[name])) {
        this.context[name] = angular.copy(data);
      }
      else {
        if ((!_.isObject(data) && !_.isArray(data)) ||
          (!_.isObject(this.context[name]) && !_.isArray(this.context[name]))) {
          this.context[name] = data;
        }
        else {
          jsondiffpatch.patch(this.context[name], jsondiffpatch.diff(this.context[name], data));
        }
      }
    }

    _isMeteorCursor(obj) {
      return obj instanceof Mongo.Collection.Cursor;
    }

    helpers(props) {
      let fns = {};
      let vals = {};

      _.each(props, (v, k) => {
        if (_.isFunction(v))
          fns[k] = v;
        else
          vals[k] = v;
      });

      // note that function helpers are set before variable helpers
      _.each(fns, this._setFnHelper.bind(this));
      _.each(vals, this._setValHelper.bind(this));

      return this;
    }

    _setFnHelper(fn, k) {
      this.stoppables.push(Tracker.autorun((comp) => {
        let data = fn();

        if (this._isMeteorCursor(data)) {
          let stoppableObservation = this._handleCursor(data, k);

          comp.onInvalidate(() => {
            stoppableObservation.stop();
            this.context[k] = [];
          });
        }
        else {
          this._handleNonCursor(data, k);
        }

        this._propertyChanged(k);
      }));
    }

    _setValHelper(v, k) {
      let reactiveVar = new ReactiveVar(v);

      Object.defineProperty(this.context, k, {
        configurable: true,
        enumerable: true,

        get: function () {
          return reactiveVar.get();
        },
        set: function (newValue) {
          reactiveVar.set(newValue);
        }
      });
    }

    onPropertyChanged(cb) {
      this.callbacks.push(cb);
    }

    offPropertyChanged(cb) {
      this.callbacks = _.without(this.callbacks, cb);
    }

    _propertyChanged(propName) {
      if (this.scope && !$rootScope.$$phase) {
        this.scope.$digest();
      }

      angular.forEach(this.callbacks, (cb) => {
        cb(propName);
      });
    }

    subscribe(name, fn) {
      fn = fn || angular.noop;

      if (this.scope) {
        this.stoppables.push(this.scope.subscribe(name, fn));
      }
      else {
        this.autorun(() => {
          this.stoppables.push(Meteor.subscribe(name, ...(fn() || [])));
        });
      }

      return this;
    }

    autorun(fn) {
      if (this.scope) {
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

  return (context) => {
    let reactiveContext = new ReactiveContext(context);

    // manipulates the original context so it could access reactive methods
    _.keys(ReactiveContext.prototype)
      .filter((k) => k.charAt(0) != '_')
      .forEach((k) => context[k] = reactiveContext[k].bind(reactiveContext));

    return reactiveContext;
  };
}]);
