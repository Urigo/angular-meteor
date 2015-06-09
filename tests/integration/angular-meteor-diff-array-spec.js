describe('diffArray module', function() {
  beforeEach(angular.mock.module('diffArray'));

  describe('diffArray service', function() {
    var diffArray;

    beforeEach(angular.mock.inject(function(_diffArray_) {
      diffArray = _diffArray_;
    }));

    it('should notify addedAt and changedAt changes between two arrays', function() {
      var addedDoc = {_id: "c", b: 1};
      var oldCollection = [
        {_id: "a", identical: "property"},
        {_id: "b", first: 2, second: {firstNested: "b"}, willBeRemoved: ":'("}
      ];
      var newCollection = [
        {_id: "a", identical: "property"},
        {_id: "b", first: 2, second: {nestedInSecond: "a"}, third: "hello"},
        addedDoc
      ];
      var addedAtSpy = jasmine.createSpy('addedAt');
      var changedAtSpy = jasmine.createSpy('changedAt');

      diffArray(oldCollection, newCollection, {
        addedAt: addedAtSpy,
        changedAt: changedAtSpy,
      });

      expect(addedAtSpy).toHaveBeenCalledWith(addedDoc._id, addedDoc, 2, jasmine.any(Object));
      expect(changedAtSpy).toHaveBeenCalledWith(
        'b',
        {_id: "b", "second.nestedInSecond": "a", "third": "hello"},
        {_id: "b", "second.firstNested": true, willBeRemoved: true},
        1,
        jasmine.any(Object));
    });

    describe('when comparing two arrays with two different dates', function() {
      it('should notify callback with changedAt', function() {
        var oldCollection = [{
          _id: "a", date: new Date(1111, 1, 1)
        }];
        var newCollection = [{
          _id: "a", date: new Date(2222, 2, 2)
        }];
        var changedAtSpy = jasmine.createSpy('changedAt');

        diffArray(oldCollection, newCollection, { changedAt: changedAtSpy });

        expect(changedAtSpy).toHaveBeenCalledWith(
          'a',
          {_id: "a", date: new Date(2222, 2, 2)},
          undefined,
          0,
          jasmine.any(Object));
      });
    });
  });
});
