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
  toBeFoundInCollection : function() {
    return {
      compare : function(actual, expected) {
        var result = {};
        var expectedItem = expected.findOne(actual);
        result.pass = !_.isUndefined(expectedItem);
        return result;
      }
    };
  }
};
