'use strict';

var module = angular.module('diffArray', []);

var idStringify = LocalCollection._idStringify;
var idParse = LocalCollection._idParse;

// Calculates the differences between `lastSeqArray` and
// `seqArray` and calls appropriate functions from `callbacks`.
// Reuses Minimongo's diff algorithm implementation.
var diffArray = function (lastSeqArray, seqArray, callbacks) {
  var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges;
  var oldIdObjects = [];
  var newIdObjects = [];
  var posOld = {}; // maps from idStringify'd ids
  var posNew = {}; // ditto
  var posCur = {};
  var lengthCur = lastSeqArray.length;

  _.each(seqArray, function (doc, i) {
    newIdObjects.push({_id: doc._id});
    posNew[idStringify(doc._id)] = i;
  });
  _.each(lastSeqArray, function (doc, i) {
    oldIdObjects.push({_id: doc._id});
    posOld[idStringify(doc._id)] = i;
    posCur[idStringify(doc._id)] = i;
  });

  // Arrays can contain arbitrary objects. We don't diff the
  // objects. Instead we always fire 'changedAt' callback on every
  // object. The consumer of `observe-sequence` should deal with
  // it appropriately.
  diffFn(oldIdObjects, newIdObjects, {
    addedBefore: function (id, doc, before) {
      var position = before ? posCur[idStringify(before)] : lengthCur;

      _.each(posCur, function (pos, id) {
        if (pos >= position)
          posCur[id]++;
      });

      lengthCur++;
      posCur[idStringify(id)] = position;

      callbacks.addedAt(
        id,
        seqArray[posNew[idStringify(id)]],
        position,
        before);
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
        before);
    },
    removed: function (id) {
      var prevPosition = posCur[idStringify(id)];

      _.each(posCur, function (pos, id) {
        if (pos >= prevPosition)
          posCur[id]--;
      });

      delete posCur[idStringify(id)];
      lengthCur--;

      callbacks.removedAt(
        id,
        lastSeqArray[posOld[idStringify(id)]],
        prevPosition);
    }
  });

  _.each(posNew, function (pos, idString) {
    var id = idParse(idString);

    if (_.has(posOld, idString)) {
      var newItem = seqArray[pos];
      var oldItem = lastSeqArray[posOld[idString]];
      var setDiff = diffObjectChanges(oldItem, newItem);
      var unsetDiff = diffObjectRemovals(oldItem, newItem);

      if (setDiff)
        setDiff._id = newItem._id;

      if (unsetDiff)
        unsetDiff._id = newItem._id;

      if (setDiff || unsetDiff)
        callbacks.changedAt(id, setDiff, unsetDiff, pos, oldItem);
    }
  });
};

// Takes an object and returns a shallow copy, ie. with all keys at
// a one-level depth. Transforms the name of each key using dot notation
var flattenObject = function (object, parentKey) {
  var flattened = {};

  angular.forEach(object, function (value, key) {
    if (isActualObject(value)) {
      angular.extend(flattened, flattenObject(value, key));
    } else {
      var dotNotedKey = (parentKey) ? parentKey + "." + key : key;
      flattened[dotNotedKey] = value;
    }
  });

  return flattened;
};

// Can tell whether a value is an object and not an array
var isActualObject = function (value) {
  return angular.isObject(value) && !angular.isArray(value);
};

// Diffs two objects and returns the keys that have been added or changed.
// Can be used to construct a Mongo {$set: {}} modifier
var diffObjectChanges = function (oldItem, newItem) {
  var result = {};

  angular.forEach(newItem, function (value, key) {
    if (oldItem && angular.equals(value, oldItem[key]))
      return;

    if (isActualObject(value)) {
      var diff = diffObjectChanges(oldItem[key], value);
      if (diff) result[key] = diff;
    } else {
      result[key] = value;
    }

    // If a nested object is identical between newItem and oldItem, it
    // is initially attached as an empty object. Here we remove it from
    // the result if it was not empty from the beginning.
    if (isActualObject(result[key]) && _.keys(result[key]).length === 0) {
      if (_.keys(value).length !== 0)
        delete result[key];
    }
  });

  if (!(_.keys(result).length > 0 && !(_.keys(result).length === 1 && result.$$hashKey)))
    return undefined;
  else
    return flattenObject(result);
};

// Diffs two objects and returns the keys that have been removed.
// Can be used to construct a Mongo {$unset: {}} modifier
var diffObjectRemovals = function (oldItem, newItem) {
  if (newItem == null)
    return true;

  var oldItemKeys = _.keys(oldItem);
  var newItemKeys = _.keys(newItem);
  var result = {};

  angular.forEach(oldItemKeys, function (key) {
    if (!_.contains(newItemKeys, key))
      result[key] = true;

    if (isActualObject(oldItem[key])) {
      var diff = diffObjectRemovals(oldItem[key], newItem[key]);
      if (diff) result[key] = diff;
    }
  });

  if (_.keys(result).length === 0)
    return undefined;
  else
    return flattenObject(result);
};

// Diffs two objects and returns the keys that have been added or changed.
// Can be used to construct a Mongo {$set: {}} modifier
var deepCopyObjectChanges = function (oldItem, newItem) {

  angular.forEach(newItem, function (value, key) {
    if (oldItem && angular.equals(value, oldItem[key]))
      return;

    if (isActualObject(value)) {
      if (!oldItem[key])
        oldItem[key] = value;
      else
        deepCopyObjectChanges(oldItem[key], value);
    } else {
      oldItem[key] = value;
    }
  });
};

var deepCopyObjectRemovals = function (oldItem, newItem) {
  var oldItemKeys = _.keys(oldItem);
  var newItemKeys = _.keys(newItem);

  angular.forEach(oldItemKeys, function (key) {
    if (!_.contains(newItemKeys, key) ||
        !newItem[key] ||
        newItem[key] == null)
      delete oldItem[key];
    else {
      if (isActualObject(oldItem[key])) {
        deepCopyObjectRemovals(oldItem[key], newItem[key]);
      }
    }
  });
};

module.value('diffArray', diffArray);
module.value('deepCopyChanges', deepCopyObjectChanges);
module.value('deepCopyRemovals', deepCopyObjectRemovals);
