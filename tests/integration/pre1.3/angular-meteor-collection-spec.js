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

    beforeEach(function() {
      $timeout.flush();
    });

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
      meteorArray.push({a: '7', b: '8'});
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

    it('should update the collection when a subarray is spliced', function() {
      var obj = meteorArray[0];
      var expectedObj = _.clone(obj);
      obj.arr = [1, 2, 3];
      expectedObj.arr = [1, 3];
      $rootScope.$apply();

      obj.arr.splice(1, 1);
      $rootScope.$apply();

      expect(obj).toDeepEqual(expectedObj);
    });
  });

  describe('remove()', function() {
    beforeEach(function() {
      meteorArray = $meteorCollection(MyCollection);
      $timeout.flush();
    });

    it('remove items different ways', function() {
      var items = MyCollection.find({}).fetch();
      var length = meteorArray.length;

      meteorArray.remove(items[1]);
      meteorArray.remove(items[0]._id);

      $rootScope.$apply();
      expect(meteorArray).toEqualCollection(MyCollection);
      expect(meteorArray.length).toEqual(length - 2);
    });

    it('removing all', function() {
      meteorArray.remove();
      $rootScope.$apply();
      expect(meteorArray).toEqualCollection(MyCollection);
      expect(meteorArray.length).toEqual(0);
    });

    it('throws if not string or ObjectId', function() {
        expect(function() {
          meteorArray.remove(1231231);
        }).toThrow();
    });

    it('removing with ObjectId', function() {
      meteorArray.remove(new Mongo.ObjectID());
    });
  });

  describe('save()', function() {
    var Collection;
    var $scope;

    beforeEach(function() {
      Collection = new Meteor.Collection(null);
      $scope = $rootScope.$new();
      $scope.collection = $scope.$meteorCollection(Collection, false);
    });

    it('should insert an unexisting document and digest', function() {
      var doc = { _id: 'unexist-doc' };

      $scope.collection.save(doc);
      expect(Collection.findOne(doc)).toDeepEqual(doc);
    });

    it('should update an existing document and digest', function() {
      var doc = { _id: 'existing-doc' };
      $scope.collection.save(doc);

      doc.a = 1;
      $scope.collection.save(doc);
      expect(Collection.findOne(doc)).toDeepEqual(doc);
      $rootScope.$apply();
    });

    describe('_updateParallel()', function() {
      var Collection;
      var ngCollection;

      beforeEach(function() {
        Collection = new Meteor.Collection(null);
        ngCollection = $meteorCollection(Collection);
        spyOn(Collection, 'update').and.callThrough();
        $timeout.flush();
      });

      it('should perform each operation individually in parallel', function(done) {
        var id = 'id-01';
        var obj = {_id: id, data: [1, 2, 3]};
        var update1 = {$set: {'data.1': 3}, $unset: {'data.2': true}};
        var update2 = {$pull: {'data': null}};
        var updates = [update1, update2];

        ngCollection.push(obj);
        $rootScope.$apply();

        ngCollection._updateParallel(id, updates, function(err, affectedDocsNum) {
          if (err) return done(err);
          expect(affectedDocsNum).toEqual(1);

          var doc = Collection.findOne(id);
          expect(doc).toDeepEqual({_id: id, data: [1, 3]});
          expect(Collection.update.calls.count()).toEqual(2);
          expect(Collection.update.calls.argsFor(0)).toEqual([id, update1, jasmine.any(Function)]);
          expect(Collection.update.calls.argsFor(1)).toEqual([id, update2, jasmine.any(Function)]);
          done();
        });
      });
    });

    describe('_updateDiff()', function() {
      var Collection;
      var ngCollection;

      beforeEach(function() {
        Collection = new Meteor.Collection(null);
        ngCollection = $meteorCollection(Collection);
        spyOn(ngCollection, '_updateParallel');
        $timeout.flush();
      });

      it('should seperate pull operations into different updates', function() {
        var id = 'id-01';
        var update = {$set: {'data.1': 3}, $unset: {'data.2': true}, $pull: {'data': null}};
        var update1 = _.omit(update, '$pull');
        var update2 = _.pick(update, '$pull');
        var updates = [update1, update2];
        var callback = function() {};

        ngCollection._updateDiff(id, update, callback);
        expect(ngCollection._updateParallel).toHaveBeenCalled();
        expect(ngCollection._updateParallel.calls.argsFor(0)).toEqual([id, updates, callback]);
      });
    });

    it('should save multiple documents', function() {
      var doc1 = { _id: 'first-doc' };
      var doc2 = { _id: 'second-doc' };
      var docs = [doc1, doc2];
      $scope.collection.save(docs);
      expect(Collection.find().fetch()).toDeepEqual(docs);
    });

    describe('objects with $$hashkey', function() {
      it('should be saved to the collection when save is called', function() {
        // add haskeys to objects in the array
        meteorArray.forEach(function(item, index) {
          item.$$hashKey = index;
        });

        var itemChanged = meteorArray[0];
        itemChanged.a = 444;

        meteorArray.save();

        expect({a: 444, b: 2}).toBeFoundExactlyInCollection(MyCollection);
      });

      it('should save objects with nested $$haskey fields when save is called', function() {
        meteorArray.save(itemWithNestedHashkeyArrays);

        expect(itemWithNestedHashkeysRemoved).toBeFoundExactlyInCollection(MyCollection);
      });
    });

    describe('objects with date', function() {
      it('should be saved to the collection when save is called', function() {
        var itemChanged = meteorArray[0];
        itemChanged.a = new Date("October 13, 2014 11:13:00");

        meteorArray.save();
        expect({a: new Date("October 13, 2014 11:13:00"), b: 2})
          .toBeFoundExactlyInCollection(MyCollection);
      });

      it('should save objects with nested date fields when save is called', function() {
        meteorArray.save(itemWithNestedDateFields);

        expect(itemWithNestedDateFields).toBeFoundExactlyInCollection(MyCollection);
      });

      it('should be inserted to the collection if not exist', function() {
        var id = 'date-doc';
        var doc = { _id: id, date: new Date() };
        $scope.collection.save(doc);
        expect(Collection.findOne(id)).toDeepEqual(doc);
      });

      it('should update an auto binded collection', function() {
        var id = 'date-doc';
        var doc = { _id: id, date: new Date() };
        $scope.collection = $scope.$meteorCollection(Collection, true);
        Collection.insert(doc);

        Tracker.flush();
        expect(_.findWhere($scope.collection, { _id: id })).toDeepEqual(doc);
      });
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
      $timeout.flush();

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
      expect($ngCol.save.calls.count()).toEqual(1);
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
      expect($ngCol.remove.calls.count()).toEqual(1);
    });
  });
});
