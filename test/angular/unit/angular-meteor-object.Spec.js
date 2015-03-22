'use strict';

var Meteor;

describe('Given the $meteorObject factory', function() {

  var $meteorObject, updateSpy, findOneSpy, subscribeSpy, updateSpy, Collection, $rootScope;

  beforeEach(function() {

    updateSpy = jasmine.createSpy('update');
    findOneSpy = jasmine.createSpy('findOne').and.returnValue({_id: 1});
    subscribeSpy = jasmine.createSpy('subscribe');
    updateSpy = jasmine.createSpy('update');

    Collection = function Collection() {}

    Collection.prototype.findOne = findOneSpy;
    Collection.prototype.update = updateSpy;

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

    Collection.prototype.update = updateSpy;


    Meteor = {
      Collection: Collection,
      subscribe: subscribeSpy
    };

    module('angular-meteor.object', function($provide) {

      var mock = {
        autorun: function(a,b) {
          b()
        }
      };

      $provide.value('$meteorUtils', mock);
    });

    inject(function(_$meteorObject_, _$rootScope_) {
      $meteorObject = _$meteorObject_;
      $rootScope = _$rootScope_;
    });

  });


  describe('when instantiating the object', function() {

    it('should throw an exception if the first parameter is not an instance of Meteor.Collection', function() {

      expect($meteorObject.bind(this, false)).toThrow(new TypeError("The first argument of $collection must be a Meteor.Collection object."));

    });

    it('should return an AngularMeteor object that contains: save(), reset() and subscribe() and other internal methods', function() {

      var myCol = new Meteor.Collection();
      var result = $meteorObject(myCol);

      expect(typeof result.save).toEqual('function');
      expect(typeof result.reset).toEqual('function');
      expect(typeof result.subscribe).toEqual('function');

      expect(typeof result.$$collection).toEqual('object');
      //expect(typeof result.$$options).toEqual('function');
      expect(typeof result.$meteorSubscribe).toEqual('object');
      //expect(typeof result.$$id).toEqual('function');

    });

    it('should return the Mongo collection under $$collection', function() {

      var myCol = new Meteor.Collection();
      var output = $meteorObject(myCol);

      expect(output.$$collection._name).toEqual('myCollection');

    });

    describe('with an empty collection', function() {

      it('should work just fine', function() {

        Collection.prototype.findOne = jasmine.createSpy('findOneAndFalse').and.returnValue(false);

        var myCol = new Meteor.Collection();
        var output = $meteorObject(myCol);
        expect(output.$$collection._name).toEqual('myCollection');

      });

    });

    describe('with auto set to: true (default)', function() {

      it('should call collection.update()', function() {

        var myCol = new Meteor.Collection();
        $meteorObject(myCol, 1, true);
        $rootScope.$apply();

        expect(updateSpy).toHaveBeenCalled();

      });


    });

  });

  describe('when calling save()', function() {

    it('should invoke Collection.update()', function() {

      var myCol = new Meteor.Collection();

      var result = $meteorObject(myCol, 1);

      result.save();

      expect(updateSpy).toHaveBeenCalled();

    });

  });


  describe('when calling reset()', function() {

    it('should invoke Collection.findOne() to repopulate the data from the collection', function() {
      var myCol = new Meteor.Collection();

      var result = $meteorObject(myCol, 1);

      result.reset();

      expect(findOneSpy).toHaveBeenCalled();

    });

  });

  describe('when calling subscribe()', function() {

    it('should subscribe to the collection', function() {

      var myCol = new Meteor.Collection();

      var result = $meteorObject(myCol, 1);

      result.subscribe();

      expect(subscribeSpy).toHaveBeenCalled();

    });

  });

  describe('when calling getRawObject()', function() {
    it('should return the raw object', function() {

      var myCol = new Meteor.Collection();

      var result = $meteorObject(myCol, 1);

      var raw = result.getRawObject();

      angular.forEach(result.$$internalProps, function(prop) {
        expect(typeof raw[prop]).toEqual('undefined');
      });

      // Double check .getRawObject() is removed too.
      expect(typeof raw.getRawObject).toEqual('undefined');

      expect(raw._id).toEqual(1);
    });
  });

});
