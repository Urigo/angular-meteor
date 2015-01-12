'use strict';
var Mongo;
describe('Given the $meteorCollection service', function() {


  var $meteorCollection;

  beforeEach(function() {


    Mongo = {
      Collection: function(){}
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

});
