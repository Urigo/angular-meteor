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
      this.callbacks = [];
    }

    attach(scope) {
      if (!this.scope && (scope.constructor || angular.noop).toString().indexOf('Scope') > -1) {
        this.scope = scope;
      }

      return this;
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
    };

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
    };

    helpers(props) {
      _.map(props, (propValue, propName) => {
        return {
          key: propName,
          value: propValue
        }
      }).sort((prop) => angular.isFunction(prop.value)).forEach((prop) => {
        if (angular.isFunction(prop.value)) {
          this.stoppables.push(Tracker.autorun((comp) => {
            let data = prop.value();

            if (this._isMeteorCursor(data)) {
              let stoppableObservation = this._handleCursor(data, prop.key);

              comp.onInvalidate(() => {
                stoppableObservation.stop();
                this.context[prop.key] = [];
              });
            }
            else {
              this._handleNonCursor(data, prop.key);
            }

            this._propertyChanged(prop.key);
          }));
        }
        else {
          let reactiveVariable = new ReactiveVar(prop.value);

          Object.defineProperty(this.context, prop.key, {
            configurable: true,
            enumerable: true,

            get: function () {
              return reactiveVariable.get();
            },
            set: function (newValue) {
              reactiveVariable.set(newValue);
            }
          });
        }
      });

      return this;
    }

    onPropertyChanged(cb) {
      this.callbacks.push(cb);
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

  return function (context) {
    let instance = new ReactiveContext(context);

    context.helpers = instance.helpers.bind(instance);
    context.attach = instance.attach.bind(instance);
    context.stop = instance.stop.bind(instance);
    context.autorun = instance.autorun.bind(instance);
    context.subscribe = instance.subscribe.bind(instance);
    context.onPropertyChanged = instance.onPropertyChanged.bind(instance);

    return instance;
  };
}]);
