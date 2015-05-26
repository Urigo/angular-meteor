describe('$meteorCollection service', function() {
  var $meteorCollection,
      MyCollection,
      $rootScope,
      $timeout,
      meteorArray,
      testObjects = [
      {
        'a' : 1,
        'b' : 2
      },
      {
        'a' : 3,
        'b' : 4
      },
      {
        'a' : 5,
        'b' : 6
      }
      ];

  beforeEach(angular.mock.module('angular-meteor'));

  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  beforeEach(angular.mock.inject(function(_$meteorCollection_, _$rootScope_, _$timeout_) {
    $meteorCollection = _$meteorCollection_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;

    spyOn($rootScope, '$apply').and.callThrough();

    MyCollection = new Mongo.Collection();
    MyCollection.insert(testObjects[0]);
    MyCollection.insert(testObjects[1]);
    MyCollection.insert(testObjects[2]);

    meteorArray = $meteorCollection(MyCollection, false);
  }));

  describe('initialisation', function() {
    it('should return an array with all items in the Mongo Collection', function() {
      // assert
      expect(meteorArray).toEqualCollection(MyCollection);
    });
  });

  describe('collection updates', function() {
    it('should update the array when a new item is inserted into the collection', function() {
      // act
      MyCollection.insert({ a : '7', b: '8'});

      // assert
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when an item is updated in the collection', function() {
      // arrange
      var anyItem = MyCollection.findOne({});

      // act
      MyCollection.update({ _id : anyItem._id }, { a : '7', b : '8'});

      // assert
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when an item is removed from the collection', function() {
      // arrange
      var anyItem = MyCollection.findOne({});

      // act
      MyCollection.remove({ _id : anyItem._id });

      // assert
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when multiple changed occur on the collection', function() {
      // arrange
      var anyItem = MyCollection.findOne({});
      var anotherItem = MyCollection.findOne({a : '1'});

      // act
      MyCollection.remove({ _id : anyItem._id });
      MyCollection.update({ _id : anotherItem }, { $set : { b : '100 '}});
      MyCollection.insert({ a : '7', b : '8'});

      // assert
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });
  });

  describe('autobind on', function() {
    beforeEach(function() {
      meteorArray = $meteorCollection(MyCollection);
      $timeout.flush();
    });

    it('should update the collection when a new item is pushed into the array', function() {
      // act
      meteorArray.push({
        a : '7',
        b: '8'
      });
      $rootScope.$apply();

      // assert
      expect(meteorArray).toEqualCollection(MyCollection);
    });
  });
});
