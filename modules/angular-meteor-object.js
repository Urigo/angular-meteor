var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe']);

angularMeteorObject.factory('AngularMeteorObject', ['$q', '$meteorSubscribe', function($q, $meteorSubscribe) {
  var AngularMeteorObject = {};

  AngularMeteorObject.getRawObject = function () {
    var self = this;

    return angular.copy(_.omit(self, self.$$internalProps));
  };

  AngularMeteorObject.subscribe = function () {
    $meteorSubscribe.subscribe.apply(this, arguments);
    return this;
  };

  AngularMeteorObject.save = function save(docs) {
    var self = this,
      collection = self.$$collection;

    var deferred = $q.defer();

    if (self)
      if (self._id){
        var updates = docs? docs : angular.copy(_.omit(self, '_id', self.$$internalProps));
        collection.update(
          {_id: self._id},
          { $set: updates },
          function(error, numberOfDocs){
            if (error) {
              deferred.reject(error);
            } else {
              deferred.resolve(numberOfDocs);
            }
          }
        );
      }

    return deferred.promise;
  };

  AngularMeteorObject.reset = function reset() {
    var self = this,
      collection = self.$$collection,
      options = self.$$options,
      id = self.$$id;

    if (collection){
      var serverValue = collection.findOne(id, options);
      var prop;
      if (serverValue) {
        angular.extend(Object.getPrototypeOf(self), Object.getPrototypeOf(serverValue));
        for (prop in serverValue) {
          if (serverValue.hasOwnProperty(prop)) {
            self[prop] = serverValue[prop];
          }
        }
      } else {
        for (prop in _.omit(self, self.$$internalProps)) {
          delete self[prop];
        }
      }
    }
  };

  AngularMeteorObject.stop = function stop() {
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

// A list of internals properties to not watch for, nor pass to the Document on update and etc.
  AngularMeteorObject.$$internalProps = [
    'save', 'reset', '$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject',
    'collection', '_eventEmitter'
  ];

  var createAngularMeteorObject = function(collection, id, options){
    // Make data not be an object so we can extend it to preserve
    // Collection Helpers and the like
    var data = new function SubObject() {};
    angular.extend(data, collection.findOne(id, options));

    data.$$collection = collection;
    data.$$options = options;
    data.$$id = id;

    angular.extend(data, AngularMeteorObject);

    return data;
  };

  return createAngularMeteorObject;
}]);


angularMeteorObject.factory('$meteorObject', ['$rootScope', '$meteorUtils', 'AngularMeteorObject',
  function($rootScope, $meteorUtils, AngularMeteorObject) {
    return function(collection, id, auto, options) {
      // Validate parameters
      if (!collection) {
        throw new TypeError("The first argument of $meteorCollection is undefined.");
      }
      if (!angular.isFunction(collection.findOne)) {
        throw new TypeError("The first argument of $meteorCollection must be a function or a have a findOne function property.");
      }

      auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570

      var data = new AngularMeteorObject(collection, id, options);

      data.autorunComputation = $meteorUtils.autorun($rootScope, function() {
        data.reset();
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

angularMeteorObject.run(['$rootScope', '$q', '$meteorObject', '$meteorSubscribe',
  function($rootScope, $q, $meteorObject, $meteorSubscribe) {
    Object.getPrototypeOf($rootScope).$meteorObject = function() {
      var args = Array.prototype.slice.call(arguments);
      var object = $meteorObject.apply(this, args);
      var subscription = null;

      object.subscribe = function () {
        var args = Array.prototype.slice.call(arguments);
        subscription = $meteorSubscribe._subscribe(this, $q.defer(), args);
        return object;
      };

      this.$on('$destroy', function() {
        object.stop();
        if (subscription)
          subscription.stop();
	  });

      return object;
	};
  }]);
