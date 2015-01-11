'use strict';

var Meteor;

describe('Given the $meteorObject factory', function() {

  var $meteorObject;

  beforeEach(function() {

    Meteor = {
      Collection: function(){}
    };

    module('angular-meteor.object');

    inject(function(_$meteorObject_) {
      $meteorObject = _$meteorObject_;
    });

  });

  it('should throw an exception if the first parameter is not an instance of Meteor.Collection', function() {

    expect($meteorObject.bind(this, false)).toThrow(new TypeError("The first argument of $collection must be a Meteor.Collection object."));

  });

});
