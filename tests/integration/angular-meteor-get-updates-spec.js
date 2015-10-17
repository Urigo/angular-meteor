describe('getUpdates module', function() {
  var getUpdates;

  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  beforeEach(angular.mock.module('getUpdates'));

  beforeEach(angular.mock.inject(function(_getUpdates_) {
    getUpdates = _getUpdates_;
  }));

  describe('validations', function() {
    it('should throw an error if first argument is not an object', function() {
      var boundGetUpdates = _.partial(getUpdates);
      expect(boundGetUpdates).toThrowError(/first argument.*object/);
    });

    it('should throw an error if second argument is not an object', function() {
      var boundGetUpdates = _.partial(getUpdates, {});
      expect(boundGetUpdates).toThrowError(/second argument.*object/);
    });
  });

  describe('functionality', function() {
    it('should define a "$set" property when the destination object has extra properties', function() {
      var src = {
        a: 'a',
        b: {
          c: 'c'
        },
        d: [1, 2, 3]
      };

      var dst = {
        a: 'a',
        b: {
          c: 'c',
          e: 'e'
        },
        d: [1, 2, 4, 3]
      };

      var expectedUpdates = {
        $set: {
          'b.e': 'e',
          'd.2': 4,
          'd.3': 3
        }
      };

      var actualUpdates = getUpdates(src, dst);
      expect(actualUpdates).toDeepEqual(expectedUpdates);
    });

    it('should define an "$unset" property when the destination object has missing properties', function() {
      var src = {
        a: 'a',
        b: {
          c: 'c',
          e: 'e'
        }
      };

      var dst = {
        b: {
          c: 'c'
        }
      };

      var expectedUpdates = {
        $unset: {
          'a': true,
          'b.e': true
        }
      };

      var actualUpdates = getUpdates(src, dst);
      expect(actualUpdates).toDeepEqual(expectedUpdates);
    });

    it('should define a "$pull" property when the destination object has an array value with missing elements', function() {
      var src = {
        arr: [1, 2, 3, 4, 5]
      };

      var dst = {
        arr: [1, 2, 3]
      };

      var expectedUpdates = {
        $unset: {
          'arr.3': true,
          'arr.4': true
        },

        $pull: {
          'arr': null
        }
      };

      var actualUpdates = getUpdates(src, dst);
      expect(actualUpdates).toDeepEqual(expectedUpdates);
    });

    it('should get updates when object-field is assigned a deep-object', function() {
      var src = {a: {}};
      var dst = {a: {L1: {L2: {L3: 'v'}}}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.L1.L2.L3': 'v'
        }
      });
    });

    it('should get updates when array-field is assigned a deep-object', function() {
      var src = {a: []};
      var dst = {a: {L1: {L2: {L3: 'v'}}}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.L1.L2.L3': 'v'
        }
      });
    });

    it('should get updates when primitive-field is assigned a deep-object', function() {
      var src = {a: 1};
      var dst = {a: {L1: {L2: {L3: 'v'}}}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.L1.L2.L3': 'v'
        }
      });
    });

    it('should get updates when falsy primitive-field is assigned a deep-object', function() {
      var src = {a: 0};
      var dst = {a: {L1: {L2: {L3: 'v'}}}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.L1.L2.L3': 'v'
        }
      });
    });

    it('should get updates when null-field is assigned a deep-object', function() {
      var src = {a: null};
      var dst = {a: {L1: {L2: {L3: 'v'}}}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.L1.L2.L3': 'v'
        }
      });
    });

    it('should get updates when null-field is assigned a shallow-object', function() {
      var src = {a: null};
      var dst = {a: {subfield: 'v'}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.subfield': 'v'
        }
      });
    });

    it('should get updates when null-field is assigned a array-object', function() {
      var src = {a: null};
      var dst = {a: [1, 2, 3]};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a': [1, 2, 3]
        }
      });
    });

    it('should get updates when nested-object is nulled', function() {
      var src = {a: {subfield: 'v'}};
      var dst = {a: null};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a': null
        }
      });
    });

    it('should get updates when non-null-subfield is nulled', function() {
      var src = {a: {subfield: 'v'}};
      var dst = {a: {subfield: null}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.subfield': null
        }
      });
    });

    it('should get updates when null-subfield is assigned a primitive', function() {
      var src = {a: {subfield: null}};
      var dst = {a: {subfield: 'v'}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.subfield': 'v'
        }
      });
    });

    it('should get updates when null-subfield is assigned a array-object', function() {
      var src = {a: {subfield: null}};
      var dst = {a: {subfield: [1, 2, 3]}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.subfield': [1, 2, 3]
        }
      });
    });

    it('should get updates when deep-field is assigned a primitive', function() {
      var src = {a: {L1: {L2: {L3: 0}}}};
      var dst = {a: {L1: {L2: {L3: 1}}}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.L1.L2.L3': 1
        }
      });
    });

    it('should get updates when deep-field is assigned a deep-object', function() {
      var src = {a: {L1: null}};
      var dst = {a: {L1: {L2: {L3: 1}}}};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          'a.L1.L2.L3': 1
        }
      });
    });

    it('should get updates when when a date field is assigned an equal date', function() {
      var src = {a: new Date("October 13, 2014 11:13:00")};
      var dst = {a: new Date("October 13, 2014 11:13:00")};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({});
    });

    it('should get updates when a date field is assigned a new date', function() {
      var src = {a: new Date("October 13, 2014 11:13:00")};
      var dst = {a: new Date("January 15, 2015 10:14:00")};
      var updates = getUpdates(src, dst);

      expect(updates).toDeepEqual({
        $set: {
          a: new Date("January 15, 2015 10:14:00")
        }
      });
    });
  });

  describe('"isShallow" option', function() {
    it('should return shallow updates if option is truthy', function() {
      var src = {
        a: 'a',
        b: {
          c: 'c'
        }
      };

      var dst = {
        a: 'changed',
        b: {
          c: 'changed'
        }
      };

      var expectedUpdates = {
        $set: {
          'a': 'changed',
        }
      };

      var actualUpdates = getUpdates(src, dst, true);
      expect(actualUpdates).toDeepEqual(expectedUpdates);
    });

    it('should return limited updates as specified if option is a number bigger than 1', function() {
      var src = {
        a: 'a',
        b: {
          c: 'c',
          d: {
            e: 'd'
          }
        }
      };

      var dst = {
        a: 'changed',
        b: {
          c: 'changed',
          d: {
            e: 'changed'
          }
        }
      };

      var expectedUpdates = {
        $set: {
          'a': 'changed',
          'b.c': 'changed'
        }
      };

      var actualUpdates = getUpdates(src, dst, 2);
      expect(actualUpdates).toDeepEqual(expectedUpdates);
    });
  });
});
