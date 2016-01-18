angular.module('angular-meteor.reactive', [
  'angular-meteor.utils',
  'angular-meteor.mixer',
  'angular-meteor.core',
  'angular-meteor.view-model'
])


.factory('$$Reactive', [
  '$parse',
  '$$utils',

function($parse, $$utils) {
  function $$Reactive(vm = this) {
    vm.$$dependencies = {};
  }

  $$Reactive.$helpers = function(props = {}) {
    if (!_.isObject(props))
      throw Error('argument 1 must be an object');

    _.each(props, (v, k, i) => {
      if (!_.isFunction(v))
        throw Error(`helper ${i + 1} must be a function`);

      if (!this.$$vm.$$dependencies[k])
        this.$$vm.$$dependencies[k] = new Tracker.Dependency();

      this.$$setFnHelper(k, v);
    });
  };

  $$Reactive.$reactivate = function(k, isDeep = false) {
    if (!_.isString(k))
      throw Error('arguments 1 must be a string');
    if (!_.isBoolean(isDeep))
      throw Error('arguments 2 must be a boolean');

    if (!this.$$vm.$$dependencies[k]) {
      this.$$vm.$$dependencies[k] = new Tracker.Dependency();
      this.$$watchModel(k, isDeep);
    }

    this.$$vm.$$dependencies[k].depend();
    return $parse(k)(this.$$vm);
  };

  $$Reactive.$$watchModel = function(k, isDeep) {
    let getVal = _.partial($parse(k), this.$$vm);
    let initialVal = getVal();

    this.$watch(getVal, (val, oldVal) => {
      let hasChanged =
        val !== initialVal ||
        val !== oldVal

      if (hasChanged) this.$$vm.$$dependencies[k].changed();
    }, isDeep);
  };

  $$Reactive.$$setFnHelper = function(k, fn) {
    this.$autorun((computation) => {
      let model = fn.apply(this.$$vm);

      Tracker.nonreactive(() => {
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

        this.$$changed(k);
      });
    });
  };

  $$Reactive.$$setValHelper = function(k, v, watch = true) {
    if (watch) {
      let isDeep = _.isObject(v);
      this.$reactivate(k, isDeep);
    }

    Object.defineProperty(this.$$vm, k, {
      configurable: true,
      enumerable: true,

      get: () => {
        this.$$depend(k);
        return v;
      },
      set: (newVal) => {
        v = newVal;
        this.$$changed(k);
      }
    });
  };

  $$Reactive.$$handleCursor = function(k, cursor) {
    if (angular.isUndefined(this.$$vm[k])) {
      this.$$setValHelper(k, cursor.fetch(), false);
    }
    else {
      let diff = jsondiffpatch.diff(this.$$vm[k], cursor.fetch());
      jsondiffpatch.patch(this.$$vm[k], diff);
    }

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
      console.warn(`overriding '${k}' helper`);
      delete this.$$vm[k];
      v = null;
    }

    if (angular.isUndefined(v)) {
      this.$$setValHelper(k, data);
    }
    else if ($$utils.areSiblings(v, data)) {
      let diff = jsondiffpatch.diff(v, data);
      jsondiffpatch.patch(v, diff);
      this.$$changed(k);
    }
    else {
      this.$$vm[k] = data;
    }
  };

  $$Reactive.$$depend = function(k) {
    this.$$vm.$$dependencies[k].depend();
  };

  $$Reactive.$$changed = function(k) {
    this.$$throttledDigest();
    this.$$vm.$$dependencies[k].changed();
  };

  return $$Reactive;
}])


.run([
  '$$Mixer',
  '$$Reactive',

function($$Mixer, $$Reactive) {
  $$Mixer.mixin($$Reactive);
}]);
