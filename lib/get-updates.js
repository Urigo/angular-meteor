'use strict';

// https://github.com/DAB0mB/get-updates
var module = angular.module('getUpdates', []);

var getUpdates = function(src, dst) {
  var diff = getDifference(src, dst);
  var paths = toPaths(diff);

  var set = createSet(paths);
  var unset = createUnset(paths);
  var pull = createPull(unset);

  var updates = {};
  setFilled(updates, '$set', set);
  setFilled(updates, '$unset', unset);
  setFilled(updates, '$pull', pull);

  return updates;
};

var getDifference = function(src, dst) {
  var srcKeys = _.keys(src);
  var dstKeys = _.keys(dst);

  var keys = _.chain([])
    .concat(srcKeys)
    .concat(dstKeys)
    .uniq()
    .value();

  return keys.reduce(function(diff, k) {
    var srcValue = src[k];
    var dstValue = dst[k];

    if (_.isObject(srcValue) && _.isObject(dstValue)) {
      var valueDiff = getDifference(srcValue, dstValue);
      setFilled(diff, k, valueDiff);
    }

    else if (srcValue !== dstValue) {
      diff[k] = dstValue;
    }

    return diff;
  }, {});
};

var toPaths = function(obj) {
  var keys = getKeyPaths(obj);
  var values = getDeepValues(obj);
  return _.object(keys, values);
};

var getKeyPaths = function(obj) {
  var keys = _.keys(obj).map(function(k) {
    var v = obj[k];
    if (!_.isObject(v)) return k;

    return getKeyPaths(v).map(function(subKey) {
      return k + '.' + subKey;
    });
  });

  return _.flatten(keys);
};

var getDeepValues = function(obj) {
  var values = _.values(obj).map(function(v) {
    if (!_.isObject(v))
      return v;
    else
      return getDeepValues(v);
  });

  return _.flatten(values);
};

var createSet = function(paths) {
  return _.omit(paths, _.isUndefined);
};

var createUnset = function(paths) {
  return _.pick(paths, _.isUndefined);
};

var createPull = function(paths) {
  var arrKeyPaths = _.keys(paths).map(function(k) {
    var split = k.match(/(.*)\.\d+$/);
    return split && split[1];
  });

  return _.compact(arrKeyPaths).reduce(function(pull, k) {
    pull[k] = null;
    return pull;
  }, {});
};

var setFilled = function(obj, k, v) {
  if (!_.isEmpty(v)) obj[k] = v;
};

module.value('getUpdates', getUpdates);