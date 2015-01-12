'use strict';

var Mongo, Tracker;

describe('Given the $meteorCollection service', function() {

  var $meteorCollection;

  beforeEach(function() {

    var Collection = function(){};
    Collection.prototype.find = function(){
      return {
        collection: {
          name: 'myCollection'
        },
        observeChanges: function() {}
      }
    };

    Mongo = {
      Collection: Collection
    };


    Tracker = {
      Dependency: function(){
        return {
          depend: function(){}
        }
      },
      autorun: function (fn) {
        fn({firstRun: false})
      },
      onValidate: function() {},
      onInvalidate: function() {}
    };

    module('angular-meteor.meteor-collection');

    inject(function(_$meteorCollection_) {

      $meteorCollection = _$meteorCollection_;

    });

  });


  it('should throw an exception if the first argument is empty', function() {

      expect($meteorCollection.bind(this)).toThrow(new TypeError("The first argument of $meteorCollection is undefined."));
      expect($meteorCollection.bind(this, 'badcollection')).toThrow(new TypeError("The first argument of $meteorCollection must be a function or a Mongo.Collection."));

  });

  describe('when instantiated', function() {

    it('should return a Angular Meteor Collection with these methods: subscribe, save, remove, updateCursor and stop', function() {

      var myCollection = new Mongo.Collection();
      var output = $meteorCollection(myCollection);

      expect(typeof output.subscribe).toEqual('function');
      expect(typeof output.save).toEqual('function');
      expect(typeof output.remove).toEqual('function');
      expect(typeof output.updateCursor).toEqual('function');
      expect(typeof output.stop).toEqual('function');
    });

  });

});
