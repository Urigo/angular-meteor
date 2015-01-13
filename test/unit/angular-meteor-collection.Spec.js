'use strict';

var Mongo, Tracker, Meteor;

describe('Given the $meteorCollection service', function() {

  var $meteorCollection, subscribeSpy;

  beforeEach(function() {

    // Mocking Collection
    function Collection(){};

    Collection.prototype.find = function(){
      return {
        collection: {
          name: 'myCollection'
        },
        cursor: {
          collection: {
            name: 'myCollection'
          }
        },
        observeChanges: function(){}
      }
    };
    Collection.prototype._name = 'myCollection';
    Mongo = {
      Collection: Collection
    };

    window.myCollection = new Mongo.Collection();

    // Mocking Tracker
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

    subscribeSpy = jasmine.createSpy('spySubscribe');

    Meteor = {
      subscribe: subscribeSpy
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

    it('should return a Mongo Collection inside $$collection', function(){

      var myCollection = new Mongo.Collection();
      var output = $meteorCollection(myCollection);
      expect(typeof output.$$collection).toEqual('object');
      expect(output.$$collection._name).toEqual('myCollection');


    });

    describe('when using subscribe()', function() {

      it('should subscribe to the collection', function() {
        var myCollection = new Mongo.Collection();
        var output1 = $meteorCollection(myCollection);
        output1.subscribe();
        expect(typeof output1).toBe('object');
        expect(subscribeSpy).toHaveBeenCalled();

      });

    });

  });

});
