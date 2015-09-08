'use strict';

var module = angular.module('diffArray', ['getUpdates']);

module.factory('diffArray', ['getUpdates',
  function(getUpdates) {
    var idStringify = LocalCollection._idStringify || Package['mongo-id'].MongoID.idStringify;
    var idParse = LocalCollection._idParse || Package['mongo-id'].MongoID.idParse;

    // Calculates the differences between `lastSeqArray` and
    // `seqArray` and calls appropriate functions from `callbacks`.
    // Reuses Minimongo's diff algorithm implementation.
    // XXX Should be replaced with the original diffArray function here:
    // https://github.com/meteor/meteor/blob/devel/packages/observe-sequence/observe_sequence.js#L152
    // When it will become nested as well, tracking here: https://github.com/meteor/meteor/issues/3764
    function diffArray(lastSeqArray, seqArray, callbacks, preventNestedDiff) {
      preventNestedDiff = !!preventNestedDiff;

      var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges ||
        Package['diff-sequence'].DiffSequence.diffQueryOrderedChanges;

      var oldObjIds = [];
      var newObjIds = [];
      var posOld = {}; // maps from idStringify'd ids
      var posNew = {}; // ditto
      var posCur = {};
      var lengthCur = lastSeqArray.length;

      _.each(seqArray, function (doc, i) {
        newObjIds.push({_id: doc._id});
        posNew[idStringify(doc._id)] = i;
      });

      _.each(lastSeqArray, function (doc, i) {
        oldObjIds.push({_id: doc._id});
        posOld[idStringify(doc._id)] = i;
        posCur[idStringify(doc._id)] = i;
      });

      // Arrays can contain arbitrary objects. We don't diff the
      // objects. Instead we always fire 'changedAt' callback on every
      // object. The consumer of `observe-sequence` should deal with
      // it appropriately.
      diffFn(oldObjIds, newObjIds, {
        addedBefore: function (id, doc, before) {
          var position = before ? posCur[idStringify(before)] : lengthCur;

          _.each(posCur, function (pos, id) {
            if (pos >= position) posCur[id]++;
          });

          lengthCur++;
          posCur[idStringify(id)] = position;

          callbacks.addedAt(
            id,
            seqArray[posNew[idStringify(id)]],
            position,
            before
          );
        },

        movedBefore: function (id, before) {
          var prevPosition = posCur[idStringify(id)];
          var position = before ? posCur[idStringify(before)] : lengthCur - 1;

          _.each(posCur, function (pos, id) {
            if (pos >= prevPosition && pos <= position)
              posCur[id]--;
            else if (pos <= prevPosition && pos >= position)
              posCur[id]++;
          });

          posCur[idStringify(id)] = position;

          callbacks.movedTo(
            id,
            seqArray[posNew[idStringify(id)]],
            prevPosition,
            position,
            before
          );
        },
        removed: function (id) {
          var prevPosition = posCur[idStringify(id)];

          _.each(posCur, function (pos, id) {
            if (pos >= prevPosition) posCur[id]--;
          });

          delete posCur[idStringify(id)];
          lengthCur--;

          callbacks.removedAt(
            id,
            lastSeqArray[posOld[idStringify(id)]],
            prevPosition
          );
        }
      });

      _.each(posNew, function (pos, idString) {
        if (!_.has(posOld, idString)) return;

        var id = idParse(idString);
        var newItem = seqArray[pos] || {};
        var oldItem = lastSeqArray[posOld[idString]];
        var updates = getUpdates(oldItem, newItem, preventNestedDiff);
        var setDiff = updates.$set;
        var unsetDiff = updates.$unset;

        if (setDiff)
          setDiff._id = newItem._id;

        if (unsetDiff)
          unsetDiff._id = newItem._id;

        if (setDiff || unsetDiff)
          callbacks.changedAt(id, setDiff, unsetDiff, pos, oldItem);
      });
    }

    diffArray.deepCopyChanges = function (oldItem, newItem) {
      var setDiff = getUpdates(oldItem, newItem).$set;

      _.each(setDiff, function(v, deepKey) {
        setDeep(oldItem, deepKey, v);
      });
    };

    diffArray.deepCopyRemovals = function (oldItem, newItem) {
      var unsetDiff = getUpdates(oldItem, newItem).$unset;

      _.each(unsetDiff, function(v, deepKey) {
        unsetDeep(oldItem, deepKey);
      });
    };

    var setDeep = function(obj, deepKey, v) {
      var split = deepKey.split('.');
      var initialKeys = _.initial(split);
      var lastKey = _.last(split);

      initialKeys.reduce(function(subObj, k, i) {
        var nextKey = split[i + 1];

        if (isNumStr(nextKey)) {
          if (subObj[k] == null) subObj[k] = [];
          if (subObj[k].length == parseInt(nextKey)) subObj[k].push(null);
        }

        else if (subObj[k] == null || !isHash(subObj[k])) {
          subObj[k] = {};
        }

        return subObj[k];
      }, obj);

      getDeep(obj, initialKeys)[lastKey] = v;
      return v;
    };

    var unsetDeep = function(obj, deepKey) {
      var split = deepKey.split('.');
      var initialKeys = _.initial(split);
      var lastKey = _.last(split);
      return delete getDeep(obj, initialKeys)[lastKey];
    };

    var getDeep = function(obj, keys) {
      return keys.reduce(function(subObj, k) {
        return subObj[k];
      }, obj);
    };

    var isHash = function(obj) {
      return _.isObject(obj) &&
             Object.getPrototypeOf(obj) === Object.prototype;
    };

    var isNumStr = function(str) {
      return str.match(/^\d+$/);
    };

    return diffArray;
}]);
