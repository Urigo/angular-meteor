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

  describe('observe server changes', function() {

    beforeEach(function() {
      // Cleaning up after each test.
      bigCollection.find({}).forEach(function(doc) {
        bigCollection.remove(doc._id);
      });

      for (var i = 0; i < 100; i++) {
        bigCollection.insert({count: i});
      }
    });

    it('$apply executed twice', function() {

      var $ngCol = $meteorCollection(bigCollection);

      expect($rootScope.$apply).toHaveBeenCalled();

      expect($ngCol).toEqualCollection(bigCollection);

      // No matter how much elements MyCollection contains
      // $rootScope.$apply should be called twice.
      expect($rootScope.$apply.calls.count()).toEqual(2);

    });

    it('push updates from client handled correctly', function() {

      $rootScope.limit = 10;
      var $ngCol = $meteorCollection(function() {
        return bigCollection.find({}, {
          limit: $rootScope.getReactively('limit')
        });
      });
      spyOn($ngCol, 'save');

      // Adds docs on the client.
      for (var i = 100; i < 106; i++) {
        $ngCol.push({count: i});
      }

      $timeout.flush();

      expect($ngCol.length).toEqual(10);
      expect($ngCol.save).toHaveBeenCalled();
      expect($ngCol.save.calls.count()).toEqual(6);
    });

    it('remove updates from client handled correctly', function() {

      $rootScope.limit = 10;
      var $ngCol = $meteorCollection(function() {
        return bigCollection.find({}, {
          limit: $rootScope.getReactively('limit')
        });
      });
      spyOn($ngCol, 'remove').and.callThrough();

      // Removes last two docs on the client.
      $ngCol.pop();
      $ngCol.pop();

      $timeout.flush();

      // Size should stay at 10 after removing because
      // limit is set.
      expect($ngCol.length).toEqual(10);
      expect($ngCol.remove).toHaveBeenCalled();
      expect($ngCol.remove.calls.count()).toEqual(2);
    });

  });
});
