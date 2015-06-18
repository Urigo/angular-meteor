describe('diffArray module', function() {
  beforeEach(angular.mock.module('diffArray'));

  describe('diffArray service', function() {
    var diffArray,
        deepCopyRemovals,
        deepCopyChanges;

    beforeEach(angular.mock.inject(function(_diffArray_, _deepCopyRemovals_, _deepCopyChanges_) {
      diffArray = _diffArray_;
      deepCopyRemovals = _deepCopyRemovals_;
      deepCopyChanges = _deepCopyChanges_;
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

        expect(function(){diffArray(oldCollection, newCollection, { changedAt: changedAtSpy })}).not.toThrow();

        expect(changedAtSpy).toHaveBeenCalledWith(
          'a',
          {_id: "a", date: new Date(2222, 2, 2)},
          undefined,
          0,
          jasmine.any(Object));
      });
    });

    describe('no exception on first compare and ignore $$hashkeys', function() {
      it('should notify callback with changedAt', function() {
        var oldCollection = [{
          _id: "a", date: new Date(1111, 1, 1), checked: true, $$hashKey: "object:4"
        },
        {
          _id: "b", date: new Date(2222, 2, 2), checked: true, $$hashKey: "object:6"
        },
        {
          _id: "c", date: new Date(2222, 2, 2), checked: true, $$hashKey: "object:8"
        }];
        var newCollection = [{
          _id: "a", date: new Date(1111, 1, 1), checked: true
        },
        {
          _id: "b", date: new Date(2222, 2, 2), checked: false
        },
        {
          _id: "c", date: new Date(2222, 2, 2), checked: true
        }];
        var changedAtSpy = jasmine.createSpy('changedAt');

        expect(function(){diffArray(oldCollection, newCollection, { changedAt: changedAtSpy })}).not.toThrow();

        expect(changedAtSpy).toHaveBeenCalledWith(
          'b',
          {checked: false, _id: "b"},
          undefined,
          1,
          jasmine.any(Object));
      });
    });

    describe('deepCopyRemovals', function() {
      it('should handle fields that are false-y correctly', function() {
        var oldItem = {_id: 1, field : 0, another : 3};
        var newItem = {_id: 1, field : 0};

        deepCopyRemovals(oldItem, newItem);

        expect(oldItem).toEqual(newItem);
      });

      it('should not remove fields with null value', function() {
        var oldItem = {_id: 1, field : 0, another : 3};
        var newItem = {_id: 1, field : 0, another: null};
        var oldItemBefore = angular.copy(oldItem);

        deepCopyRemovals(oldItem, newItem);

        expect(oldItem).toEqual(oldItemBefore);
      });
    });

    describe('deepCopyChanges', function() {
      it('should copy null values', function() {
        var oldItem = {_id: 1, field : 0, another : 3};
        var newItem = {_id: 1, field : 0, another: null};

        deepCopyChanges(oldItem, newItem);

        expect(oldItem).toEqual(newItem);
      });
      it('should copy new values', function() {
        var oldItem = {
            
        };
        var newItem = {
          "copies": {
            "images": {
              "name": "somthing.png",
              "type": "image/png",
              "size": 4508257
            }
          }
        };

        deepCopyChanges(oldItem, newItem);

        expect(oldItem).toEqual(newItem);
      });
    });
      
  });
});
