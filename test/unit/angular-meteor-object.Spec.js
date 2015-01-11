'use strict';

var Meteor;

describe('Given the $meteorObject factory', function() {

  var $meteorObject, updateSpy;

  beforeEach(function() {

    updateSpy = jasmine.createSpy('update');

    var C = function C() {}

    C.prototype.findOne = function() {
      return {_id: 1}
    };
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

  describe('When calling save()', function() {

    it('should invoke Collection.update()', function() {

      var myCol = new Meteor.Collection();

      var result = $meteorObject(myCol, 1);

      result.save();

      expect(updateSpy).toHaveBeenCalled();

    });

  });

});
