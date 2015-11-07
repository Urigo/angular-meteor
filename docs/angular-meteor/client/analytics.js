// Segment analytics
/*
var segmentApiKey = 'dXcIswCTe94kd8Wrk3znJAeX8cpV10p1';
if (document.location.host.match(/^(www\.)?angular-meteor.com(:80)?$/)) {
  segmentApiKey = ''; // production account
} else {
  segmentApiKey = ''; // test account
}
analytics.load(segmentApiKey);
*/

Router.onRun(function() {
  analytics.page();
  this.next();
});