angular.module('angular-meteor.reactive', ['angular-meteor.reactive-scope']).factory('$reactive', ['$rootScope', '$parse', ($rootScope, $parse) => {
  class ReactiveContext {
    constructor(context) {
      if (!context || !angular.isObject(context)) {
        throw new Error('[angular-meteor][ReactiveContext] The context for ReactiveContext is required and must be an object!');
      }

      this.context = context;

      if ((this.context.constructor || angular.noop).toString().indexOf('Scope') > -1) {
        this.scope = this.context;
      }

      this.stoppables = [];
      this.propertiesTrackerDeps = {};
    }

    attach(scope) {
      if (!this.scope && (scope.constructor || angular.noop).toString().indexOf('Scope') > -1) {
        this.scope = scope;
      }

      return this;
    }

    _handleCursor(cursor, name) {
      if (angular.isUndefined(this.context[name])) {
        this._declareReactiveProperty(name, cursor.fetch());
      }
      else {
        jsondiffpatch.patch(this.context[name], jsondiffpatch.diff(this.context[name], cursor.fetch()));
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
          jsondiffpatch.patch(this.context[name][atIndex], jsondiffpatch.diff(this.context[name][atIndex], doc));
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
      if (angular.isUndefined(this.context[name])) {
        this._declareReactiveProperty(name, data);
      }
      else {
        if ((!_.isObject(data) && !_.isArray(data)) ||
          (!_.isObject(this.context[name]) && !_.isArray(this.context[name]))) {
          this.context[name] = data;
        }
        else {
          jsondiffpatch.patch(this.context[name], jsondiffpatch.diff(this.context[name], data));
          this._propertyChanged(name);
        }
      }
    }

    static _isMeteorCursor(obj) {
      return obj instanceof Mongo.Collection.Cursor;
    };

    helpers(props) {
      _.chain(props).map((propValue, propName) => {
        return {
          key: propName,
          value: propValue
        }
      }).sortBy((prop, index, arr) => {
        if (angular.isFunction(prop.value)) {
          return arr.length + index;
        }
        else {
          return index;
        }
      }).forEach((prop) => {
        if (!angular.isFunction(prop.value)) {
          this._declareReactiveProperty(prop.key, prop.value);
        }
        else {
          this.stoppables.push(Tracker.autorun((comp) => {
            let data = prop.value.apply(this.context);

            Tracker.nonreactive(() => {
              if (ReactiveContext._isMeteorCursor(data)) {
                let stoppableObservation = this._handleCursor(data, prop.key);

                comp.onInvalidate(() => {
                  stoppableObservation.stop();
                });
              }
              else {
                this._handleNonCursor(data, prop.key);
              }

              this._propertyChanged(prop.key);
            });
          }));
        }
      });

      return this;
    }

    _declareReactiveProperty(name, initialValue) {
      this.propertiesTrackerDeps[name] = new Tracker.Dependency();
      let property = initialValue;
      let self = this;

      Object.defineProperty(this.context, name, {
        configurable: true,
        enumerable: true,

        get: function () {
          self.propertiesTrackerDeps[name].depend();
          return property;
        },
        set: function (newValue) {
          property = newValue;
          self.propertiesTrackerDeps[name].changed();
        }
      });
    }

    _propertyChanged(propName) {
      if (this.scope && !$rootScope.$$phase) {
        this.scope.$digest();
      }

      this.propertiesTrackerDeps[propName].changed();
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

  return function (context) {
    let instance = new ReactiveContext(context);

    context.helpers = instance.helpers.bind(instance);
    context.attach = instance.attach.bind(instance);
    context.stop = instance.stop.bind(instance);
    context.autorun = instance.autorun.bind(instance);
    context.subscribe = instance.subscribe.bind(instance);

    return instance;
  };
}]);
