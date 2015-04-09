var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe']);

angularMeteorObject.factory('AngularMeteorObject', ['$q', '$meteorSubscribe', function($q, $meteorSubscribe) {
  var AngularMeteorObject = function (collection, id, options) {
    var self = collection.findOne(id, options);

    if (!self){
      self = {};
    }

    self.__proto__ = AngularMeteorObject.prototype;
    self.$$collection = collection;
    self.$$options = options;
    self.$$id = id;

    return self;
  };

  AngularMeteorObject.prototype = {};

  AngularMeteorObject.prototype.getRawObject = function () {
    var self = this;

    return angular.copy(_.omit(self, self.$$internalProps));
  };

  AngularMeteorObject.prototype.subscribe = function () {
    $meteorSubscribe.subscribe.apply(this, arguments);
    return this;
  };

  AngularMeteorObject.prototype.save = function save(docs) {
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

  AngularMeteorObject.prototype.reset = function reset() {
    var self = this,
      collection = self.$$collection,
      options = self.$$options,
      id = self.$$id;

    if (collection){
      var serverValue = collection.findOne(id, options);
      var prop;
      if (serverValue) {
        angular.extend(Object.getPrototypeOf(serverValue), AngularMeteorObject.prototype);
        self.__proto__ = Object.getPrototypeOf(serverValue);
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

  AngularMeteorObject.prototype.stop = function stop() {
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
  AngularMeteorObject.prototype.$$internalProps = [
    'save', 'reset', '$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject',
    'collection', '_eventEmitter'
  ];

  AngularMeteorObject.prototype.internalProps = function() {
    var self = this;
    var internalProps = [].concat(self.$$internalProps);
    _.each(self, function(value, prop) {
      if (angular.isFunction(self[prop])) {
        internalProps.push(prop);
      }
    });
    return internalProps;
  };

  return AngularMeteorObject;
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
          return _.omit(data, data.internalProps());
        }, function (newItem, oldItem) {
          if (newItem) {
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
