import {chai} from 'meteor/practicalmeteor:chai';

chai.use(function(chai, utils) {
  utils.addMethod(chai.Assertion.prototype, 'equalCollection', function(expected, msg) {
    var actual = utils.flag(this, 'object');

    actual = _.toArray(actual);
    expected = expected.find({}).fetch();

    new chai.Assertion(actual).to.be.an('array');
    new chai.Assertion(expected).to.be.an('array');

    this.assert(
      utils.eql(actual, expected),
      'expected #{this} to be equal with #{act}',
      'expected #{this} to not be equal with #{act}',
      actual,
      expected
    );
  });
});

chai.use(function(chai, utils) {
  utils.addMethod(chai.Assertion.prototype, 'inCollection', function(collection, msg) {
    var member = utils.flag(this, 'object');
    var expected = collection.findOne(member);

    if (expected)
      delete expected._id;

    this.assert(
      utils.eql(expected, member),
      'expected #{this} to be equal with #{act}',
      'expected #{this} to not be equal with #{act}',
      member,
      expected
    );
  });
});

