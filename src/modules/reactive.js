import { name as utilsName, utils } from './utils';
import { name as mixerName, Mixer } from './mixer';
import { name as coreName } from './core';
import { name as viewModelName } from './view-model';

export const name = 'angular-meteor.reactive';
export const Reactive = '$$Reactive';

angular.module(name, [
  utilsName,
  mixerName,
  coreName,
  viewModelName
])


/*
  A mixin which enhance our reactive abilities by providing methods
  that are capable of updating our scope reactively.
 */
.factory(Reactive, [
  '$parse',
  utils,
  Mixer,

  function($parse, $$utils, $Mixer) {
    function $$Reactive(vm = this) {
      // Helps us track changes made in the view model
      vm.$$dependencies = {};
    }

    // Gets an object containing functions and define their results as reactive properties.
    // Once a return value has been changed the property will be reset.
    $$Reactive.helpers = function(vm, props) {
      if ($$utils.isViewModel(vm)) {
        if (!_.isObject(props)) {
          throw Error('argument 2 must be an object');
        }
      }
      else {
        props = vm;
        vm = $Mixer.caller;

        if (!_.isObject(props)) {
          throw Error('argument 1 must be an object');
        }
      }

      _.each(props, (v, k) => {
        if (!_.isFunction(v)) {
          throw Error(`helper '${k}' must be a function`);
        }
      });

      _.each(props, (v, k) => {
        if (!vm.$$dependencies[k]) {
        // Registers a new dependency to the specified helper
          vm.$$dependencies[k] = new Tracker.Dependency();
        }

        this.$$setFnHelper(vm, k, v);
      });
    };

    // Gets a model reactively
    $$Reactive.getReactively = function(vm, k, isDeep) {
      if ($$utils.isViewModel(vm)) {
        if (angular.isUndefined(isDeep)) isDeep = false;

        if (!_.isString(k)) {
          throw Error('argument 2 must be a string');
        }
        if (!_.isBoolean(isDeep)) {
          throw Error('argument 3 must be a boolean');
        }
      }
      else {
        isDeep = angular.isDefined(k) ? k : false;
        k = vm;
        vm = $Mixer.caller;

        if (!_.isString(k)) {
          throw Error('argument 1 must be a string');
        }
        if (!_.isBoolean(isDeep)) {
          throw Error('argument 2 must be a boolean');
        }
      }

      return this.$$reactivateEntity(vm, k, this.$watch, isDeep);
    };

    // Gets a collection reactively
    $$Reactive.getCollectionReactively = function(vm, k) {
      if ($$utils.isViewModel(vm)) {
        if (!_.isString(k)) {
          throw Error('argument 2 must be a string');
        }
      }
      else {
        k = vm;
        vm = $Mixer.caller;

        if (!_.isString(k)) {
          throw Error('argument 1 must be a string');
        }
      }

      return this.$$reactivateEntity(vm, k, this.$watchCollection);
    };

    // Gets an entity reactively, and once it has been changed the computation will be recomputed
    $$Reactive.$$reactivateEntity = function(vm, k, watcher, ...watcherArgs) {
      if (!vm.$$dependencies[k]) {
        vm.$$dependencies[k] = new Tracker.Dependency();
        this.$$watchEntity(vm, k, watcher, ...watcherArgs);
      }

      vm.$$dependencies[k].depend();
      return $parse(k)(vm);
    };

    // Watches for changes in the view model, and if so will notify a change
    $$Reactive.$$watchEntity = function(vm, k, watcher, ...watcherArgs) {
      // Gets a deep property from the caller
      const getVal = _.partial($parse(k), vm);
      const initialVal = getVal();

      // Watches for changes in the view model
      watcher.call(this, getVal, (val, oldVal) => {
        const hasChanged =
          val !== initialVal ||
          val !== oldVal;

        // Notify if a change has been detected
        if (hasChanged) this.$$changed(vm, k);
      }, ...watcherArgs);
    };

    // Invokes a function and sets the return value as a property
    $$Reactive.$$setFnHelper = function(vm, k, fn) {
      this.autorun((computation) => {
        // Invokes the reactive functon
        const model = fn.apply(vm);

        // Ignore notifications made by the following handler
        Tracker.nonreactive(() => {
          // If a cursor, observe its changes and update acoordingly
          if ($$utils.isCursor(model)) {
            const observation = this.$$handleCursor(vm, k, model);

            computation.onInvalidate(() => {
              observation.stop();
              vm[k].splice(0);
            });
          } else {
            this.$$handleNonCursor(vm, k, model);
          }

          // Notify change and update the view model
          this.$$changed(vm, k);
        });
      });
    };

    // Sets a value helper as a setter and a getter which will notify computations once used
    $$Reactive.$$setValHelper = function(vm, k, v, watch = true) {
      // If set, reactives property
      if (watch) {
        const isDeep = _.isObject(v);
        this.getReactively(vm, k, isDeep);
      }

      Object.defineProperty(vm, k, {
        configurable: true,
        enumerable: true,

        get: () => {
          return v;
        },
        set: (newVal) => {
          v = newVal;
          this.$$changed(vm, k);
        }
      });
    };

    // Fetching a cursor and updates properties once the result set has been changed
    $$Reactive.$$handleCursor = function(vm, k, cursor) {
      // If not defined set it
      if (angular.isUndefined(vm[k])) {
        this.$$setValHelper(vm, k, cursor.fetch(), false);
      }
      // If defined update it
      else {
        const diff = jsondiffpatch.diff(vm[k], cursor.fetch());
        jsondiffpatch.patch(vm[k], diff);
      }

      // Observe changes made in the result set
      const observation = cursor.observe({
        addedAt: (doc, atIndex) => {
          if (!observation) return;
          vm[k].splice(atIndex, 0, doc);
          this.$$changed(vm, k);
        },
        changedAt: (doc, oldDoc, atIndex) => {
          const diff = jsondiffpatch.diff(vm[k][atIndex], doc);
          jsondiffpatch.patch(vm[k][atIndex], diff);
          this.$$changed(vm, k);
        },
        movedTo: (doc, fromIndex, toIndex) => {
          vm[k].splice(fromIndex, 1);
          vm[k].splice(toIndex, 0, doc);
          this.$$changed(vm, k);
        },
        removedAt: (oldDoc, atIndex) => {
          vm[k].splice(atIndex, 1);
          this.$$changed(vm, k);
        }
      });

      return observation;
    };

    $$Reactive.$$handleNonCursor = function(vm, k, data) {
      let v = vm[k];

      if (angular.isDefined(v)) {
        delete vm[k];
        v = null;
      }

      if (angular.isUndefined(v)) {
        this.$$setValHelper(vm, k, data);
      }
      // Update property if the new value is from the same type
      else if ($$utils.areSiblings(v, data)) {
        const diff = jsondiffpatch.diff(v, data);
        jsondiffpatch.patch(v, diff);
        this.$$changed(vm, k);
      } else {
        vm[k] = data;
      }
    };

    // Notifies dependency in view model
    $$Reactive.$$depend = function(vm, k) {
      vm.$$dependencies[k].depend();
    };

    // Notifies change in view model
    $$Reactive.$$changed = function(vm, k) {
      this.$$throttledDigest();
      vm.$$dependencies[k].changed();
    };

    return $$Reactive;
  }
]);
