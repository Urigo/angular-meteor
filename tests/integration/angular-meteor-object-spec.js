describe('$meteorObject service', function () {
  var $meteorObject,
      TestCollection
      id,
      meteorObject;

  beforeEach(angular.mock.module('angular-meteor'));

  beforeEach(angular.mock.inject(function (_$meteorObject_) {
    $meteorObject = _$meteorObject_;
  }));

  beforeEach(function () {
    id = 'test_1'
    var data = { _id: id, a: 1, b: 2 };

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
    meteorObject.clientProp = 'keep'
    TestCollection.remove(id);

    Tracker.flush();

    expect(meteorObject.a).not.toBeDefined();
    expect(meteorObject.b).not.toBeDefined();
    expect(meteorObject._id).not.toBeDefined();
    expect(meteorObject.clientProp).not.toBeDefined();
  });

  describe('#reset()', function () {

    it('should remove the client property', function () {
      meteorObject.clientProp = 'delete';

      meteorObject.reset();

      expect(meteorObject.clientProp).not.toBeDefined('angular meteor object doesnt have client property');
    });
  });
});
