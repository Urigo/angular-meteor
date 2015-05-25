describe('$meteorCollection service', function() {
  var $meteorCollection;
  var testObjects = [
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

  beforeEach(angular.mock.inject(function(_$meteorCollection_) {
    $meteorCollection = _$meteorCollection_;
  }));

  it('should return an array with all items in the Mongo Collection', function() {
    // arrange
    var MyCollection = new Mongo.Collection('myCollection');
    MyCollection.insert(testObjects[0]);
    MyCollection.insert(testObjects[1]);
    MyCollection.insert(testObjects[2]);

    var meteorArray = $meteorCollection(MyCollection, false);

    var expectedArray = MyCollection.find({}).fetch();

    expect(meteorArray).toEqual(expectedArray);
  });
});
