import 'angular-meteor';

import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

describe('$meteorObject service', function () {
  var $meteorObject,
      $rootScope,
      AngularMeteorCollection,
      TestCollection,
      id,
      meteorObject;

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
    // make sure it was unset in mongo
    chai.assert.isUndefined(doc.a, 'document have unset property');

    chai.assert.isUndefined(meteorObject.a, 'angular meteor object have unset property');
  });

  it('should keep the client only property after autorun updates', function () {
    meteorObject.clientProp = 'keep';

    TestCollection.update(id, { $unset: { a: 1 } });

    Tracker.flush();

    var doc = TestCollection.findOne(id);
    // make sure it didn't set to mongo
    chai.assert.isUndefined(doc.clientProp, 'document have client property');

    chai.assert.isUndefined(meteorObject.a,
      'angular meteor object have unset property');
    chai.assert.isDefined(meteorObject.clientProp,
      'angular meteor object doesnt have client property');
  });

  it('should delete server and client side properties when object removed from the collection', function () {
    meteorObject.clientProp = 'keep';
    TestCollection.remove(id);

    Tracker.flush();

    expect(meteorObject.a).to.be.undefined;
    expect(meteorObject.b).to.be.undefined;
    expect(meteorObject._id).to.be.undefined;
    expect(meteorObject.clientProp).to.be.undefined;
  });

  describe('#save()', function() {
    it('should not call save upon init', function() {
      sinon.spy(TestCollection, 'update');
      // Watching changes (auto modifier not set to false)
      $meteorObject(TestCollection, id);
      $rootScope.$apply();

      expect(TestCollection.update.called).to.be.false;
    });
    
    it('should save updates specified', function() {
      meteorObject.save({
        c: 3
      });

      var doc = TestCollection.findOne(id);

      expect(doc).to.deep.equal({
        _id: id,
        a: 1,
        b: 2,
        c: 3,
        d: [1,2,3]
      });

      Tracker.flush();
      expect(meteorObject.getRawObject()).to.deep.equal(doc);
    });

    it('should save object changes if no updates were specified', function() {
      meteorObject.c = 3;
      meteorObject.save();

      var doc = TestCollection.findOne(id);

      expect(doc).to.deep.equal({
        _id: id,
        a: 1,
        b: 2,
        c: 3,
        d: [1,2,3]
      });
    });

    it('should wrap the document if an explicit selector is used', function() {
      var meteorObject = $meteorObject(TestCollection, { _id: id }, false);
      expect(meteorObject.$$id).to.equal(id);
    });

    it('should ignore skip and limit selection options', function() {
      var meteorObject = $meteorObject(TestCollection, { _id: id }, false, { skip: 1, limit: 1000 });
      expect(meteorObject.$$id).to.equal(id);
    });

    it('should create a new document if object does not exist', function() {
      var id = 'test_2';
      var meteorObject = $meteorObject(TestCollection, id, false);
      meteorObject.save();

      var doc = TestCollection.findOne(id);
      expect(doc._id).to.equal(id);
    });

    it('should create a new document if object does not exist and no id is defined', function() {
      var meteorObject = $meteorObject(TestCollection, undefined, false);
      meteorObject.save();

      Tracker.flush();
      var id = meteorObject._id;

      var doc = TestCollection.findOne(id);
      expect(doc._id).to.equal(id);
    });

    it('should save an object with a spliced array', function() {
      meteorObject.d.splice(1, 1);
      meteorObject.save();

      var doc = TestCollection.findOne(id);

      expect(doc).to.deep.equal({
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

      chai.assert.isUndefined(meteorObject.clientProp,
        'angular meteor object doesnt have client property');
    });

    it('should keep client property when first argument is truthy', function() {
      meteorObject.clientProp = 'delete';
      meteorObject.reset(true);

      chai.assert.isDefined(meteorObject.clientProp,
        'angular meteor object has client property');
    });

    it('should delete properties for an object that doesnt exist in the collection', function() {
      var id = 'unexists_test_id';
      var meteorObject = $meteorObject(TestCollection, id, false);

      meteorObject.a = 'a';
      meteorObject.b = 'b';
      meteorObject.reset();

      expect(meteorObject.a).to.be.undefined;
      expect(meteorObject.b).to.be.undefined;
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
      sinon.stub(AngularMeteorCollection, '_updateDiff');
    });

    afterEach(function() {
      AngularMeteorCollection._updateDiff.restore();
    });

    it('should call collection\'s updateDiff() method with object\'s id', function() {
      var update = {};
      var callback = function() {};
      ngObject._updateDiff(update, callback);
      expect(AngularMeteorCollection._updateDiff.called).to.be.true;
      expect(AngularMeteorCollection._updateDiff.args[0]).to.deep.equal([id, update, callback]);
    });
  });

  describe('#getRawObject()', function() {
    it('should return an object equal to doc', function() {
      var raw = meteorObject.getRawObject();
      var doc = TestCollection.findOne(id);
      expect(raw).to.deep.equal(doc);
    });
  });

  describe('update and data binding', function() {
    beforeEach(function() {
      sinon.spy(TestCollection, 'update');
      // Watching changes (auto modifier not set to false)
      meteorObject = $meteorObject(TestCollection, id);
      $rootScope.$apply();
    });

    afterEach(function() {
      TestCollection.update.restore();
    });

    it('should update nested doc fields on digestion', function() {
      var doc;

      meteorObject.c = { d: 'd' };
      $rootScope.$apply();
      doc = TestCollection.findOne(id);
      expect(meteorObject.getRawObject()).to.deep.equal(doc);
      expect(TestCollection.update.args[0][0]).to.equal(id);
      expect(TestCollection.update.args[0][1]).to.deep.equal({ $set: { 'c.d': 'd' } });

      delete meteorObject.c.d;
      $rootScope.$apply();
      doc = TestCollection.findOne(id);
      expect(meteorObject.getRawObject()).to.deep.equal(doc);
      expect(TestCollection.update.args[1][0]).to.equal(id);
      expect(TestCollection.update.args[1][1]).to.deep.equal({ $unset: { 'c.d': true } });
    });

    it('should save changes in a nested array', function() {
      meteorObject.d.splice(1,1);

      $rootScope.$apply();

      var doc = TestCollection.findOne(id);

      expect(doc).to.deep.equal({
        _id : id,
        a : 1,
        b : 2,
        d : [1, 3]
      });
    });
  });
});
