customMatchers = {
  toEqualCollection : function(util, customEqualityTesters) {
    return {
      compare : function(actual, expected) {
        var result = {};
        var expectedArray = expected.find({}).fetch();
        result.pass = util.equals(actual, expectedArray, customEqualityTesters);
        return result;
      }
    };
  },
  toBeFoundExactlyInCollection : function(util, customEqualityTesters) {
    return {
      compare : function(actual, expected) {
        var result = {};
        var expectedItem = expected.findOne(actual);

        if (_.isUndefined(expectedItem)) {
          result.pass = false;
          result.message = 'Expected ' + JSON.stringify(actual) + ' to be found in collection ' + JSON.stringify(expected.find({}).fetch());
        }
        else {
          delete expectedItem._id;
          result.pass = util.equals(actual, expectedItem, customEqualityTesters);
        }

        if (!result.pass) {
          result.message = 'Expected ' + JSON.stringify(actual) + ' to be found in collection ' + JSON.stringify(expected.find({}).fetch());
        }

        return result;
      }
    };
  }
};
