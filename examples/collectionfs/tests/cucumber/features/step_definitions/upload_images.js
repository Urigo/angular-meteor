(function () {

  'use strict';

  module.exports = function () {

    // You can use normal require here, cucumber is NOT run in a Meteor context (by design)
    var url = require('url');
    var path = require('path');

    this.Given(/^I am a new user$/, function () {
      // no callbacks! DDP has been promisified so you can just return it
      return this.server.call('reset', []); // this.ddp is a connection to the mirror
    });

    this.Given(/^I am on route "([^"]*)"$/, function (relativePath, callback) {
      // WebdriverIO supports Promises/A+ out the box, so you can return that too
      this.browser. // this.browser is a pre-configured WebdriverIO + PhantomJS instance
        url(url.resolve(process.env.HOST, relativePath)). // process.env.HOST always points to the mirror
        call(callback);
    });

    this.Then(/^I should see the title "([^"]*)"$/, function (expectedTitle, callback) {
      // you can use chai-as-promised in step definitions also
      this.browser.
        waitForVisible('h1'). // WebdriverIO chain-able promise magic
        getTitle().should.become(expectedTitle).and.notify(callback);
    });

    this.When(/^I upload a new image$/, function (callback) {
      var filePath = path.join(__filename, '../../../files/face.png');
      this.browser
        //.chooseFile('#upload-file', '/home/netanel/Pictures/hospital.jpg')
        .click('#upload-file')
        .keys(filePath)
        .pause(1000)
        .call(callback);
    });

    this.Then(/^I should see the image in the table$/, function (callback) {
      this.browser
        .getText('table tr:first-child a')
        .should.eventually.equal('face.png').and.notify(callback);
    });

  };

})();
