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
  }
};
