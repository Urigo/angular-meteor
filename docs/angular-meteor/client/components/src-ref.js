Template.srcRef.onCreated(function() {
  var data = this.data;
  if (!_.isString(data.root)) data.root = '';
  if (!_.isString(data.src)) data.src = '';

  var match = data.src.match(/^(.*\.js)(?:#L(.*))?$/) || [null, data.src];
  data.path = match[1];
  data.line = match[2];
});