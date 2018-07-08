import assert from 'assert';

describe('angular-cli-meteor', function () {
  it('package.json has correct name', async function () {
    const { name } = await import('../package.json');
    assert.strictEqual(name, 'angular-cli-meteor');
  });

  it('server is not client', function () {
    assert.strictEqual(Meteor.isClient, false);
  });
});
