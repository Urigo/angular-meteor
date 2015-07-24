var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe']);

angularMeteorObject.factory('AngularMeteorObject', ['$q', '$meteorSubscribe', function($q, $meteorSubscribe) {
  // A list of internals properties to not watch for, nor pass to the Document on update and etc.
  AngularMeteorObject.$$internalProps = [
    'save', 'reset', '$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject',
    'collection', '_eventEmitter', '_serverBackup'
  ];

  function AngularMeteorObject (collection, id, options){
    // Make data not be an object so we can extend it to preserve
    // Collection Helpers and the like
    var data = new function SubObject() {};
    var doc = collection.findOne(id, options);
    angular.extend(data, doc);
    angular.extend(data, AngularMeteorObject);

    data._serverBackup = doc || {};
    data.$$collection = collection;
    data.$$options = options;
    data.$$id = id;

    return data;
  }

  AngularMeteorObject.getRawObject = function () {
    var self = this;
    return angular.copy(_.omit(self, self.$$internalProps));
  };

  AngularMeteorObject.subscribe = function () {
    $meteorSubscribe.subscribe.apply(this, arguments);
    return this;
  };

  AngularMeteorObject.save = function(docs) {
    var updates = docs || this.getRawObject();
    return this.$$collection.upsertObject(updates);
  };

  AngularMeteorObject.reset = function(keepClientProps) {
    var self = this,
      collection = self.$$collection,
      options = self.$$options,
      id = self.$$id;

    if (collection){
      var serverValue = collection.findOne(id, options);
      var prop;
      var props;
      if (serverValue) {
        angular.extend(Object.getPrototypeOf(self), Object.getPrototypeOf(serverValue));
        for (prop in serverValue) {
          if (serverValue.hasOwnProperty(prop)) {
            self[prop] = serverValue[prop];
            self._serverBackup[prop] = serverValue[prop];
          }
        }

        if (keepClientProps) {
          props = _.intersection(_.keys(self), _.keys(self._serverBackup));
        } else {
          props = _.keys(self);
        }
        var serverProps = _.keys(serverValue);
        var removedKeys = _.difference(props, serverProps, self.$$internalProps);
        _.each(removedKeys, function (prop) {
          delete self[prop];
          delete self._serverBackup[prop];
        });
      } else {
        for (prop in _.omit(self, self.$$internalProps)) {
          delete self[prop];
        }
        self._serverBackup = {};
      }
    }
  };

  AngularMeteorObject.stop = function () {
    if (this.unregisterAutoDestroy) {
      this.unregisterAutoDestroy();
    }
    this.unregisterAutoDestroy = null;

    if (this.unregisterAutoBind) {
      this.unregisterAutoBind();
    }
    this.unregisterAutoBind = null;

    if (this.autorunComputation && this.autorunComputation.stop) {
      this.autorunComputation.stop();
    }
    this.autorunComputation = null;
  };

  return AngularMeteorObject;
}]);


angularMeteorObject.factory('$meteorObject', ['$rootScope', '$meteorUtils', 'AngularMeteorObject',
  function($rootScope, $meteorUtils, AngularMeteorObject) {
    return function(collection, id, auto, options) {
      // Validate parameters
      if (!collection) {
        throw new TypeError("The first argument of $meteorObject is undefined.");
      }
      if (!angular.isFunction(collection.findOne)) {
        throw new TypeError("The first argument of $meteorObject must be a function or a have a findOne function property.");
      }

      auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570

      var data = new AngularMeteorObject(collection, id, options);

      data.autorunComputation = $meteorUtils.autorun($rootScope, function() {
        data.reset(true);
      });

      if (auto) { // Deep watches the model and performs autobind.
        data.unregisterAutoBind = $rootScope.$watch(function(){
          return _.omit(data, data.$$internalProps);
        }, function (newItem, oldItem) {
          if (newItem !== oldItem && newItem) {
            var newItemId = newItem._id;
            if (newItemId && !_.isEmpty(newItem = _.omit(angular.copy(newItem), '_id'))) {
              collection.update({_id: newItemId}, {$set: newItem});
            }
          }
        }, true);
      }

      data.unregisterAutoDestroy = $rootScope.$on('$destroy', function() {
        if (data && data.stop) {
          data.stop();
        }
        data = undefined;
      });

      return data;
    };
}]);

angularMeteorObject.run(['$rootScope', '$meteorObject', '$meteorStopper',
  function ($rootScope, $meteorObject, $meteorStopper) {
    var scopeProto = Object.getPrototypeOf($rootScope);
    scopeProto.$meteorObject = $meteorStopper($meteorObject);
}]);
