'use strict';

var Meteor;

describe('Given the $collection Factory', function() {

  var $collection;


  beforeEach(function() {

      Meteor = {
        Collection: function(){}
      };

      module('angular-meteor.collections');

      inject(function(_$collection_) {

        $collection = _$collection_;

      });

  });

  it('should throw an exception if the collection passed is not an instance of Meteor.Collection', function() {

    expect($collection.bind(function(){})).toThrow(new TypeError("The first argument of $collection must be a Meteor.Collection object."));

  });


});
