angular.module('angular-meteor.reactive-context', [
  'angular-meteor.reactive-utils',
  'angular-meteor.reactive-scope'
])


.factory('$$ReactiveContext', [
  '$rootScope',
  '$$ReactiveUtils',

function($rootScope, utils) {
  class ReactiveContext {
    constructor(context, $scope) {
      $scope = $scope || $rootScope.$new(true);

      if (!_.isObject(context))
        throw Error('argument 1 must be an object');
      if (!utils.isScope($scope))
        throw Error('argument 2 must be a scope');

      this._stoppables = [];
      this._context = context;
      this._scope = $scope;
      this._dependencies = context._dependencies = {};
    }

    helpers(props = {}) {
      if (!_.isObject(props))
        throw Error('argument 1 must be an object');

      _.each(props, (v, k) => {
        if (!this._dependencies[k]) {
          this._dependencies[k] = new Tracker.Dependency();
        }

        if (_.isFunction(v))
          this._setFnHelper(k, v);
        else
          this._setValHelper(k, v);
      });
    }

    autorun(fn, options) {
      fn = this._bind(fn);

      let compution = this._scope.autorun(fn, options);
      this._stoppables.push(compution);
      return compution;
    }

    subscribe(name, fn, cb) {
      fn = this._bind(fn);
      cb = this._bind(cb);

      let subscription = this._scope.subscribe(name, fn, cb);
      this._stoppables.push(subscription);
      return subscription;
    }

    getReactively(...args) {
      return this._scope.getReactively(this._context, ...args);
    }

    stop() {
      _.invoke(this._stoppables, 'stop');
    }

    _setFnHelper(k, fn) {
      this.autorun((compution) => {
        let model = fn.apply(this._context);

        Tracker.nonreactive(() => {
          if (utils.isCursor(model)) {
            let observation = this._handleCursor(k, model);

            compution.onInvalidate(() => {
              observation.stop();
              this._context[k].splice(0);
            });
          }
          else {
            this._handleNonCursor(k, model);
          }

          this._changed(k);
        });
      });
    }

    _setValHelper(k, v, watch = true) {
      console.warn(
        `defining '${k}' value helper, ` +
        `note that this feature will be deprecated in 1.4 in favor of using 'getReactively' - ` +
        `http://www.angular-meteor.com/api/1.3.1/get-reactively`
      );

      if (watch) {
        let isDeep = _.isObject(v);
        this.getReactively(k, isDeep);
      }

      Object.defineProperty(this._context, k, {
        configurable: true,
        enumerable: true,

        get: () => {
          this._depend(k);
          return v;
        },
        set: (newVal) => {
          v = newVal;
          this._changed(k);
        }
      });
    }

    _handleCursor(k, cursor) {
      if (angular.isUndefined(this._context[k])) {
        this._setValHelper(k, cursor.fetch(), false);
      }
      else {
        let diff = jsondiffpatch.diff(this._context[k], cursor.fetch());
        jsondiffpatch.patch(this._context[k], diff);
      }

      let observation = cursor.observe({
        addedAt: (doc, atIndex) => {
          if (!observation) return;
          this._context[k].splice(atIndex, 0, doc);
          this._changed(k);
        },
        changedAt: (doc, oldDoc, atIndex) => {
          let diff = jsondiffpatch.diff(this._context[k][atIndex], doc);
          jsondiffpatch.patch(this._context[k][atIndex], diff);
          this._changed(k);
        },
        movedTo: (doc, fromIndex, toIndex) => {
          this._context[k].splice(fromIndex, 1);
          this._context[k].splice(toIndex, 0, doc);
          this._changed(k);
        },
        removedAt: (oldDoc, atIndex) => {
          this._context[k].splice(atIndex, 1);
          this._changed(k);
        }
      });

      return observation;
    }

    _handleNonCursor(k, data) {
      let v = this._context[k];

      if (angular.isDefined(v)) {
        console.warn(`overriding '${k} helper'`);
        delete this._context[k];
        v = null;
      }

      if (angular.isUndefined(v)) {
        return this._setValHelper(k, data);
      }
      else if (utils.areSiblings(v, data)) {
        let diff = jsondiffpatch.diff(v, data);
        jsondiffpatch.patch(v, diff);
        this._changed(k);
      }
      else {
        this._context[k] = data;
      }
    }

    _depend(k) {
      this._dependencies[k].depend();
    }

    _changed(k) {
      this._scope._throttledDigest();
      this._dependencies[k].changed();
    }

    _bind(fn) {
      return utils.bind(fn, this._context);
    }
  }

  return ReactiveContext;
}])


.factory('$reactive', [
  '$$ReactiveContext',

function(ReactiveContext) {
  let reactiveAPI = [
    'helpers',
    'autorun',
    'subscribe',
    'getReactively',
    'stop'
  ];

  function Reactive(context) {
    return _.extend(context, Reactive);
  }

  Reactive.attach = function($scope) {
    this._reactiveContext =
      this._reactiveContext ||
      new ReactiveContext(this, $scope);

    return this;
  };

  reactiveAPI.forEach((method) => {
    Reactive[method] = function(...args) {
      this.attach();
      return this._reactiveContext[method](...args);
    };
  });

  return Reactive;
}]);
