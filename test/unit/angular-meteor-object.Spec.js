'use strict';

var Meteor;

describe('Given the $meteorObject factory', function() {

  var $meteorObject, updateSpy, findOneSpy;

  beforeEach(function() {

    updateSpy = jasmine.createSpy('update');
    findOneSpy = jasmine.createSpy('findOne').and.returnValue({_id: 1})

    var C = function C() {}

    C.prototype.findOne = findOneSpy;
    C.prototype.update = updateSpy;


    Meteor = {
      Collection: C
    };

    module('angular-meteor.object');

    inject(function(_$meteorObject_) {
      $meteorObject = _$meteorObject_;
    });

  });


  describe('when instantiating the object', function() {

    it('should throw an exception if the first parameter is not an instance of Meteor.Collection', function() {

      expect($meteorObject.bind(this, false)).toThrow(new TypeError("The first argument of $collection must be a Meteor.Collection object."));

    });

    it('should return an AngularMeteor object that contains: save(), reset() and subscribe() methods', function() {

      var myCol = new Meteor.Collection();
      var result = $meteorObject(myCol);

      expect(typeof result.save).toEqual('function');
      expect(typeof result.reset).toEqual('function');
      expect(typeof result.subscribe).toEqual('function');

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

});
