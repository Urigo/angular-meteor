'use strict';

var Meteor, Tracker;

describe('Given the $collection Factory', function() {

  var $collection;


  beforeEach(function() {

      Meteor = {
        Collection: function(){}
      };

      Tracker = {
        autorun: function(){}
      };

      module('angular-meteor.collections');

      inject(function(_$collection_) {

        $collection = _$collection_;

      });

  });

  describe('when instantiating the collection', function() {

    it('should throw an exception if the collection passed is not an instance of Meteor.Collection', function() {

      expect($collection.bind(function(){})).toThrow(new TypeError("The first argument of $collection must be a Meteor.Collection object."));

    });

    it('should return an object with two methods: bind and bindOne ', function() {

      var output = $collection(new Meteor.Collection());

      expect(typeof output.bind).toEqual('function');
      expect(typeof output.bindOne).toEqual('function');

    });

  });

  describe('when using $collection.bind()', function() {

    it('should throw an exception in the 3rd parameter is not a boolean', function(){

      var output = $collection(new Meteor.Collection());

      expect(output.bind.bind(this, false, false, 'notBoolean')).toThrow(new TypeError('The third argument of bind must be a boolean.'));

    });

  });




});
