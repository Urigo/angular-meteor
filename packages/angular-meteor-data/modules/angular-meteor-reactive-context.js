angular.module('angular-meteor.reactive-context', ['angular-meteor.reactive-scope'])

.factory('$$ReactiveContext', function($rootScope) {
  class $$ReactiveContext {
    constructor(context, $scope) {
      $scope = $scope || $rootScope.$new(true);

      if (!_.isObject(context))
        throw Error('argument 1 must be an object');
      if (!this._isScope($scope))
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
      if (_.isFunction(fn)) fn = fn.bind(this._context);

      let compution = this._scope.autorun(fn, options);
      this._stoppables.push(compution);
      return compution;
    }

    subscribe(name, fn, cb) {
      if (_.isFunction(fn)) fn = fn.bind(this._context);

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
          if (this._isCursor(model)) {
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
      else if (this._areSiblings(v, data)) {
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
      this._digest();
      this._dependencies[k].changed();
    }

    _digest() {
      let isDigestable =
        this._scope &&
        !this._scope.$$destroyed &&
        !$rootScope.$$phase

      if (isDigestable) this._scope.$digest();
    }

    _areSiblings(obj1, obj2) {
      return 
        _.isObject(obj1) && _.isObject(obj2) &&
        Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2);
    }

    _isScope(obj) {
      let Scope = Object.getPrototypeOf($rootScope).constructor;
      return obj instanceof Scope;
    }

    _isCursor(obj) {
      return obj instanceof Mongo.Collection.Cursor;
    }
  }

  return $$ReactiveContext;
})

.factory('$reactive', function($$ReactiveContext) {
  let reactiveContextAPI = ['helpers', 'autorun', 'subscribe', 'getReactively', 'stop'];

  function $reactive(context) {
    return _.extend(context, $reactive);
  }

  $reactive.attach = function($scope) {
    this._reactiveContext =
      this._reactiveContext ||
      new $$ReactiveContext(this, $scope);

    return this;
  };

  reactiveContextAPI.forEach((method) => {
    $reactive[method] = function(...args) {
      this.attach();
      return this._reactiveContext[method](...args);
    };
  });

  return $reactive;
});
