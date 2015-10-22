'use strict';

// https://github.com/DAB0mB/get-updates
(function() {
  var module = angular.module('getUpdates', []);

  var utils = (function() {
    var rip = function(obj, level) {
      if (level < 1) return {};

      return _.reduce(obj, function(clone, v, k) {
        v = _.isObject(v) ? rip(v, --level) : v;
        clone[k] = v;
        return clone;
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
        if (!_.isObject(v) || _.isEmpty(v) || _.isArray(v)) return k;

        return getKeyPaths(v).map(function(subKey) {
          return k + '.' + subKey;
        });
      });

      return _.flatten(keys);
    };

    var getDeepValues = function(obj,arr) {
      arr = arr || [];

      _.values(obj).forEach(function(v) {
        if (!_.isObject(v) || _.isEmpty(v) || _.isArray(v))
          arr.push(v);
        else
          getDeepValues(v, arr);
      });

      return arr;
    };

    var flatten = function(arr) {
      return arr.reduce(function(flattened, v, i) {
        if (_.isArray(v) && !_.isEmpty(v))
          flattened.push.apply(flattened, flatten(v));
        else
          flattened.push(v);

        return flattened;
      }, []);
    };

    var setFilled = function(obj, k, v) {
      if (!_.isEmpty(v)) obj[k] = v;
    };

    var assert = function(result, msg) {
      if (!result) throwErr(msg);
    };

    var throwErr = function(msg) {
      throw Error('get-updates error - ' + msg);
    };

    return {
      rip: rip,
      toPaths: toPaths,
      getKeyPaths: getKeyPaths,
      getDeepValues: getDeepValues,
      setFilled: setFilled,
      assert: assert,
      throwErr: throwErr
    };
  })();

  var getDifferences = (function () {
    var getDifferences = function (src, dst, isShallow) {
      var level;

      if (isShallow > 1)
        level = isShallow;
      else if (isShallow)
        level = 1;

      if (level) {
        src = utils.rip(src, level);
        dst = utils.rip(dst, level);
      }

      return compare(src, dst);
    };

    var compare = function(src, dst) {
      var srcKeys = _.keys(src);
      var dstKeys = _.keys(dst);

      var keys = _.chain([])
        .concat(srcKeys)
        .concat(dstKeys)
        .uniq()
        .without('$$hashKey')
        .value();

      return keys.reduce(function(diff, k) {
        var srcValue = src[k];
        var dstValue = dst[k];

        if (_.isDate(srcValue) && _.isDate(dstValue)) {
          if (srcValue.getTime() != dstValue.getTime()) diff.forSet[k] = dstValue;
        }

        if (_.isObject(srcValue) && _.isObject(dstValue)) {
          var valueDiff = getDifferences(srcValue, dstValue);
          utils.setFilled(diff.forSet, k, valueDiff.forSet);
          utils.setFilled(diff.forUnset, k, valueDiff.forUnset);
          utils.setFilled(diff.forPush, k, valueDiff.forPush);
        }
        else if (_.isUndefined(srcValue) && _.isArray(dstValue) && dstValue.length > 0) {
          diff.forPush[k] = dstValue;
        } else if (srcValue !== dstValue) {
          if (_.isUndefined(dstValue)) {
            diff.forUnset[k] = dstValue;
          } else {
            diff.forSet[k] = dstValue;
          }
        }

        return diff;
      }, { forSet:{}, forUnset:{}, forPush:{} });
    };

    return getDifferences;
  })();

  var getUpdates = (function () {
    var getUpdates = function (src, dst, isShallow) {
      utils.assert(_.isObject(src), 'first argument must be an object');
      utils.assert(_.isObject(dst), 'second argument must be an object');

      var diffs = getDifferences(src, dst, isShallow);
      var pathsForSet = utils.toPaths(diffs.forSet);
      var pathsForUnset = utils.toPaths(diffs.forUnset);
      var pathsForPush = utils.toPaths(diffs.forPush);

      var set = createSet(pathsForSet);
      var unset = createUnset(pathsForUnset);
      var pull = createPull(pathsForUnset);
      var push = createPush(pathsForPush);

      var updates = {};
      utils.setFilled(updates, '$set', set);
      utils.setFilled(updates, '$unset', unset);
      utils.setFilled(updates, '$pull', pull);
      utils.setFilled(updates, '$push', push);

      return updates;
    };

    var createPush = function (pathsForPush) {
      return _.reduce(pathsForPush, function (result, v, k) {
        result[k] = v.length == 1 ? v[0] : {$each: v};
        return result;
      }, {});
    };

    var createSet = function(pathsForSet) {
      return pathsForSet;
    };

    var createUnset = function(pathsForUnset) {
      return _.reduce(pathsForUnset, function(result, v, k) {
        result[k] = true;
        return result;
      }, {});
    };

    var createPull = function(pathsForUnset) {
      var arrKeyPaths = _.keys(pathsForUnset).map(function(k) {
        var split = k.match(/(.*)\.\d+$/);
        return split && split[1];
      });

      return _.compact(arrKeyPaths).reduce(function(pull, k) {
        pull[k] = null;
        return pull;
      }, {});
    };

    return getUpdates;
  })();

  module.value('getUpdates', getUpdates);
})();
