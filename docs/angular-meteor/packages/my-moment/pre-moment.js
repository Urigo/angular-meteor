module = {
  // Will be replaced by "moment".
  exports: true
};
// Fool moment.js into not ever setting window.moment.
// The Meteor package system will do that.
//
// This also happens to work around a JS bug in Safari 7
// where application code gets the wrong value for moment.
ender = true;
