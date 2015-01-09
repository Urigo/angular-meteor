var angularMeteorObject = angular.module('angular-meteor.object', []);

var AngularMeteorObject = function (collection, id, options, $meteorSubscribe) {
  var self = collection.findOne(id, options);

  if (!self){
    self = {};
  }

  self.__proto__ = AngularMeteorObject.prototype;
  self.$$collection = collection;
  self.$$options = options;
  self.$$id = id;
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
    collection = self.$$collection;

  if (self)
    if (self._id)
      collection.update({_id: self._id}, { $set: _.omit(self, '_id', 'save', 'reset', '$$collection', '$$options', '$meteorSubscribe', '$$id') });
};

AngularMeteorObject.prototype.reset = function reset() {
  var self = this,
    collection = self.$$collection,
    options = self.$$options,
    id = self.$$id;

  if (collection){
    var serverValue = collection.findOne(id, options);
    for (var prop in serverValue) {
      if (serverValue.hasOwnProperty(prop)) {
        self[prop] = serverValue[prop];
      }
    }
  }
};


angularMeteorObject.factory('$meteorObject', ['$rootScope', '$meteorUtils', '$meteorSubscribe',
  function($rootScope, $meteorUtils, $meteorSubscribe) {
    return function(collection, id, auto, options) {

      // Validate parameters
      if (!(collection instanceof Meteor.Collection)) {
        throw new TypeError("The first argument of $collection must be a Meteor.Collection object.");
      }
      auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570
      if (!(typeof auto === 'boolean')) { // Checks if auto is a boolean.
        throw new TypeError("The third argument of bind must be a boolean.");
      }

      var data = new AngularMeteorObject(collection, id, options, $meteorSubscribe);

      $meteorUtils.autorun($rootScope, function() {
        data.reset();
      });

      if (auto) { // Deep watches the model and performs autobind.
        $rootScope.$watch(function(){
          return _.omit(data, 'save', 'reset', '$$collection', '$$options', '$meteorSubscribe', '$$id');
        }, function (newItem, oldItem) {
          if (newItem) {
            if (newItem._id) {
              collection.update({_id: newItem._id}, {$set: _.omit(newItem, '_id', 'save', 'reset', '$$collection', '$$options', '$meteorSubscribe', '$$id')});
            }
          }
        }, true);
      }

      return data;
    }
  }]);