angular.module('angular-meteor.reactive', [
  'angular-meteor.utilities',
  'angular-meteor.mixer',
  'angular-meteor.core',
  'angular-meteor.view-model'
])


/*
  A mixin which enhance our reactive abilities by providing methods that are capable of updating
  our scope reactively.
 */
.factory('$$Reactive', [
  '$parse',
  '$$utils',
  '$angularMeteorSettings',

function($parse, $$utils, $angularMeteorSettings) {
  function $$Reactive(vm = this) {
    // Helps us track changes made in the view model
    vm.$$dependencies = {};
  }

  // Gets an object containing functions and define their results as reactive properties.
  // Once a return value has been changed the property will be reset.
  $$Reactive.helpers = function(props = {}) {
    if (!_.isObject(props))
      throw Error('argument 1 must be an object');

    _.each(props, (v, k, i) => {
      if (!_.isFunction(v))
        throw Error(`helper ${i + 1} must be a function`);

      if (!this.$$vm.$$dependencies[k])
        // Registers a new dependency to the specified helper
        this.$$vm.$$dependencies[k] = new Tracker.Dependency();

      this.$$setFnHelper(k, v);
    });
  };

  // Gets a model reactively
  $$Reactive.getReactively = function(k, isDeep = false) {
    if (!_.isBoolean(isDeep))
      throw Error('argument 2 must be a boolean');

    return this.$$reactivateEntity(k, this.$watch, isDeep);
  };

  // Gets a collection reactively
  $$Reactive.getCollectionReactively = function(k) {
    return this.$$reactivateEntity(k, this.$watchCollection);
  };

  // Gets an entity reactively, and once it has been changed the computation will be recomputed
  $$Reactive.$$reactivateEntity = function(k, watcher, ...watcherArgs) {
    if (!_.isString(k))
      throw Error('argument 1 must be a string');

    if (!this.$$vm.$$dependencies[k]) {
      this.$$vm.$$dependencies[k] = new Tracker.Dependency();
      this.$$watchEntity(k, watcher, ...watcherArgs);
    }

    this.$$vm.$$dependencies[k].depend();
    return $parse(k)(this.$$vm);
  };

  // Watches for changes in the view model, and if so will notify a change
  $$Reactive.$$watchEntity = function(k, watcher, ...watcherArgs) {
    // Gets a deep property from the view model
    let getVal = _.partial($parse(k), this.$$vm);
    let initialVal = getVal();

    // Watches for changes in the view model
    watcher.call(this, getVal, (val, oldVal) => {
      let hasChanged =
        val !== initialVal ||
        val !== oldVal;

      // Notify if a change has been detected
      if (hasChanged) this.$$changed(k);
    }, ...watcherArgs);
  };

  // Invokes a function and sets the return value as a property
  $$Reactive.$$setFnHelper = function(k, fn) {
    this.autorun((computation) => {
      // Invokes the reactive functon
      let model = fn.apply(this.$$vm);

      // Ignore notifications made by the following handler
      Tracker.nonreactive(() => {
        // If a cursor, observe its changes and update acoordingly
        if ($$utils.isCursor(model)) {
          let observation = this.$$handleCursor(k, model);

          computation.onInvalidate(() => {
            observation.stop();
            this.$$vm[k].splice(0);
          });
        }
        else {
          this.$$handleNonCursor(k, model);
        }

        // Notify change and update the view model
        this.$$changed(k);
      });
    });
  };

  // Sets a value helper as a setter and a getter which will notify computations once used
  $$Reactive.$$setValHelper = function(k, v, watch = true) {
    // If set, reactives property
    if (watch) {
      let isDeep = _.isObject(v);
      this.getReactively(k, isDeep);
    }

    Object.defineProperty(this.$$vm, k, {
      configurable: true,
      enumerable: true,

      get: () => {
        return v;
      },
      set: (newVal) => {
        v = newVal;
        this.$$changed(k);
      }
    });
  };

  // Fetching a cursor and updates properties once the result set has been changed
  $$Reactive.$$handleCursor = function(k, cursor) {
    // If not defined set it
    if (angular.isUndefined(this.$$vm[k])) {
      this.$$setValHelper(k, cursor.fetch(), false);
    }
    // If defined update it
    else {
      let diff = jsondiffpatch.diff(this.$$vm[k], cursor.fetch());
      jsondiffpatch.patch(this.$$vm[k], diff);
    }

    // Observe changes made in the result set
    let observation = cursor.observe({
      addedAt: (doc, atIndex) => {
        if (!observation) return;
        this.$$vm[k].splice(atIndex, 0, doc);
        this.$$changed(k);
      },
      changedAt: (doc, oldDoc, atIndex) => {
        let diff = jsondiffpatch.diff(this.$$vm[k][atIndex], doc);
        jsondiffpatch.patch(this.$$vm[k][atIndex], diff);
        this.$$changed(k);
      },
      movedTo: (doc, fromIndex, toIndex) => {
        this.$$vm[k].splice(fromIndex, 1);
        this.$$vm[k].splice(toIndex, 0, doc);
        this.$$changed(k);
      },
      removedAt: (oldDoc, atIndex) => {
        this.$$vm[k].splice(atIndex, 1);
        this.$$changed(k);
      }
    });

    return observation;
  };

  $$Reactive.$$handleNonCursor = function(k, data) {
    let v = this.$$vm[k];

    if (angular.isDefined(v)) {
      delete this.$$vm[k];
      v = null;
    }

    if (angular.isUndefined(v)) {
      this.$$setValHelper(k, data);
    }
    // Update property if the new value is from the same type
    else if ($$utils.areSiblings(v, data)) {
      let diff = jsondiffpatch.diff(v, data);
      jsondiffpatch.patch(v, diff);
      this.$$changed(k);
    }
    else {
      this.$$vm[k] = data;
    }
  };

  // Notifies dependency in view model
  $$Reactive.$$depend = function(k) {
    this.$$vm.$$dependencies[k].depend();
  };

  // Notifies change in view model
  $$Reactive.$$changed = function(k) {
    this.$$throttledDigest();
    this.$$vm.$$dependencies[k].changed();
  };

  return $$Reactive;
}]);
