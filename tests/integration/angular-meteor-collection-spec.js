describe('$meteorCollection service', function() {
  var $meteorCollection,
      MyCollection,
      $rootScope,
      $timeout,
      meteorArray,
      testObjects;

  // Setup jasmine.
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  // Inject angular stuff.
  beforeEach(angular.mock.module('angular-meteor'));
  beforeEach(angular.mock.inject(function(_$meteorCollection_, _$rootScope_, _$timeout_) {
    $meteorCollection = _$meteorCollection_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  // Initialize spies.
  beforeEach(function(){
    spyOn($rootScope, '$apply').and.callThrough();
  });

  // Initialize data.
  beforeEach(function(){
    testObjects = [
      {'a' : 1, 'b' : 2},
      {'a' : 3, 'b' : 4},
      {'a' : 5, 'b' : 6}];
    MyCollection = new Mongo.Collection(null);
    MyCollection.insert(testObjects[0]);
    MyCollection.insert(testObjects[1]);
    MyCollection.insert(testObjects[2]);
    meteorArray = $meteorCollection(MyCollection, false);
  });


  describe('initialisation', function() {
    it('should return an array with all items in the Mongo Collection', function() {
      expect(meteorArray).toEqualCollection(MyCollection);
    });
  });


  describe('collection updates', function() {
    it('should update the array when a new item is inserted into the collection', function() {
      MyCollection.insert({ a : '7', b: '8'});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when an item is updated in the collection', function() {
      var anyItem = MyCollection.findOne({});
      MyCollection.update({ _id : anyItem._id }, { a : '7', b : '8'});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item unset-field is assigned a deep-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {$unset: {a: 1}});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 'v'}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item object-field is assigned a deep-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: {}});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 'v'}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item array-field is assigned a deep-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: []});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 'v'}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item primitive-field is assigned a deep-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: 1});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 'v'}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item falsy primitive-field is assigned a deep-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: 0});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 'v'}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item null-field is assigned a deep-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: null});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 'v'}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item null-field is assigned a shallow-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: null});
      MyCollection.update(item._id, {a: {subfield: 'v'}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item null-field is assigned a array-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: null});
      MyCollection.update(item._id, {a: [1, 2, 3]});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item nested-object is nulled', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: {subfield: 'v'}});
      MyCollection.update(item._id, {a: null});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item non-null-subfield is nulled', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: {subfield: 'v'}});
      MyCollection.update(item._id, {a: {subfield: null}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item null-subfield is assigned a primitive', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: {subfield: null}});
      MyCollection.update(item._id, {a: {subfield: 'v'}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item null-subfield is assigned a array-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: {subfield: null}});
      MyCollection.update(item._id, {a: {subfield: [1, 2, 3]}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item deep-field is assigned a primitive', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 0}}}});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 1}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when a collection item deep-field is assigned a deep-object', function() {
      var item = MyCollection.findOne();
      MyCollection.update(item._id, {a: {L1: null}});
      MyCollection.update(item._id, {a: {L1: {L2: {L3: 1}}}});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when an item is removed from the collection', function() {
      var anyItem = MyCollection.findOne({});
      MyCollection.remove({ _id : anyItem._id });
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });

    it('should update the array when multiple changes occur on the collection', function() {
      var anyItem = MyCollection.findOne({});
      var anotherItem = MyCollection.findOne({a : '1'});
      MyCollection.remove({ _id : anyItem._id });
      MyCollection.update({ _id : anotherItem }, { $set : { b : '100 '}});
      MyCollection.insert({ a : '7', b : '8'});
      expect(meteorArray).toEqualCollection(MyCollection);
      expect($rootScope.$apply).toHaveBeenCalled();
    });
  });


  describe('reactive cursor', function() {
    it('should update the array when the reactive cursor function recomputes', function() {
      var dependency = new Tracker.Dependency();
      var reactiveFunc = jasmine.createSpy().and.callFake(function() {
        dependency.depend();
        return MyCollection.find({});
      });
      var meteorReactiveArray = $meteorCollection(reactiveFunc);

      MyCollection.update({ a: 1}, { a : 6});
      dependency.changed();
      Tracker.flush();

      expect(reactiveFunc).toHaveBeenCalled();
      expect(meteorReactiveArray).toEqualCollection(MyCollection);
    });
  });


  describe('autobind off', function() {
    var notAutoArray;

    beforeEach(function() {
      notAutoArray = $meteorCollection(MyCollection, false);
    });

    it('should not update the collection when a changes a happens to the array', function() {
      var newItem = {
        a : 10,
        b : 11
      };
      notAutoArray.push(newItem);

      $rootScope.$apply();

      expect(newItem).not.toBeFoundExactlyInCollection(MyCollection);
    });

    it('should not save an item from the server when an item is received from the server', function() {
      var saveSpy = spyOn(notAutoArray, 'save').and.callThrough();

      MyCollection.insert({
        a : 10,
        b : 11
      });

      $timeout.flush();

      expect(saveSpy).not.toHaveBeenCalled();
      expect(notAutoArray).toEqualCollection(MyCollection);
    });
  });


  describe('autobind on', function() {
    beforeEach(function() {
      meteorArray = $meteorCollection(MyCollection);
      $timeout.flush();
    });

    it('should update the collection when a new item is pushed into the array', function() {
      meteorArray.push({a : '7', b: '8'});
      $rootScope.$apply();
      expect(meteorArray).toEqualCollection(MyCollection);
    });

    it('should update the collection when an item is changed in the array', function() {
      meteorArray[0].a = 888;
      $rootScope.$apply();
      expect(meteorArray).toEqualCollection(MyCollection);
    });

    it('should update the collection when an item is removed from the array', function() {
      meteorArray.splice(0, 1);
      $rootScope.$apply();
      expect(meteorArray).toEqualCollection(MyCollection);
    });
  });


  describe('observe server changes', function() {

    // Cleaning up after each test.
    beforeEach(function() {
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


  describe('objects with $$hashkey', function() {
    it('should be saved to the collection when save is called', function(done) {
      // add haskeys to objects in the array
      meteorArray.forEach(function(item, index) {
        item.$$hashKey = index;
      });

      var itemChanged = meteorArray[0];
      itemChanged.a = 444;

      meteorArray.save().then(function() {
        expect({a : 444, b: 2}).toBeFoundExactlyInCollection(MyCollection);
        done();
      }, function() {
        done();
      });
    });

    it('should save objects with nested $$haskey fields when save is called', function(done) {
      meteorArray.save(itemWithNestedHashkeyArrays).then(function() {
        expect(itemWithNestedHashkeysRemoved).toBeFoundExactlyInCollection(MyCollection);
        done();
      }, function() {
        done();
      });
    });
  });


  describe('objects with date', function() {
    it('should be saved to the collection when save is called', function(done) {
      var itemChanged = meteorArray[0];
      itemChanged.a = new Date("October 13, 2014 11:13:00");

      meteorArray.save().then(function() {
        expect({a : new Date("October 13, 2014 11:13:00"), b: 2}).toBeFoundExactlyInCollection(MyCollection);
        done();
      }, function() {
        done();
      });
    });

    it('should save objects with nested date fields when save is called', function(done) {
      meteorArray.save(itemWithNestedDateFields).then(function() {
        expect(itemWithNestedDateFields).toBeFoundExactlyInCollection(MyCollection);
        done();
      }, function() {
        done();
      });
    });
  });
});
