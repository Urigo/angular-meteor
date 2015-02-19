var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe']);

var AngularMeteorObject = function (collection, id, options, $meteorSubscribe, $q) {
  var self = collection.findOne(id, options);

  if (!self){
    self = {};
  }

  self.__proto__ = AngularMeteorObject.prototype;
  self.$$collection = collection;
  self.$$options = options;
  self.$$id = id;
  self.__proto__.$q = $q;
  self.__proto__.$meteorSubscribe = $meteorSubscribe;

  return self;
};

AngularMeteorObject.prototype = {};

AngularMeteorObject.prototype.subscribe = function () {
  var self = this;
  self.$meteorSubscribe.subscribe.apply(this, arguments);
  return this;
};

AngularMeteorObject.prototype.save = function save() {
  var self = this,
    collection = self.$$collection,
    $q = self.$q;

  var deferred = $q.defer();

  if (self)
    if (self._id)
      collection.update(
        {_id: self._id},
        { $set: angular.copy(_.omit(self, '_id', self.$$internalProps)) },
        function(error, numberOfDocs){
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(numberOfDocs);
          }
        }
      );

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
  'save', 'reset', '$$collection', '$$options', '$meteorSubscribe', '$$id', '$q', '$$hashkey', '$$internalProps', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy'
];


angularMeteorObject.factory('$meteorObject', ['$rootScope', '$meteorUtils', '$meteorSubscribe', '$q',
  function($rootScope, $meteorUtils, $meteorSubscribe, $q) {
    return function(collection, id, auto, options) {

      // Validate parameters
      if (!(collection instanceof Meteor.Collection)) {
        throw new TypeError("The first argument of $collection must be a Meteor.Collection object.");
      }
      auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570

      var data = new AngularMeteorObject(collection, id, options, $meteorSubscribe, $q);

      data.autorunComputation = $meteorUtils.autorun($rootScope, function() {
        data.reset();
      });

      if (auto) { // Deep watches the model and performs autobind.
        data.unregisterAutoBind = $rootScope.$watch(function(){
          return _.omit(data, data.$$internalProps);
        }, function (newItem, oldItem) {
          if (newItem) {
            if (newItem._id && !_.isEmpty(newItem = _.omit(angular.copy(newItem), '_id'))) {
              collection.update({_id: newItem._id}, {$set: newItem});
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
