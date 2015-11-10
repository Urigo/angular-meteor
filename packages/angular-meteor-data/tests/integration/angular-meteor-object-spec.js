describe('$meteorObject service', function () {
  var $meteorObject,
      $rootScope,
      AngularMeteorCollection,
      TestCollection,
      id,
      meteorObject;

  // Setup jasmine.
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  beforeEach(angular.mock.module('angular-meteor'));

  beforeEach(angular.mock.inject(function (_$meteorObject_, _$rootScope_, _AngularMeteorCollection_) {
    $meteorObject = _$meteorObject_;
    $rootScope = _$rootScope_;
    AngularMeteorCollection = _AngularMeteorCollection_;
  }));

  beforeEach(function () {
    id = 'test_1';
    var data = { _id: id, a: 1, b: 2, d: [1,2,3] };

    TestCollection = new Mongo.Collection(null);
    TestCollection.insert(data);

    meteorObject = $meteorObject(TestCollection, id, false);
  });

  it('should delete the property when unset in the collection', function () {
    TestCollection.update(id, { $unset: { a: 1 } });

    Tracker.flush();

    var doc = TestCollection.findOne(id);
    expect(doc.a).not.toBeDefined('document have unset property'); // make sure it was unset in mongo

    expect(meteorObject.a).not.toBeDefined('angular meteor object have unset property');
  });

  it('should keep the client only property after autorun updates', function () {
    meteorObject.clientProp = 'keep';

    TestCollection.update(id, { $unset: { a: 1 } });

    Tracker.flush();

    var doc = TestCollection.findOne(id);
    expect(doc.clientProp).not.toBeDefined('document have client property');  // make sure it didn't set to mongo

    expect(meteorObject.a).not.toBeDefined('angular meteor object have unset property');
    expect(meteorObject.clientProp).toBeDefined('angular meteor object doesnt have client property');
  });

  it('should delete server and client side properties when object removed from the collection', function () {
    meteorObject.clientProp = 'keep';
    TestCollection.remove(id);

    Tracker.flush();

    expect(meteorObject.a).not.toBeDefined();
    expect(meteorObject.b).not.toBeDefined();
    expect(meteorObject._id).not.toBeDefined();
    expect(meteorObject.clientProp).not.toBeDefined();
  });

  describe('#save()', function() {
    it('should not call save upon init', function() {
      spyOn(TestCollection, 'update').and.callThrough();
      // Watching changes (auto modifier not set to false)
      $meteorObject(TestCollection, id);
      $rootScope.$apply();

      expect(TestCollection.update).not.toHaveBeenCalled();
    });
    
    it('should save updates specified', function() {
      meteorObject.save({
        c: 3
      });

      var doc = TestCollection.findOne(id);

      expect(doc).toDeepEqual({
        _id: id,
        a: 1,
        b: 2,
        c: 3,
        d: [1,2,3]
      });

      Tracker.flush();
      expect(meteorObject.getRawObject()).toDeepEqual(doc);
    });

    it('should save object changes if no updates were specified', function() {
      meteorObject.c = 3;
      meteorObject.save();

      var doc = TestCollection.findOne(id);

      expect(doc).toDeepEqual({
        _id: id,
        a: 1,
        b: 2,
        c: 3,
        d: [1,2,3]
      });
    });

    it('should create a new document if object does not exist and id is defined', function() {
      var id = 'test_2';
      var meteorObject = $meteorObject(TestCollection, id, false);
      meteorObject._id = id;
      meteorObject.save();

      var doc = TestCollection.findOne(id);
      expect(doc._id).toEqual(id);
    });

    it('should create a new document if object does not exist and no id is defined', function() {
      var meteorObject = $meteorObject(TestCollection, undefined, false);
      meteorObject.save();

      Tracker.flush();
      var id = meteorObject._id;

      var doc = TestCollection.findOne(id);
      expect(doc._id).toEqual(id);
    });

    it('should save an object with a spliced array', function() {
      meteorObject.d.splice(1, 1);
      meteorObject.save();

      var doc = TestCollection.findOne(id);

      expect(doc).toDeepEqual({
        _id: id,
        a: 1,
        b: 2,
        d: [1, 3]
      });
    });
  });

  describe('#reset()', function () {
    it('should remove the client property by default', function () {
      meteorObject.clientProp = 'delete';
      meteorObject.reset();

      expect(meteorObject.clientProp).not.toBeDefined('angular meteor object doesnt have client property');
    });

    it('should keep client property when first argument is truthy', function() {
      meteorObject.clientProp = 'delete';
      meteorObject.reset(true);

      expect(meteorObject.clientProp).toBeDefined('angular meteor object has client property');
    });

    it('should delete properties for an object that doesnt exist in the collection', function() {
      var id = 'unexists_test_id';
      var meteorObject = $meteorObject(TestCollection, id, false);

      meteorObject.a = 'a';
      meteorObject.b = 'b';
      meteorObject.reset();

      expect(meteorObject.a).not.toBeDefined();
      expect(meteorObject.b).not.toBeDefined();
    });
  });

  describe('_updateDiff()', function() {
    var Collection;
    var ngObject;
    var id;

    beforeEach(function() {
      id = 'id-01';
      Collection = new Meteor.Collection(null);
      ngObject = $meteorObject(Collection, id);
      spyOn(AngularMeteorCollection, '_updateDiff');
    });

    it('should call collection\'s updateDiff() method with object\'s id', function() {
      var update = {};
      var callback = function() {};
      ngObject._updateDiff(update, callback);
      expect(AngularMeteorCollection._updateDiff).toHaveBeenCalled();
      expect(AngularMeteorCollection._updateDiff.calls.argsFor(0)).toEqual([id, update, callback]);
    });
  });

  describe('#getRawObject()', function() {
    it('should return an object equal to doc', function() {
      var raw = meteorObject.getRawObject();
      var doc = TestCollection.findOne(id);
      expect(raw).toDeepEqual(doc);
    });
  });

  describe('update and data binding', function() {
    beforeEach(function() {
      spyOn(TestCollection, 'update').and.callThrough();
      // Watching changes (auto modifier not set to false)
      meteorObject = $meteorObject(TestCollection, id);
      $rootScope.$apply();
    });

    it('should update nested doc fields on digestion', function() {
      var doc;

      meteorObject.c = { d: 'd' };
      $rootScope.$apply();
      doc = TestCollection.findOne(id);
      expect(meteorObject.getRawObject()).toDeepEqual(doc);
      expect(TestCollection.update.calls.mostRecent().args[0]).toEqual(id);
      expect(TestCollection.update.calls.mostRecent().args[1]).toEqual({ $set: { 'c.d': 'd' } });

      delete meteorObject.c.d;
      $rootScope.$apply();
      doc = TestCollection.findOne(id);
      expect(meteorObject.getRawObject()).toDeepEqual(doc);
      expect(TestCollection.update.calls.mostRecent().args[0]).toEqual(id);
      expect(TestCollection.update.calls.mostRecent().args[1]).toEqual({ $unset: { 'c.d': true } });
    });

    it('should save changes in a nested array', function() {
      meteorObject.d.splice(1,1);

      $rootScope.$apply();

      var doc = TestCollection.findOne(id);

      expect(doc).toDeepEqual({
        _id : id,
        a : 1,
        b : 2,
        d : [1, 3]
      });
    });
  });
});
