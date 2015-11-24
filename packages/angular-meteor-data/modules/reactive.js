let reactive = angular.module('angular-meteor.reactive', []);

reactive.factory('$reactive', ['$rootScope', '$parse', ($rootScope, $parse) => {
  class ReactiveContext {
    constructor(context, scope) {
      this.context = context;
      this.scope = scope;
      this.computations = [];
      this.callbacks = [];
      this.trackerDeps = {};
    }

    properties(props) {
      let isMeteorCursor = (obj) => {
        return obj instanceof Mongo.Collection.Cursor;
      };

      let handleCursor = (cursor, name) => {
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

      let handleNonCursor = (data, name) => {
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
      };

      angular.forEach(props, (func, name) => {
        this.computations.push(Tracker.autorun((comp) => {
          let data = func();

          if (isMeteorCursor(data)) {
            let stoppableObservation = handleCursor(data, name);

            comp.onInvalidate(() => {
              stoppableObservation.stop();
              this.context[name] = [];
            });
          }
          else {
            handleNonCursor(data, name);
          }

          if (this.scope && !$rootScope.$$phase) {
            this.scope.$digest();
          }

          this._propertyChanged(name);
        }));
      });

      return this;
    }

    getReactively(property, objectEquality) {
      let scope = this.scope || $rootScope;
      let getValue = $parse(property);
      objectEquality = !!objectEquality;

      if (!this.trackerDeps[property]) {
        this.trackerDeps[property] = new Tracker.Dependency();

        scope.$watch(() => getValue(this.context),
          (newVal, oldVal) => {
            if (newVal !== oldVal) {
              this.trackerDeps[property].changed();
            }
          }, objectEquality);
      }

      this.trackerDeps[property].depend();

      return getValue(this.context);
    }

    onPropertyChanged(cb) {
      this.callbacks.push(cb);
    }

    _propertyChanged(propName) {
      angular.forEach(this.callbacks, (cb) => {
        cb(propName);
      });
    }

    stop() {
      angular.forEach(this.computations, (comp) => {
        comp.stop();
      });
    }
  }

  return function (context, scope) {
    return new ReactiveContext(context, scope);
  };
}]);
