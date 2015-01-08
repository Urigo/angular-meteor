var angularMeteorObject = angular.module('angular-meteor.object', []);

angularMeteorObject.factory('$meteorObject', ['$rootScope', '$meteorUtils',
  function($rootScope, $meteorUtils) {
    return function(collection, id, auto, options) {

      // Validate parameters
      if (!(collection instanceof Meteor.Collection)) {
        throw new TypeError("The first argument of $collection must be a Meteor.Collection object.");
      }
      auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570
      if (!(typeof auto === 'boolean')) { // Checks if auto is a boolean.
        throw new TypeError("The third argument of bind must be a boolean.");
      }

      var data = collection.findOne(id, options);

      $meteorUtils.autorun($rootScope, function() {
        angular.copy(collection.findOne(id, options), data);
      });

      if (auto) { // Deep watches the model and performs autobind.
        $rootScope.$watch(function(){
          return data;
        }, function (newItem, oldItem) {
          if (newItem)
            if (newItem._id)
              collection.update({_id: newItem._id}, { $set: _.omit(newItem, '_id') });
        }, true);
      }

      return data;
    }
  }]);