//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var MongoID = Package['mongo-id'].MongoID;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var _ = Package.underscore._;
var Random = Package.random.Random;

/* Package-scope variables */
var ObserveSequence, seqChangedToEmpty, seqChangedToArray, seqChangedToCursor;

(function(){

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/observe-sequence/observe_sequence.js                                 //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var warn = function () {                                                         // 1
  if (ObserveSequence._suppressWarnings) {                                       // 2
    ObserveSequence._suppressWarnings--;                                         // 3
  } else {                                                                       // 4
    if (typeof console !== 'undefined' && console.warn)                          // 5
      console.warn.apply(console, arguments);                                    // 6
                                                                                 // 7
    ObserveSequence._loggedWarnings++;                                           // 8
  }                                                                              // 9
};                                                                               // 10
                                                                                 // 11
var idStringify = MongoID.idStringify;                                           // 12
var idParse = MongoID.idParse;                                                   // 13
                                                                                 // 14
ObserveSequence = {                                                              // 15
  _suppressWarnings: 0,                                                          // 16
  _loggedWarnings: 0,                                                            // 17
                                                                                 // 18
  // A mechanism similar to cursor.observe which receives a reactive             // 19
  // function returning a sequence type and firing appropriate callbacks         // 20
  // when the value changes.                                                     // 21
  //                                                                             // 22
  // @param sequenceFunc {Function} a reactive function returning a              // 23
  //     sequence type. The currently supported sequence types are:              // 24
  //     Array, Cursor, and null.                                                // 25
  //                                                                             // 26
  // @param callbacks {Object} similar to a specific subset of                   // 27
  //     callbacks passed to `cursor.observe`                                    // 28
  //     (http://docs.meteor.com/#observe), with minor variations to             // 29
  //     support the fact that not all sequences contain objects with            // 30
  //     _id fields.  Specifically:                                              // 31
  //                                                                             // 32
  //     * addedAt(id, item, atIndex, beforeId)                                  // 33
  //     * changedAt(id, newItem, oldItem, atIndex)                              // 34
  //     * removedAt(id, oldItem, atIndex)                                       // 35
  //     * movedTo(id, item, fromIndex, toIndex, beforeId)                       // 36
  //                                                                             // 37
  // @returns {Object(stop: Function)} call 'stop' on the return value           // 38
  //     to stop observing this sequence function.                               // 39
  //                                                                             // 40
  // We don't make any assumptions about our ability to compare sequence         // 41
  // elements (ie, we don't assume EJSON.equals works; maybe there is extra      // 42
  // state/random methods on the objects) so unlike cursor.observe, we may       // 43
  // sometimes call changedAt() when nothing actually changed.                   // 44
  // XXX consider if we *can* make the stronger assumption and avoid             // 45
  //     no-op changedAt calls (in some cases?)                                  // 46
  //                                                                             // 47
  // XXX currently only supports the callbacks used by our                       // 48
  // implementation of {{#each}}, but this can be expanded.                      // 49
  //                                                                             // 50
  // XXX #each doesn't use the indices (though we'll eventually need             // 51
  // a way to get them when we support `@index`), but calling                    // 52
  // `cursor.observe` causes the index to be calculated on every                 // 53
  // callback using a linear scan (unless you turn it off by passing             // 54
  // `_no_indices`).  Any way to avoid calculating indices on a pure             // 55
  // cursor observe like we used to?                                             // 56
  observe: function (sequenceFunc, callbacks) {                                  // 57
    var lastSeq = null;                                                          // 58
    var activeObserveHandle = null;                                              // 59
                                                                                 // 60
    // 'lastSeqArray' contains the previous value of the sequence                // 61
    // we're observing. It is an array of objects with '_id' and                 // 62
    // 'item' fields.  'item' is the element in the array, or the                // 63
    // document in the cursor.                                                   // 64
    //                                                                           // 65
    // '_id' is whichever of the following is relevant, unless it has            // 66
    // already appeared -- in which case it's randomly generated.                // 67
    //                                                                           // 68
    // * if 'item' is an object:                                                 // 69
    //   * an '_id' field, if present                                            // 70
    //   * otherwise, the index in the array                                     // 71
    //                                                                           // 72
    // * if 'item' is a number or string, use that value                         // 73
    //                                                                           // 74
    // XXX this can be generalized by allowing {{#each}} to accept a             // 75
    // general 'key' argument which could be a function, a dotted                // 76
    // field name, or the special @index value.                                  // 77
    var lastSeqArray = []; // elements are objects of form {_id, item}           // 78
    var computation = Tracker.autorun(function () {                              // 79
      var seq = sequenceFunc();                                                  // 80
                                                                                 // 81
      Tracker.nonreactive(function () {                                          // 82
        var seqArray; // same structure as `lastSeqArray` above.                 // 83
                                                                                 // 84
        if (activeObserveHandle) {                                               // 85
          // If we were previously observing a cursor, replace lastSeqArray with
          // more up-to-date information.  Then stop the old observe.            // 87
          lastSeqArray = _.map(lastSeq.fetch(), function (doc) {                 // 88
            return {_id: doc._id, item: doc};                                    // 89
          });                                                                    // 90
          activeObserveHandle.stop();                                            // 91
          activeObserveHandle = null;                                            // 92
        }                                                                        // 93
                                                                                 // 94
        if (!seq) {                                                              // 95
          seqArray = seqChangedToEmpty(lastSeqArray, callbacks);                 // 96
        } else if (seq instanceof Array) {                                       // 97
          seqArray = seqChangedToArray(lastSeqArray, seq, callbacks);            // 98
        } else if (isStoreCursor(seq)) {                                         // 99
          var result /* [seqArray, activeObserveHandle] */ =                     // 100
                seqChangedToCursor(lastSeqArray, seq, callbacks);                // 101
          seqArray = result[0];                                                  // 102
          activeObserveHandle = result[1];                                       // 103
        } else {                                                                 // 104
          throw badSequenceError();                                              // 105
        }                                                                        // 106
                                                                                 // 107
        diffArray(lastSeqArray, seqArray, callbacks);                            // 108
        lastSeq = seq;                                                           // 109
        lastSeqArray = seqArray;                                                 // 110
      });                                                                        // 111
    });                                                                          // 112
                                                                                 // 113
    return {                                                                     // 114
      stop: function () {                                                        // 115
        computation.stop();                                                      // 116
        if (activeObserveHandle)                                                 // 117
          activeObserveHandle.stop();                                            // 118
      }                                                                          // 119
    };                                                                           // 120
  },                                                                             // 121
                                                                                 // 122
  // Fetch the items of `seq` into an array, where `seq` is of one of the        // 123
  // sequence types accepted by `observe`.  If `seq` is a cursor, a              // 124
  // dependency is established.                                                  // 125
  fetch: function (seq) {                                                        // 126
    if (!seq) {                                                                  // 127
      return [];                                                                 // 128
    } else if (seq instanceof Array) {                                           // 129
      return seq;                                                                // 130
    } else if (isStoreCursor(seq)) {                                             // 131
      return seq.fetch();                                                        // 132
    } else {                                                                     // 133
      throw badSequenceError();                                                  // 134
    }                                                                            // 135
  }                                                                              // 136
};                                                                               // 137
                                                                                 // 138
var badSequenceError = function () {                                             // 139
  return new Error("{{#each}} currently only accepts " +                         // 140
                   "arrays, cursors or falsey values.");                         // 141
};                                                                               // 142
                                                                                 // 143
var isStoreCursor = function (cursor) {                                          // 144
  return cursor && _.isObject(cursor) &&                                         // 145
    _.isFunction(cursor.observe) && _.isFunction(cursor.fetch);                  // 146
};                                                                               // 147
                                                                                 // 148
// Calculates the differences between `lastSeqArray` and                         // 149
// `seqArray` and calls appropriate functions from `callbacks`.                  // 150
// Reuses Minimongo's diff algorithm implementation.                             // 151
var diffArray = function (lastSeqArray, seqArray, callbacks) {                   // 152
  var diffFn = Package['diff-sequence'].DiffSequence.diffQueryOrderedChanges;    // 153
  var oldIdObjects = [];                                                         // 154
  var newIdObjects = [];                                                         // 155
  var posOld = {}; // maps from idStringify'd ids                                // 156
  var posNew = {}; // ditto                                                      // 157
  var posCur = {};                                                               // 158
  var lengthCur = lastSeqArray.length;                                           // 159
                                                                                 // 160
  _.each(seqArray, function (doc, i) {                                           // 161
    newIdObjects.push({_id: doc._id});                                           // 162
    posNew[idStringify(doc._id)] = i;                                            // 163
  });                                                                            // 164
  _.each(lastSeqArray, function (doc, i) {                                       // 165
    oldIdObjects.push({_id: doc._id});                                           // 166
    posOld[idStringify(doc._id)] = i;                                            // 167
    posCur[idStringify(doc._id)] = i;                                            // 168
  });                                                                            // 169
                                                                                 // 170
  // Arrays can contain arbitrary objects. We don't diff the                     // 171
  // objects. Instead we always fire 'changedAt' callback on every               // 172
  // object. The consumer of `observe-sequence` should deal with                 // 173
  // it appropriately.                                                           // 174
  diffFn(oldIdObjects, newIdObjects, {                                           // 175
    addedBefore: function (id, doc, before) {                                    // 176
      var position = before ? posCur[idStringify(before)] : lengthCur;           // 177
                                                                                 // 178
      if (before) {                                                              // 179
        // If not adding at the end, we need to update indexes.                  // 180
        // XXX this can still be improved greatly!                               // 181
        _.each(posCur, function (pos, id) {                                      // 182
          if (pos >= position)                                                   // 183
            posCur[id]++;                                                        // 184
        });                                                                      // 185
      }                                                                          // 186
                                                                                 // 187
      lengthCur++;                                                               // 188
      posCur[idStringify(id)] = position;                                        // 189
                                                                                 // 190
      callbacks.addedAt(                                                         // 191
        id,                                                                      // 192
        seqArray[posNew[idStringify(id)]].item,                                  // 193
        position,                                                                // 194
        before);                                                                 // 195
    },                                                                           // 196
    movedBefore: function (id, before) {                                         // 197
      if (id === before)                                                         // 198
        return;                                                                  // 199
                                                                                 // 200
      var oldPosition = posCur[idStringify(id)];                                 // 201
      var newPosition = before ? posCur[idStringify(before)] : lengthCur;        // 202
                                                                                 // 203
      // Moving the item forward. The new element is losing one position as it   // 204
      // was removed from the old position before being inserted at the new      // 205
      // position.                                                               // 206
      // Ex.:   0  *1*  2   3   4                                                // 207
      //        0   2   3  *1*  4                                                // 208
      // The original issued callback is "1" before "4".                         // 209
      // The position of "1" is 1, the position of "4" is 4.                     // 210
      // The generated move is (1) -> (3)                                        // 211
      if (newPosition > oldPosition) {                                           // 212
        newPosition--;                                                           // 213
      }                                                                          // 214
                                                                                 // 215
      // Fix up the positions of elements between the old and the new positions  // 216
      // of the moved element.                                                   // 217
      //                                                                         // 218
      // There are two cases:                                                    // 219
      //   1. The element is moved forward. Then all the positions in between    // 220
      //   are moved back.                                                       // 221
      //   2. The element is moved back. Then the positions in between *and* the
      //   element that is currently standing on the moved element's future      // 223
      //   position are moved forward.                                           // 224
      _.each(posCur, function (elCurPosition, id) {                              // 225
        if (oldPosition < elCurPosition && elCurPosition < newPosition)          // 226
          posCur[id]--;                                                          // 227
        else if (newPosition <= elCurPosition && elCurPosition < oldPosition)    // 228
          posCur[id]++;                                                          // 229
      });                                                                        // 230
                                                                                 // 231
      // Finally, update the position of the moved element.                      // 232
      posCur[idStringify(id)] = newPosition;                                     // 233
                                                                                 // 234
      callbacks.movedTo(                                                         // 235
        id,                                                                      // 236
        seqArray[posNew[idStringify(id)]].item,                                  // 237
        oldPosition,                                                             // 238
        newPosition,                                                             // 239
        before);                                                                 // 240
    },                                                                           // 241
    removed: function (id) {                                                     // 242
      var prevPosition = posCur[idStringify(id)];                                // 243
                                                                                 // 244
      _.each(posCur, function (pos, id) {                                        // 245
        if (pos >= prevPosition)                                                 // 246
          posCur[id]--;                                                          // 247
      });                                                                        // 248
                                                                                 // 249
      delete posCur[idStringify(id)];                                            // 250
      lengthCur--;                                                               // 251
                                                                                 // 252
      callbacks.removedAt(                                                       // 253
        id,                                                                      // 254
        lastSeqArray[posOld[idStringify(id)]].item,                              // 255
        prevPosition);                                                           // 256
    }                                                                            // 257
  });                                                                            // 258
                                                                                 // 259
  _.each(posNew, function (pos, idString) {                                      // 260
    var id = idParse(idString);                                                  // 261
    if (_.has(posOld, idString)) {                                               // 262
      // specifically for primitive types, compare equality before               // 263
      // firing the 'changedAt' callback. otherwise, always fire it              // 264
      // because doing a deep EJSON comparison is not guaranteed to              // 265
      // work (an array can contain arbitrary objects, and 'transform'           // 266
      // can be used on cursors). also, deep diffing is not                      // 267
      // necessarily the most efficient (if only a specific subfield             // 268
      // of the object is later accessed).                                       // 269
      var newItem = seqArray[pos].item;                                          // 270
      var oldItem = lastSeqArray[posOld[idString]].item;                         // 271
                                                                                 // 272
      if (typeof newItem === 'object' || newItem !== oldItem)                    // 273
          callbacks.changedAt(id, newItem, oldItem, pos);                        // 274
      }                                                                          // 275
  });                                                                            // 276
};                                                                               // 277
                                                                                 // 278
seqChangedToEmpty = function (lastSeqArray, callbacks) {                         // 279
  return [];                                                                     // 280
};                                                                               // 281
                                                                                 // 282
seqChangedToArray = function (lastSeqArray, array, callbacks) {                  // 283
  var idsUsed = {};                                                              // 284
  var seqArray = _.map(array, function (item, index) {                           // 285
    var id;                                                                      // 286
    if (typeof item === 'string') {                                              // 287
      // ensure not empty, since other layers (eg DomRange) assume this as well  // 288
      id = "-" + item;                                                           // 289
    } else if (typeof item === 'number' ||                                       // 290
               typeof item === 'boolean' ||                                      // 291
               item === undefined) {                                             // 292
      id = item;                                                                 // 293
    } else if (typeof item === 'object') {                                       // 294
      id = (item && _.has(item, '_id')) ? item._id : index;                      // 295
    } else {                                                                     // 296
      throw new Error("{{#each}} doesn't support arrays with " +                 // 297
                      "elements of type " + typeof item);                        // 298
    }                                                                            // 299
                                                                                 // 300
    var idString = idStringify(id);                                              // 301
    if (idsUsed[idString]) {                                                     // 302
      if (typeof item === 'object' && '_id' in item)                             // 303
        warn("duplicate id " + id + " in", array);                               // 304
      id = Random.id();                                                          // 305
    } else {                                                                     // 306
      idsUsed[idString] = true;                                                  // 307
    }                                                                            // 308
                                                                                 // 309
    return { _id: id, item: item };                                              // 310
  });                                                                            // 311
                                                                                 // 312
  return seqArray;                                                               // 313
};                                                                               // 314
                                                                                 // 315
seqChangedToCursor = function (lastSeqArray, cursor, callbacks) {                // 316
  var initial = true; // are we observing initial data from cursor?              // 317
  var seqArray = [];                                                             // 318
                                                                                 // 319
  var observeHandle = cursor.observe({                                           // 320
    addedAt: function (document, atIndex, before) {                              // 321
      if (initial) {                                                             // 322
        // keep track of initial data so that we can diff once                   // 323
        // we exit `observe`.                                                    // 324
        if (before !== null)                                                     // 325
          throw new Error("Expected initial data from observe in order");        // 326
        seqArray.push({ _id: document._id, item: document });                    // 327
      } else {                                                                   // 328
        callbacks.addedAt(document._id, document, atIndex, before);              // 329
      }                                                                          // 330
    },                                                                           // 331
    changedAt: function (newDocument, oldDocument, atIndex) {                    // 332
      callbacks.changedAt(newDocument._id, newDocument, oldDocument,             // 333
                          atIndex);                                              // 334
    },                                                                           // 335
    removedAt: function (oldDocument, atIndex) {                                 // 336
      callbacks.removedAt(oldDocument._id, oldDocument, atIndex);                // 337
    },                                                                           // 338
    movedTo: function (document, fromIndex, toIndex, before) {                   // 339
      callbacks.movedTo(                                                         // 340
        document._id, document, fromIndex, toIndex, before);                     // 341
    }                                                                            // 342
  });                                                                            // 343
  initial = false;                                                               // 344
                                                                                 // 345
  return [seqArray, observeHandle];                                              // 346
};                                                                               // 347
                                                                                 // 348
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['observe-sequence'] = {
  ObserveSequence: ObserveSequence
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Mongo = Package.mongo.Mongo;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;

/* Package-scope variables */
var CollectionExtensions;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/lai_collection-extensions/packages/lai_collection-extensions.js                         //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
(function () {                                                                                      // 1
                                                                                                    // 2
///////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                           //     // 4
// packages/lai:collection-extensions/collection-extensions.js                               //     // 5
//                                                                                           //     // 6
///////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                             //     // 8
// The collection extensions namespace                                                       // 1   // 9
CollectionExtensions = {};                                                                   // 2   // 10
                                                                                             // 3   // 11
// Stores all the collection extensions                                                      // 4   // 12
CollectionExtensions._extensions = [];                                                       // 5   // 13
                                                                                             // 6   // 14
// This is where you would add custom functionality to                                       // 7   // 15
// Mongo.Collection/Meteor.Collection                                                        // 8   // 16
Meteor.addCollectionExtension = function (customFunction) {                                  // 9   // 17
  if (typeof customFunction !== 'function') {                                                // 10  // 18
    throw new Meteor.Error(                                                                  // 11  // 19
      'collection-extension-wrong-argument',                                                 // 12  // 20
      'You must pass a function \
       into Meteor.addCollectionExtension().');                                              // 14  // 22
  }                                                                                          // 15  // 23
  CollectionExtensions._extensions.push(customFunction);                                     // 16  // 24
  // If Meteor.users exists, apply the extension right away                                  // 17  // 25
  if (typeof Meteor.users !== 'undefined') {                                                 // 18  // 26
    customFunction.apply(Meteor.users, ['users']);                                           // 19  // 27
  }                                                                                          // 20  // 28
};                                                                                           // 21  // 29
                                                                                             // 22  // 30
// Utility function to add a prototype function to your                                      // 23  // 31
// Meteor/Mongo.Collection object                                                            // 24  // 32
Meteor.addCollectionPrototype = function (name, customFunction) {                            // 25  // 33
  if (typeof name !== 'string') {                                                            // 26  // 34
    throw new Meteor.Error(                                                                  // 27  // 35
      'collection-extension-wrong-argument',                                                 // 28  // 36
      'You must pass a string as the first argument \
       into Meteor.addCollectionPrototype().');                                              // 30  // 38
  }                                                                                          // 31  // 39
  if (typeof customFunction !== 'function') {                                                // 32  // 40
    throw new Meteor.Error(                                                                  // 33  // 41
      'collection-extension-wrong-argument',                                                 // 34  // 42
      'You must pass a function as the second argument \
       into Meteor.addCollectionPrototype().');                                              // 36  // 44
  }                                                                                          // 37  // 45
  (typeof Mongo !== 'undefined' ?                                                            // 38  // 46
    Mongo.Collection :                                                                       // 39  // 47
    Meteor.Collection).prototype[name] = customFunction;                                     // 40  // 48
};                                                                                           // 41  // 49
                                                                                             // 42  // 50
// This is used to reassign the prototype of unfortunately                                   // 43  // 51
// and unstoppably already instantiated Mongo instances                                      // 44  // 52
// i.e. Meteor.users                                                                         // 45  // 53
CollectionExtensions._reassignCollectionPrototype = function (instance, constr) {            // 46  // 54
  var hasSetPrototypeOf = typeof Object.setPrototypeOf === 'function';                       // 47  // 55
                                                                                             // 48  // 56
  if (!constr) constr = typeof Mongo !== 'undefined' ? Mongo.Collection : Meteor.Collection; // 49  // 57
                                                                                             // 50  // 58
  // __proto__ is not available in < IE11                                                    // 51  // 59
  // Note: Assigning a prototype dynamically has performance implications                    // 52  // 60
  if (hasSetPrototypeOf) {                                                                   // 53  // 61
    Object.setPrototypeOf(instance, constr.prototype);                                       // 54  // 62
  } else if (instance.__proto__) {                                                           // 55  // 63
    instance.__proto__ = constr.prototype;                                                   // 56  // 64
  }                                                                                          // 57  // 65
};                                                                                           // 58  // 66
                                                                                             // 59  // 67
// This monkey-patches the Collection constructor                                            // 60  // 68
// This code is the same monkey-patching code                                                // 61  // 69
// that matb33:collection-hooks uses, which works pretty nicely                              // 62  // 70
CollectionExtensions._wrapCollection = function (ns, as) {                                   // 63  // 71
  // Save the original prototype                                                             // 64  // 72
  if (!as._CollectionPrototype) as._CollectionPrototype = new as.Collection(null);           // 65  // 73
                                                                                             // 66  // 74
  var constructor = as.Collection;                                                           // 67  // 75
  var proto = as._CollectionPrototype;                                                       // 68  // 76
                                                                                             // 69  // 77
  ns.Collection = function () {                                                              // 70  // 78
    var ret = constructor.apply(this, arguments);                                            // 71  // 79
    // This is where all the collection extensions get processed                             // 72  // 80
    CollectionExtensions._processCollectionExtensions(this, arguments);                      // 73  // 81
    return ret;                                                                              // 74  // 82
  };                                                                                         // 75  // 83
                                                                                             // 76  // 84
  ns.Collection.prototype = proto;                                                           // 77  // 85
  ns.Collection.prototype.constructor = ns.Collection;                                       // 78  // 86
                                                                                             // 79  // 87
  for (var prop in constructor) {                                                            // 80  // 88
    if (constructor.hasOwnProperty(prop)) {                                                  // 81  // 89
      ns.Collection[prop] = constructor[prop];                                               // 82  // 90
    }                                                                                        // 83  // 91
  }                                                                                          // 84  // 92
};                                                                                           // 85  // 93
                                                                                             // 86  // 94
CollectionExtensions._processCollectionExtensions = function (self, args) {                  // 87  // 95
  // Using old-school operations for better performance                                      // 88  // 96
  // Please don't judge me ;P                                                                // 89  // 97
  var args = args ? [].slice.call(args, 0) : undefined;                                      // 90  // 98
  var extensions = CollectionExtensions._extensions;                                         // 91  // 99
  for (var i = 0, len = extensions.length; i < len; i++) {                                   // 92  // 100
    extensions[i].apply(self, args);                                                         // 93  // 101
  }                                                                                          // 94  // 102
};                                                                                           // 95  // 103
                                                                                             // 96  // 104
if (typeof Mongo !== 'undefined') {                                                          // 97  // 105
  CollectionExtensions._wrapCollection(Meteor, Mongo);                                       // 98  // 106
  CollectionExtensions._wrapCollection(Mongo, Mongo);                                        // 99  // 107
} else {                                                                                     // 100
  CollectionExtensions._wrapCollection(Meteor, Meteor);                                      // 101
}                                                                                            // 102
                                                                                             // 103
if (typeof Meteor.users !== 'undefined') {                                                   // 104
  // Ensures that Meteor.users instanceof Mongo.Collection                                   // 105
  CollectionExtensions._reassignCollectionPrototype(Meteor.users);                           // 106
}                                                                                            // 107
///////////////////////////////////////////////////////////////////////////////////////////////     // 116
                                                                                                    // 117
}).call(this);                                                                                      // 118
                                                                                                    // 119
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['lai:collection-extensions'] = {};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/dburles_mongo-collection-instances/packages/dburles_mongo-collection-instances.js                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
(function () {                                                                                                      // 1
                                                                                                                    // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                                                            //    // 4
// packages/dburles:mongo-collection-instances/mongo-instances.js                                             //    // 5
//                                                                                                            //    // 6
////////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 7
                                                                                                              //    // 8
var instances = [];                                                                                           // 1  // 9
                                                                                                              // 2  // 10
Meteor.addCollectionExtension(function (name, options) {                                                      // 3  // 11
  instances.push({                                                                                            // 4  // 12
    name: name,                                                                                               // 5  // 13
    instance: this,                                                                                           // 6  // 14
    options: options                                                                                          // 7  // 15
  });                                                                                                         // 8  // 16
});                                                                                                           // 9  // 17
                                                                                                              // 10
Mongo.Collection.get = function(name, options) {                                                              // 11
  options = options || {};                                                                                    // 12
  var collection = _.find(instances, function(instance) {                                                     // 13
    if (options.connection)                                                                                   // 14
      return instance.name === name &&                                                                        // 15
        instance.options && instance.options.connection._lastSessionId === options.connection._lastSessionId; // 16
    return instance.name === name;                                                                            // 17
  });                                                                                                         // 18
                                                                                                              // 19
  return collection && collection.instance;                                                                   // 20
};                                                                                                            // 21
                                                                                                              // 22
Mongo.Collection.getAll = function() {                                                                        // 23
  return instances;                                                                                           // 24
};                                                                                                            // 25
                                                                                                              // 26
// Meteor.Collection will lack ownProperties that are added back to Mongo.Collection                          // 27
Meteor.Collection = Mongo.Collection;                                                                         // 28
////////////////////////////////////////////////////////////////////////////////////////////////////////////////    // 37
                                                                                                                    // 38
}).call(this);                                                                                                      // 39
                                                                                                                    // 40
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['dburles:mongo-collection-instances'] = {};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var Session = Package.session.Session;
var Mongo = Package.mongo.Mongo;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/lib/diff-array.js                                                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var module = angular.module('diffArray', ['getUpdates']);                                                     // 3
                                                                                                              // 4
module.factory('diffArray', ['getUpdates',                                                                    // 5
  function(getUpdates) {                                                                                      // 6
    var idStringify = LocalCollection._idStringify || Package['mongo-id'].MongoID.idStringify;                // 7
    var idParse = LocalCollection._idParse || Package['mongo-id'].MongoID.idParse;                            // 8
                                                                                                              // 9
    // Calculates the differences between `lastSeqArray` and                                                  // 10
    // `seqArray` and calls appropriate functions from `callbacks`.                                           // 11
    // Reuses Minimongo's diff algorithm implementation.                                                      // 12
    // XXX Should be replaced with the original diffArray function here:                                      // 13
    // https://github.com/meteor/meteor/blob/devel/packages/observe-sequence/observe_sequence.js#L152         // 14
    // When it will become nested as well, tracking here: https://github.com/meteor/meteor/issues/3764        // 15
    function diffArray(lastSeqArray, seqArray, callbacks, preventNestedDiff) {                                // 16
      preventNestedDiff = !!preventNestedDiff;                                                                // 17
                                                                                                              // 18
      var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges ||                              // 19
        Package['diff-sequence'].DiffSequence.diffQueryOrderedChanges;                                        // 20
                                                                                                              // 21
      var oldObjIds = [];                                                                                     // 22
      var newObjIds = [];                                                                                     // 23
      var posOld = {}; // maps from idStringify'd ids                                                         // 24
      var posNew = {}; // ditto                                                                               // 25
      var posCur = {};                                                                                        // 26
      var lengthCur = lastSeqArray.length;                                                                    // 27
                                                                                                              // 28
      _.each(seqArray, function (doc, i) {                                                                    // 29
        newObjIds.push({_id: doc._id});                                                                       // 30
        posNew[idStringify(doc._id)] = i;                                                                     // 31
      });                                                                                                     // 32
                                                                                                              // 33
      _.each(lastSeqArray, function (doc, i) {                                                                // 34
        oldObjIds.push({_id: doc._id});                                                                       // 35
        posOld[idStringify(doc._id)] = i;                                                                     // 36
        posCur[idStringify(doc._id)] = i;                                                                     // 37
      });                                                                                                     // 38
                                                                                                              // 39
      // Arrays can contain arbitrary objects. We don't diff the                                              // 40
      // objects. Instead we always fire 'changedAt' callback on every                                        // 41
      // object. The consumer of `observe-sequence` should deal with                                          // 42
      // it appropriately.                                                                                    // 43
      diffFn(oldObjIds, newObjIds, {                                                                          // 44
        addedBefore: function (id, doc, before) {                                                             // 45
          var position = before ? posCur[idStringify(before)] : lengthCur;                                    // 46
                                                                                                              // 47
          _.each(posCur, function (pos, id) {                                                                 // 48
            if (pos >= position) posCur[id]++;                                                                // 49
          });                                                                                                 // 50
                                                                                                              // 51
          lengthCur++;                                                                                        // 52
          posCur[idStringify(id)] = position;                                                                 // 53
                                                                                                              // 54
          callbacks.addedAt(                                                                                  // 55
            id,                                                                                               // 56
            seqArray[posNew[idStringify(id)]],                                                                // 57
            position,                                                                                         // 58
            before                                                                                            // 59
          );                                                                                                  // 60
        },                                                                                                    // 61
                                                                                                              // 62
        movedBefore: function (id, before) {                                                                  // 63
          var prevPosition = posCur[idStringify(id)];                                                         // 64
          var position = before ? posCur[idStringify(before)] : lengthCur - 1;                                // 65
                                                                                                              // 66
          _.each(posCur, function (pos, id) {                                                                 // 67
            if (pos >= prevPosition && pos <= position)                                                       // 68
              posCur[id]--;                                                                                   // 69
            else if (pos <= prevPosition && pos >= position)                                                  // 70
              posCur[id]++;                                                                                   // 71
          });                                                                                                 // 72
                                                                                                              // 73
          posCur[idStringify(id)] = position;                                                                 // 74
                                                                                                              // 75
          callbacks.movedTo(                                                                                  // 76
            id,                                                                                               // 77
            seqArray[posNew[idStringify(id)]],                                                                // 78
            prevPosition,                                                                                     // 79
            position,                                                                                         // 80
            before                                                                                            // 81
          );                                                                                                  // 82
        },                                                                                                    // 83
        removed: function (id) {                                                                              // 84
          var prevPosition = posCur[idStringify(id)];                                                         // 85
                                                                                                              // 86
          _.each(posCur, function (pos, id) {                                                                 // 87
            if (pos >= prevPosition) posCur[id]--;                                                            // 88
          });                                                                                                 // 89
                                                                                                              // 90
          delete posCur[idStringify(id)];                                                                     // 91
          lengthCur--;                                                                                        // 92
                                                                                                              // 93
          callbacks.removedAt(                                                                                // 94
            id,                                                                                               // 95
            lastSeqArray[posOld[idStringify(id)]],                                                            // 96
            prevPosition                                                                                      // 97
          );                                                                                                  // 98
        }                                                                                                     // 99
      });                                                                                                     // 100
                                                                                                              // 101
      _.each(posNew, function (pos, idString) {                                                               // 102
        if (!_.has(posOld, idString)) return;                                                                 // 103
                                                                                                              // 104
        var id = idParse(idString);                                                                           // 105
        var newItem = seqArray[pos] || {};                                                                    // 106
        var oldItem = lastSeqArray[posOld[idString]];                                                         // 107
        var updates = getUpdates(oldItem, newItem, preventNestedDiff);                                        // 108
        var setDiff = updates.$set;                                                                           // 109
        var unsetDiff = updates.$unset;                                                                       // 110
                                                                                                              // 111
        if (setDiff)                                                                                          // 112
          setDiff._id = newItem._id;                                                                          // 113
                                                                                                              // 114
        if (unsetDiff)                                                                                        // 115
          unsetDiff._id = newItem._id;                                                                        // 116
                                                                                                              // 117
        if (setDiff || unsetDiff)                                                                             // 118
          callbacks.changedAt(id, setDiff, unsetDiff, pos, oldItem);                                          // 119
      });                                                                                                     // 120
    }                                                                                                         // 121
                                                                                                              // 122
    diffArray.deepCopyChanges = function (oldItem, newItem) {                                                 // 123
      var setDiff = getUpdates(oldItem, newItem).$set;                                                        // 124
                                                                                                              // 125
      _.each(setDiff, function(v, deepKey) {                                                                  // 126
        setDeep(oldItem, deepKey, v);                                                                         // 127
      });                                                                                                     // 128
    };                                                                                                        // 129
                                                                                                              // 130
    diffArray.deepCopyRemovals = function (oldItem, newItem) {                                                // 131
      var unsetDiff = getUpdates(oldItem, newItem).$unset;                                                    // 132
                                                                                                              // 133
      _.each(unsetDiff, function(v, deepKey) {                                                                // 134
        unsetDeep(oldItem, deepKey);                                                                          // 135
      });                                                                                                     // 136
    };                                                                                                        // 137
                                                                                                              // 138
    var setDeep = function(obj, deepKey, v) {                                                                 // 139
      var split = deepKey.split('.');                                                                         // 140
      var initialKeys = _.initial(split);                                                                     // 141
      var lastKey = _.last(split);                                                                            // 142
                                                                                                              // 143
      initialKeys.reduce(function(subObj, k, i) {                                                             // 144
        var nextKey = split[i + 1];                                                                           // 145
                                                                                                              // 146
        if (isNumStr(nextKey)) {                                                                              // 147
          if (subObj[k] == null) subObj[k] = [];                                                              // 148
          if (subObj[k].length == parseInt(nextKey)) subObj[k].push(null);                                    // 149
        }                                                                                                     // 150
                                                                                                              // 151
        else if (subObj[k] == null || !isHash(subObj[k])) {                                                   // 152
          subObj[k] = {};                                                                                     // 153
        }                                                                                                     // 154
                                                                                                              // 155
        return subObj[k];                                                                                     // 156
      }, obj);                                                                                                // 157
                                                                                                              // 158
      getDeep(obj, initialKeys)[lastKey] = v;                                                                 // 159
      return v;                                                                                               // 160
    };                                                                                                        // 161
                                                                                                              // 162
    var unsetDeep = function(obj, deepKey) {                                                                  // 163
      var split = deepKey.split('.');                                                                         // 164
      var initialKeys = _.initial(split);                                                                     // 165
      var lastKey = _.last(split);                                                                            // 166
      return delete getDeep(obj, initialKeys)[lastKey];                                                       // 167
    };                                                                                                        // 168
                                                                                                              // 169
    var getDeep = function(obj, keys) {                                                                       // 170
      return keys.reduce(function(subObj, k) {                                                                // 171
        return subObj[k];                                                                                     // 172
      }, obj);                                                                                                // 173
    };                                                                                                        // 174
                                                                                                              // 175
    var isHash = function(obj) {                                                                              // 176
      return _.isObject(obj) &&                                                                               // 177
             Object.getPrototypeOf(obj) === Object.prototype;                                                 // 178
    };                                                                                                        // 179
                                                                                                              // 180
    var isNumStr = function(str) {                                                                            // 181
      return str.match(/^\d+$/);                                                                              // 182
    };                                                                                                        // 183
                                                                                                              // 184
    return diffArray;                                                                                         // 185
}]);                                                                                                          // 186
                                                                                                              // 187
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/lib/get-updates.js                                                                        //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
// https://github.com/DAB0mB/get-updates                                                                      // 3
(function() {                                                                                                 // 4
  var module = angular.module('getUpdates', []);                                                              // 5
                                                                                                              // 6
  var utils = (function() {                                                                                   // 7
    var rip = function(obj, level) {                                                                          // 8
      if (level < 1) return {};                                                                               // 9
                                                                                                              // 10
      return _.reduce(obj, function(clone, v, k) {                                                            // 11
        v = _.isObject(v) ? rip(v, --level) : v;                                                              // 12
        clone[k] = v;                                                                                         // 13
        return clone;                                                                                         // 14
      }, {});                                                                                                 // 15
    };                                                                                                        // 16
                                                                                                              // 17
    var toPaths = function(obj) {                                                                             // 18
      var keys = getKeyPaths(obj);                                                                            // 19
      var values = getDeepValues(obj);                                                                        // 20
      return _.object(keys, values);                                                                          // 21
    };                                                                                                        // 22
                                                                                                              // 23
    var getKeyPaths = function(obj) {                                                                         // 24
      var keys = _.keys(obj).map(function(k) {                                                                // 25
        var v = obj[k];                                                                                       // 26
        if (!_.isObject(v) || _.isEmpty(v) || _.isArray(v)) return k;                                         // 27
                                                                                                              // 28
        return getKeyPaths(v).map(function(subKey) {                                                          // 29
          return k + '.' + subKey;                                                                            // 30
        });                                                                                                   // 31
      });                                                                                                     // 32
                                                                                                              // 33
      return _.flatten(keys);                                                                                 // 34
    };                                                                                                        // 35
                                                                                                              // 36
    var getDeepValues = function(obj,arr) {                                                                   // 37
      arr = arr || [];                                                                                        // 38
                                                                                                              // 39
      _.values(obj).forEach(function(v) {                                                                     // 40
        if (!_.isObject(v) || _.isEmpty(v) || _.isArray(v))                                                   // 41
          arr.push(v);                                                                                        // 42
        else                                                                                                  // 43
          getDeepValues(v, arr);                                                                              // 44
      });                                                                                                     // 45
                                                                                                              // 46
      return arr;                                                                                             // 47
    };                                                                                                        // 48
                                                                                                              // 49
    var flatten = function(arr) {                                                                             // 50
      return arr.reduce(function(flattened, v, i) {                                                           // 51
        if (_.isArray(v) && !_.isEmpty(v))                                                                    // 52
          flattened.push.apply(flattened, flatten(v));                                                        // 53
        else                                                                                                  // 54
          flattened.push(v);                                                                                  // 55
                                                                                                              // 56
        return flattened;                                                                                     // 57
      }, []);                                                                                                 // 58
    };                                                                                                        // 59
                                                                                                              // 60
    var setFilled = function(obj, k, v) {                                                                     // 61
      if (!_.isEmpty(v)) obj[k] = v;                                                                          // 62
    };                                                                                                        // 63
                                                                                                              // 64
    var assert = function(result, msg) {                                                                      // 65
      if (!result) throwErr(msg);                                                                             // 66
    };                                                                                                        // 67
                                                                                                              // 68
    var throwErr = function(msg) {                                                                            // 69
      throw Error('get-updates error - ' + msg);                                                              // 70
    };                                                                                                        // 71
                                                                                                              // 72
    return {                                                                                                  // 73
      rip: rip,                                                                                               // 74
      toPaths: toPaths,                                                                                       // 75
      getKeyPaths: getKeyPaths,                                                                               // 76
      getDeepValues: getDeepValues,                                                                           // 77
      setFilled: setFilled,                                                                                   // 78
      assert: assert,                                                                                         // 79
      throwErr: throwErr                                                                                      // 80
    };                                                                                                        // 81
  })();                                                                                                       // 82
                                                                                                              // 83
  var getDifference = (function() {                                                                           // 84
    var getDifference = function(src, dst, isShallow) {                                                       // 85
      var level;                                                                                              // 86
                                                                                                              // 87
      if (isShallow > 1)                                                                                      // 88
        level = isShallow;                                                                                    // 89
      else if (isShallow)                                                                                     // 90
        level = 1;                                                                                            // 91
                                                                                                              // 92
      if (level) {                                                                                            // 93
        src = utils.rip(src, level);                                                                          // 94
        dst = utils.rip(dst, level);                                                                          // 95
      }                                                                                                       // 96
                                                                                                              // 97
      return compare(src, dst);                                                                               // 98
    };                                                                                                        // 99
                                                                                                              // 100
    var compare = function(src, dst) {                                                                        // 101
      var srcKeys = _.keys(src);                                                                              // 102
      var dstKeys = _.keys(dst);                                                                              // 103
                                                                                                              // 104
      var keys = _.chain([])                                                                                  // 105
        .concat(srcKeys)                                                                                      // 106
        .concat(dstKeys)                                                                                      // 107
        .uniq()                                                                                               // 108
        .without('$$hashKey')                                                                                 // 109
        .value();                                                                                             // 110
                                                                                                              // 111
      return keys.reduce(function(diff, k) {                                                                  // 112
        var srcValue = src[k];                                                                                // 113
        var dstValue = dst[k];                                                                                // 114
                                                                                                              // 115
        if (_.isDate(srcValue) && _.isDate(dstValue)) {                                                       // 116
          if (srcValue.getTime() != dstValue.getTime()) diff[k] = dstValue;                                   // 117
        }                                                                                                     // 118
                                                                                                              // 119
        if (_.isObject(srcValue) && _.isObject(dstValue)) {                                                   // 120
          var valueDiff = getDifference(srcValue, dstValue);                                                  // 121
          utils.setFilled(diff, k, valueDiff);                                                                // 122
        }                                                                                                     // 123
                                                                                                              // 124
        else if (srcValue !== dstValue) {                                                                     // 125
          diff[k] = dstValue;                                                                                 // 126
        }                                                                                                     // 127
                                                                                                              // 128
        return diff;                                                                                          // 129
      }, {});                                                                                                 // 130
    };                                                                                                        // 131
                                                                                                              // 132
    return getDifference;                                                                                     // 133
  })();                                                                                                       // 134
                                                                                                              // 135
  var getUpdates = (function() {                                                                              // 136
    var getUpdates = function(src, dst, isShallow) {                                                          // 137
      utils.assert(_.isObject(src), 'first argument must be an object');                                      // 138
      utils.assert(_.isObject(dst), 'second argument must be an object');                                     // 139
                                                                                                              // 140
      var diff = getDifference(src, dst, isShallow);                                                          // 141
      var paths = utils.toPaths(diff);                                                                        // 142
                                                                                                              // 143
      var set = createSet(paths);                                                                             // 144
      var unset = createUnset(paths);                                                                         // 145
      var pull = createPull(unset);                                                                           // 146
                                                                                                              // 147
      var updates = {};                                                                                       // 148
      utils.setFilled(updates, '$set', set);                                                                  // 149
      utils.setFilled(updates, '$unset', unset);                                                              // 150
      utils.setFilled(updates, '$pull', pull);                                                                // 151
                                                                                                              // 152
      return updates;                                                                                         // 153
    };                                                                                                        // 154
                                                                                                              // 155
    var createSet = function(paths) {                                                                         // 156
      var undefinedKeys = getUndefinedKeys(paths);                                                            // 157
      return _.omit(paths, undefinedKeys);                                                                    // 158
    };                                                                                                        // 159
                                                                                                              // 160
    var createUnset = function(paths) {                                                                       // 161
      var undefinedKeys = getUndefinedKeys(paths);                                                            // 162
      var unset = _.pick(paths, undefinedKeys);                                                               // 163
                                                                                                              // 164
      return _.reduce(unset, function(result, v, k) {                                                         // 165
        result[k] = true;                                                                                     // 166
        return result;                                                                                        // 167
      }, {});                                                                                                 // 168
    };                                                                                                        // 169
                                                                                                              // 170
    var createPull = function(unset) {                                                                        // 171
      var arrKeyPaths = _.keys(unset).map(function(k) {                                                       // 172
        var split = k.match(/(.*)\.\d+$/);                                                                    // 173
        return split && split[1];                                                                             // 174
      });                                                                                                     // 175
                                                                                                              // 176
      return _.compact(arrKeyPaths).reduce(function(pull, k) {                                                // 177
        pull[k] = null;                                                                                       // 178
        return pull;                                                                                          // 179
      }, {});                                                                                                 // 180
    };                                                                                                        // 181
                                                                                                              // 182
    var getUndefinedKeys = function(obj) {                                                                    // 183
      return _.keys(obj).filter(function (k) {                                                                // 184
        var v = obj[k];                                                                                       // 185
        return _.isUndefined(v);                                                                              // 186
      });                                                                                                     // 187
    };                                                                                                        // 188
                                                                                                              // 189
    return getUpdates;                                                                                        // 190
  })();                                                                                                       // 191
                                                                                                              // 192
  module.value('getUpdates', getUpdates);                                                                     // 193
})();                                                                                                         // 194
                                                                                                              // 195
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-subscribe.js                                                       //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
var angularMeteorSubscribe = angular.module('angular-meteor.subscribe', []);                                  // 2
                                                                                                              // 3
angularMeteorSubscribe.service('$meteorSubscribe', ['$q',                                                     // 4
  function ($q) {                                                                                             // 5
    var self = this;                                                                                          // 6
                                                                                                              // 7
    this._subscribe = function(scope, deferred, args) {                                                       // 8
      var subscription = null;                                                                                // 9
      var lastArg = args[args.length - 1];                                                                    // 10
                                                                                                              // 11
      // User supplied onStop callback                                                                        // 12
      // save it for later use and remove                                                                     // 13
      // from subscription arguments                                                                          // 14
      if (angular.isObject(lastArg) &&                                                                        // 15
          angular.isFunction(lastArg.onStop)) {                                                               // 16
        var onStop = lastArg.onStop;                                                                          // 17
                                                                                                              // 18
        args.pop();                                                                                           // 19
      }                                                                                                       // 20
                                                                                                              // 21
      args.push({                                                                                             // 22
        onReady: function() {                                                                                 // 23
          deferred.resolve(subscription);                                                                     // 24
        },                                                                                                    // 25
        onStop: function(err) {                                                                               // 26
          if (!deferred.promise.$$state.status) {                                                             // 27
            if (err)                                                                                          // 28
              deferred.reject(err);                                                                           // 29
            else                                                                                              // 30
              deferred.reject(new Meteor.Error("Subscription Stopped",                                        // 31
                "Subscription stopped by a call to stop method. Either by the client or by the server."));    // 32
          } else if (onStop)                                                                                  // 33
            // After promise was resolved or rejected                                                         // 34
            // call user supplied onStop callback.                                                            // 35
            onStop.apply(this, Array.prototype.slice.call(arguments));                                        // 36
                                                                                                              // 37
        }                                                                                                     // 38
      });                                                                                                     // 39
                                                                                                              // 40
      subscription =  Meteor.subscribe.apply(scope, args);                                                    // 41
                                                                                                              // 42
      return subscription;                                                                                    // 43
    };                                                                                                        // 44
                                                                                                              // 45
    this.subscribe = function(){                                                                              // 46
      var deferred = $q.defer();                                                                              // 47
      var args = Array.prototype.slice.call(arguments);                                                       // 48
      var subscription = null;                                                                                // 49
                                                                                                              // 50
      self._subscribe(this, deferred, args);                                                                  // 51
                                                                                                              // 52
      return deferred.promise;                                                                                // 53
    };                                                                                                        // 54
  }]);                                                                                                        // 55
                                                                                                              // 56
angularMeteorSubscribe.run(['$rootScope', '$q', '$meteorSubscribe',                                           // 57
  function($rootScope, $q, $meteorSubscribe) {                                                                // 58
    Object.getPrototypeOf($rootScope).$meteorSubscribe = function() {                                         // 59
      var deferred = $q.defer();                                                                              // 60
      var args = Array.prototype.slice.call(arguments);                                                       // 61
                                                                                                              // 62
      var subscription = $meteorSubscribe._subscribe(this, deferred, args);                                   // 63
                                                                                                              // 64
      this.$on('$destroy', function() {                                                                       // 65
        subscription.stop();                                                                                  // 66
      });                                                                                                     // 67
                                                                                                              // 68
      return deferred.promise;                                                                                // 69
    };                                                                                                        // 70
}]);                                                                                                          // 71
                                                                                                              // 72
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-stopper.js                                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var angularMeteorStopper = angular.module('angular-meteor.stopper',                                           // 3
  ['angular-meteor.subscribe']);                                                                              // 4
                                                                                                              // 5
angularMeteorStopper.factory('$meteorStopper', ['$q', '$meteorSubscribe',                                     // 6
  function($q, $meteorSubscribe) {                                                                            // 7
    function $meteorStopper($meteorEntity) {                                                                  // 8
      return function() {                                                                                     // 9
        var args = Array.prototype.slice.call(arguments);                                                     // 10
        var meteorEntity = $meteorEntity.apply(this, args);                                                   // 11
                                                                                                              // 12
        angular.extend(meteorEntity, $meteorStopper);                                                         // 13
        meteorEntity.$$scope = this;                                                                          // 14
                                                                                                              // 15
        this.$on('$destroy', function () {                                                                    // 16
          meteorEntity.stop();                                                                                // 17
          if (meteorEntity.subscription) meteorEntity.subscription.stop();                                    // 18
        });                                                                                                   // 19
                                                                                                              // 20
        return meteorEntity;                                                                                  // 21
      };                                                                                                      // 22
    }                                                                                                         // 23
                                                                                                              // 24
    $meteorStopper.subscribe = function() {                                                                   // 25
      var args = Array.prototype.slice.call(arguments);                                                       // 26
      this.subscription = $meteorSubscribe._subscribe(this.$$scope, $q.defer(), args);                        // 27
      return this;                                                                                            // 28
    };                                                                                                        // 29
                                                                                                              // 30
    return $meteorStopper;                                                                                    // 31
}]);                                                                                                          // 32
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-collection.js                                                      //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var angularMeteorCollection = angular.module('angular-meteor.collection',                                     // 3
  ['angular-meteor.stopper', 'angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray']);               // 4
                                                                                                              // 5
// The reason angular meteor collection is a factory function and not something                               // 6
// that inherit from array comes from here:                                                                   // 7
// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/                     // 8
// We went with the direct extensions approach.                                                               // 9
angularMeteorCollection.factory('AngularMeteorCollection', [                                                  // 10
  '$q', '$meteorSubscribe', '$meteorUtils', '$rootScope', '$timeout', 'diffArray',                            // 11
  function($q, $meteorSubscribe, $meteorUtils, $rootScope, $timeout, diffArray) {                             // 12
    function AngularMeteorCollection(curDefFunc, collection, diffArrayFunc, autoClientSave) {                 // 13
      var data = [];                                                                                          // 14
      // Server backup data to evaluate what changes come from client                                         // 15
      // after each server update.                                                                            // 16
      data._serverBackup = [];                                                                                // 17
      // Array differ function.                                                                               // 18
      data._diffArrayFunc = diffArrayFunc;                                                                    // 19
      // Handler of the cursor observer.                                                                      // 20
      data._hObserve = null;                                                                                  // 21
      // On new cursor autorun handler                                                                        // 22
      // (autorun for reactive variables).                                                                    // 23
      data._hNewCurAutorun = null;                                                                            // 24
      // On new data autorun handler                                                                          // 25
      // (autorun for cursor.fetch).                                                                          // 26
      data._hDataAutorun = null;                                                                              // 27
                                                                                                              // 28
      if (angular.isDefined(collection)) {                                                                    // 29
        data.$$collection = collection;                                                                       // 30
      } else {                                                                                                // 31
        var cursor = curDefFunc();                                                                            // 32
        data.$$collection = $meteorUtils.getCollectionByName(cursor.collection.name);                         // 33
      }                                                                                                       // 34
                                                                                                              // 35
      angular.extend(data, AngularMeteorCollection);                                                          // 36
      data._startCurAutorun(curDefFunc, autoClientSave);                                                      // 37
                                                                                                              // 38
      return data;                                                                                            // 39
    }                                                                                                         // 40
                                                                                                              // 41
    AngularMeteorCollection._startCurAutorun = function(curDefFunc, autoClientSave) {                         // 42
      var self = this;                                                                                        // 43
      self._hNewCurAutorun = Tracker.autorun(function() {                                                     // 44
        // When the reactive func gets recomputated we need to stop any previous                              // 45
        // observeChanges.                                                                                    // 46
        Tracker.onInvalidate(function() {                                                                     // 47
          self._stopCursor();                                                                                 // 48
        });                                                                                                   // 49
        if (autoClientSave) {                                                                                 // 50
          self._setAutoClientSave();                                                                          // 51
        }                                                                                                     // 52
        self._updateCursor(curDefFunc(), autoClientSave);                                                     // 53
      });                                                                                                     // 54
    };                                                                                                        // 55
                                                                                                              // 56
    AngularMeteorCollection.subscribe = function() {                                                          // 57
      $meteorSubscribe.subscribe.apply(this, arguments);                                                      // 58
      return this;                                                                                            // 59
    };                                                                                                        // 60
                                                                                                              // 61
    AngularMeteorCollection.save = function(docs, useUnsetModifier) {                                         // 62
      // save whole collection                                                                                // 63
      if (!docs) docs = this;                                                                                 // 64
      // save single doc                                                                                      // 65
      docs = [].concat(docs);                                                                                 // 66
                                                                                                              // 67
      var promises = docs.map(function(doc) {                                                                 // 68
        return this._upsertDoc(doc, useUnsetModifier);                                                        // 69
      }, this);                                                                                               // 70
                                                                                                              // 71
      var allPromise = $q.all(promises);                                                                      // 72
                                                                                                              // 73
      allPromise.finally(function() {                                                                         // 74
        // calls digestion loop with no conflicts                                                             // 75
        $timeout(angular.noop);                                                                               // 76
      });                                                                                                     // 77
                                                                                                              // 78
      return allPromise;                                                                                      // 79
    };                                                                                                        // 80
                                                                                                              // 81
    AngularMeteorCollection._upsertDoc = function(doc, useUnsetModifier) {                                    // 82
      var deferred = $q.defer();                                                                              // 83
      var collection = this.$$collection;                                                                     // 84
      var upsertResult = function(action, _id) {                                                              // 85
        return {_id: _id, action: action }                                                                    // 86
      }                                                                                                       // 87
      var fulfill, createFulfill;                                                                             // 88
                                                                                                              // 89
      // delete $$hashkey                                                                                     // 90
      doc = $meteorUtils.stripDollarPrefixedKeys(doc);                                                        // 91
      var docId = doc._id;                                                                                    // 92
      var isExist = collection.findOne(docId);                                                                // 93
                                                                                                              // 94
      // update                                                                                               // 95
      if (isExist) {                                                                                          // 96
        // Deletes _id property (from the copy) so that                                                       // 97
        // it can be $set using update.                                                                       // 98
        delete doc._id;                                                                                       // 99
        var modifier = useUnsetModifier ? {$unset: doc} : {$set: doc};                                        // 100
        createFulfill = _.partial(upsertResult, 'updated');                                                   // 101
        fulfill = $meteorUtils.fulfill(deferred, null, createFulfill);                                        // 102
        // NOTE: do not use #upsert() method, since it does not exist in some collections                     // 103
        collection.update(docId, modifier, fulfill);                                                          // 104
      // insert                                                                                               // 105
      } else {                                                                                                // 106
        createFulfill = _.partial(upsertResult, 'inserted');                                                  // 107
        fulfill = $meteorUtils.fulfill(deferred, null, createFulfill);                                        // 108
        collection.insert(doc, fulfill);                                                                      // 109
      }                                                                                                       // 110
                                                                                                              // 111
      return deferred.promise;                                                                                // 112
    };                                                                                                        // 113
                                                                                                              // 114
    AngularMeteorCollection.remove = function(keyOrDocs) {                                                    // 115
      var keys;                                                                                               // 116
      // remove whole collection                                                                              // 117
      if (!keyOrDocs) {                                                                                       // 118
        keys = _.pluck(this, '_id');                                                                          // 119
      } else {                                                                                                // 120
        // remove docs                                                                                        // 121
        keys = _.map([].concat(keyOrDocs), function(keyOrDoc) {                                               // 122
          return keyOrDoc._id || keyOrDoc;                                                                    // 123
        });                                                                                                   // 124
      }                                                                                                       // 125
      // Checks if all keys are correct.                                                                      // 126
      check(keys, [Match.OneOf(String, Mongo.ObjectID)]);                                                     // 127
                                                                                                              // 128
      var promises = keys.map(function(key) {                                                                 // 129
        return this._removeDoc(key);                                                                          // 130
      }, this);                                                                                               // 131
                                                                                                              // 132
      var allPromise = $q.all(promises);                                                                      // 133
                                                                                                              // 134
      allPromise.finally(function() {                                                                         // 135
        $timeout(angular.noop);                                                                               // 136
      });                                                                                                     // 137
                                                                                                              // 138
      return allPromise;                                                                                      // 139
    };                                                                                                        // 140
                                                                                                              // 141
    AngularMeteorCollection._removeDoc = function(id) {                                                       // 142
      var deferred = $q.defer();                                                                              // 143
      var collection = this.$$collection;                                                                     // 144
      var fulfill = $meteorUtils.fulfill(deferred, null, { _id: id, action: 'removed' });                     // 145
      collection.remove(id, fulfill);                                                                         // 146
      return deferred.promise;                                                                                // 147
    };                                                                                                        // 148
                                                                                                              // 149
    AngularMeteorCollection._updateCursor = function(cursor, autoClientSave) {                                // 150
      var self = this;                                                                                        // 151
                                                                                                              // 152
      // XXX - consider adding an option for a non-orderd result                                              // 153
      // for faster performance.                                                                              // 154
      if (self._hObserve) {                                                                                   // 155
        self._hObserve.stop();                                                                                // 156
        self._hDataAutorun.stop();                                                                            // 157
      }                                                                                                       // 158
                                                                                                              // 159
      var serverMode = false;                                                                                 // 160
      function setServerUpdateMode(name) {                                                                    // 161
        serverMode = true;                                                                                    // 162
        // To simplify server update logic, we don't follow                                                   // 163
        // updates from the client at the same time.                                                          // 164
        self._unsetAutoClientSave();                                                                          // 165
      }                                                                                                       // 166
                                                                                                              // 167
      var hUnsetTimeout = null;                                                                               // 168
      // Here we use $timeout to combine multiple updates that go                                             // 169
      // each one after another.                                                                              // 170
      function unsetServerUpdateMode() {                                                                      // 171
        if (hUnsetTimeout) {                                                                                  // 172
          $timeout.cancel(hUnsetTimeout);                                                                     // 173
          hUnsetTimeout = null;                                                                               // 174
        }                                                                                                     // 175
        hUnsetTimeout = $timeout(function() {                                                                 // 176
          serverMode = false;                                                                                 // 177
          // Finds updates that was potentially done from the client side                                     // 178
          // and saves them.                                                                                  // 179
          var changes = collectionUtils.diff(self, self._serverBackup,                                        // 180
            self._diffArrayFunc);                                                                             // 181
          self._saveChanges(changes);                                                                         // 182
          // After, continues following client updates.                                                       // 183
          if (autoClientSave) {                                                                               // 184
            self._setAutoClientSave();                                                                        // 185
          }                                                                                                   // 186
        }, 0);                                                                                                // 187
      }                                                                                                       // 188
                                                                                                              // 189
      this._hObserve = cursor.observe({                                                                       // 190
        addedAt: function(doc, atIndex) {                                                                     // 191
          self.splice(atIndex, 0, doc);                                                                       // 192
          self._serverBackup.splice(atIndex, 0, doc);                                                         // 193
          setServerUpdateMode();                                                                              // 194
        },                                                                                                    // 195
                                                                                                              // 196
        changedAt: function(doc, oldDoc, atIndex) {                                                           // 197
          diffArray.deepCopyChanges(self[atIndex], doc);                                                      // 198
          diffArray.deepCopyRemovals(self[atIndex], doc);                                                     // 199
          self._serverBackup[atIndex] = self[atIndex];                                                        // 200
          setServerUpdateMode();                                                                              // 201
        },                                                                                                    // 202
                                                                                                              // 203
        movedTo: function(doc, fromIndex, toIndex) {                                                          // 204
          self.splice(fromIndex, 1);                                                                          // 205
          self.splice(toIndex, 0, doc);                                                                       // 206
          self._serverBackup.splice(fromIndex, 1);                                                            // 207
          self._serverBackup.splice(toIndex, 0, doc);                                                         // 208
          setServerUpdateMode();                                                                              // 209
        },                                                                                                    // 210
                                                                                                              // 211
        removedAt: function(oldDoc) {                                                                         // 212
          var removedIndex = collectionUtils.findIndexById(self, oldDoc);                                     // 213
                                                                                                              // 214
          if (removedIndex != -1) {                                                                           // 215
            self.splice(removedIndex, 1);                                                                     // 216
            self._serverBackup.splice(removedIndex, 1);                                                       // 217
            setServerUpdateMode();                                                                            // 218
          } else {                                                                                            // 219
            // If it's been removed on client then it's already not in collection                             // 220
            // itself but still is in the _serverBackup.                                                      // 221
            removedIndex = collectionUtils.findIndexById(self._serverBackup, oldDoc);                         // 222
                                                                                                              // 223
            if (removedIndex != -1) {                                                                         // 224
              self._serverBackup.splice(removedIndex, 1);                                                     // 225
            }                                                                                                 // 226
          }                                                                                                   // 227
        }                                                                                                     // 228
      });                                                                                                     // 229
                                                                                                              // 230
      this._hDataAutorun = Tracker.autorun(function() {                                                       // 231
        cursor.fetch();                                                                                       // 232
        if (serverMode) {                                                                                     // 233
          unsetServerUpdateMode();                                                                            // 234
        }                                                                                                     // 235
      });                                                                                                     // 236
    };                                                                                                        // 237
                                                                                                              // 238
    AngularMeteorCollection.stop = function() {                                                               // 239
      this._stopCursor();                                                                                     // 240
      this._hNewCurAutorun.stop();                                                                            // 241
    };                                                                                                        // 242
                                                                                                              // 243
    AngularMeteorCollection._stopCursor = function() {                                                        // 244
      this._unsetAutoClientSave();                                                                            // 245
                                                                                                              // 246
      if (this._hObserve) {                                                                                   // 247
        this._hObserve.stop();                                                                                // 248
        this._hDataAutorun.stop();                                                                            // 249
      }                                                                                                       // 250
                                                                                                              // 251
      this.splice(0);                                                                                         // 252
      this._serverBackup.splice(0);                                                                           // 253
    };                                                                                                        // 254
                                                                                                              // 255
    AngularMeteorCollection._unsetAutoClientSave = function(name) {                                           // 256
      if (this._hRegAutoBind) {                                                                               // 257
        this._hRegAutoBind();                                                                                 // 258
        this._hRegAutoBind = null;                                                                            // 259
      }                                                                                                       // 260
    };                                                                                                        // 261
                                                                                                              // 262
    AngularMeteorCollection._setAutoClientSave = function() {                                                 // 263
      var self = this;                                                                                        // 264
                                                                                                              // 265
      // Always unsets auto save to keep only one $watch handler.                                             // 266
      self._unsetAutoClientSave();                                                                            // 267
                                                                                                              // 268
      self._hRegAutoBind = $rootScope.$watch(function() {                                                     // 269
        return self;                                                                                          // 270
      }, function(nItems, oItems) {                                                                           // 271
        if (nItems === oItems) return;                                                                        // 272
                                                                                                              // 273
        self._unsetAutoClientSave();                                                                          // 274
        var changes = collectionUtils.diff(self, oItems,                                                      // 275
          self._diffArrayFunc);                                                                               // 276
        self._saveChanges(changes);                                                                           // 277
        self._setAutoClientSave();                                                                            // 278
      }, true);                                                                                               // 279
    };                                                                                                        // 280
                                                                                                              // 281
    AngularMeteorCollection._saveChanges = function(changes) {                                                // 282
      // First applies changes to the collection itself.                                                      // 283
      var newDocs = [];                                                                                       // 284
      for (var itemInd = changes.added.length - 1; itemInd >= 0; itemInd--) {                                 // 285
        this.splice(changes.added[itemInd].index, 1);                                                         // 286
        newDocs.push(changes.added[itemInd].item);                                                            // 287
      }                                                                                                       // 288
      // Then saves all new docs in bulk.                                                                     // 289
      if (newDocs.length) {                                                                                   // 290
        this.save(newDocs);                                                                                   // 291
      }                                                                                                       // 292
                                                                                                              // 293
      // Collects docs to remove.                                                                             // 294
      var removeDocs = [];                                                                                    // 295
      for (var itemInd = 0; itemInd < changes.removed.length; itemInd++) {                                    // 296
        removeDocs.push(changes.removed[itemInd].item);                                                       // 297
      }                                                                                                       // 298
      // Removes docs in bulk.                                                                                // 299
      if (removeDocs.length) {                                                                                // 300
        this.remove(removeDocs);                                                                              // 301
      }                                                                                                       // 302
                                                                                                              // 303
      // Collects set and unset changes.                                                                      // 304
      var setDocs = [], unsetDocs = [];                                                                       // 305
      for (var itemInd = 0; itemInd < changes.changed.length; itemInd++) {                                    // 306
        var change = changes.changed[itemInd];                                                                // 307
        if (change.setDiff) {                                                                                 // 308
          setDocs.push(change.setDiff);                                                                       // 309
        }                                                                                                     // 310
        if (change.unsetDiff) {                                                                               // 311
          unsetDocs.push(change.unsetDiff);                                                                   // 312
        }                                                                                                     // 313
      }                                                                                                       // 314
      // Then saves all changes in bulk.                                                                      // 315
      if (setDocs.length) {                                                                                   // 316
        this.save(setDocs);                                                                                   // 317
      }                                                                                                       // 318
      if (unsetDocs.length) {                                                                                 // 319
        this.save(unsetDocs, true);                                                                           // 320
      }                                                                                                       // 321
    };                                                                                                        // 322
                                                                                                              // 323
    return AngularMeteorCollection;                                                                           // 324
}]);                                                                                                          // 325
                                                                                                              // 326
angularMeteorCollection.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray',                     // 327
  function($meteorCollection, diffArray) {                                                                    // 328
    function $meteorCollectionFS(reactiveFunc, autoClientSave, collection) {                                  // 329
      return new $meteorCollection(reactiveFunc, autoClientSave, collection, noNestedDiffArray);              // 330
    }                                                                                                         // 331
                                                                                                              // 332
    var noNestedDiffArray = function(lastSeqArray, seqArray, callbacks) {                                     // 333
      return diffArray(lastSeqArray, seqArray, callbacks, true);                                              // 334
    };                                                                                                        // 335
                                                                                                              // 336
    return $meteorCollectionFS;                                                                               // 337
}]);                                                                                                          // 338
                                                                                                              // 339
angularMeteorCollection.factory('$meteorCollection', [                                                        // 340
  'AngularMeteorCollection', '$rootScope', 'diffArray',                                                       // 341
  function(AngularMeteorCollection, $rootScope, diffArray) {                                                  // 342
    function $meteorCollection(reactiveFunc, autoClientSave, collection, diffArrayFunc) {                     // 343
      // Validate parameters                                                                                  // 344
      if (!reactiveFunc) {                                                                                    // 345
        throw new TypeError('The first argument of $meteorCollection is undefined.');                         // 346
      }                                                                                                       // 347
                                                                                                              // 348
      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {                     // 349
        throw new TypeError(                                                                                  // 350
          'The first argument of $meteorCollection must be a function or\
            a have a find function property.');                                                               // 352
      }                                                                                                       // 353
                                                                                                              // 354
      if (!angular.isFunction(reactiveFunc)) {                                                                // 355
        collection = angular.isDefined(collection) ? collection : reactiveFunc;                               // 356
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);                                               // 357
      }                                                                                                       // 358
                                                                                                              // 359
      // By default auto save - true.                                                                         // 360
      autoClientSave = angular.isDefined(autoClientSave) ? autoClientSave : true;                             // 361
      var ngCollection = new AngularMeteorCollection(reactiveFunc, collection,                                // 362
        diffArrayFunc || diffArray, autoClientSave);                                                          // 363
                                                                                                              // 364
      return ngCollection;                                                                                    // 365
    }                                                                                                         // 366
                                                                                                              // 367
    return $meteorCollection;                                                                                 // 368
 }]);                                                                                                         // 369
                                                                                                              // 370
angularMeteorCollection.run([                                                                                 // 371
  '$rootScope', '$meteorCollection', '$meteorCollectionFS', '$meteorStopper',                                 // 372
  function($rootScope, $meteorCollection, $meteorCollectionFS, $meteorStopper) {                              // 373
    var scopeProto = Object.getPrototypeOf($rootScope);                                                       // 374
    scopeProto.$meteorCollection = $meteorStopper($meteorCollection);                                         // 375
    scopeProto.$meteorCollectionFS = $meteorStopper($meteorCollectionFS);                                     // 376
 }]);                                                                                                         // 377
                                                                                                              // 378
                                                                                                              // 379
// Local utilities                                                                                            // 380
var collectionUtils = {                                                                                       // 381
                                                                                                              // 382
  findIndexById: function(collection, doc) {                                                                  // 383
    var foundDoc = _.find(collection, function(colDoc) {                                                      // 384
      // EJSON.equals used to compare Mongo.ObjectIDs and Strings.                                            // 385
      return EJSON.equals(colDoc._id, doc._id);                                                               // 386
    });                                                                                                       // 387
    return _.indexOf(collection, foundDoc);                                                                   // 388
  },                                                                                                          // 389
                                                                                                              // 390
  // Finds changes between two collections and saves differences.                                             // 391
  diff: function(newCollection, oldCollection, diffMethod) {                                                  // 392
    var changes = {added: [], removed: [], changed: []};                                                      // 393
                                                                                                              // 394
    diffMethod(oldCollection, newCollection, {                                                                // 395
      addedAt: function(id, item, index) {                                                                    // 396
        changes.added.push({item: item, index: index});                                                       // 397
      },                                                                                                      // 398
                                                                                                              // 399
      removedAt: function(id, item, index) {                                                                  // 400
        changes.removed.push({item: item, index: index});                                                     // 401
      },                                                                                                      // 402
                                                                                                              // 403
      changedAt: function(id, setDiff, unsetDiff, index, oldItem) {                                           // 404
        changes.changed.push({setDiff: setDiff, unsetDiff: unsetDiff});                                       // 405
      },                                                                                                      // 406
                                                                                                              // 407
      movedTo: function(id, item, fromIndex, toIndex) {                                                       // 408
        // XXX do we need this?                                                                               // 409
      }                                                                                                       // 410
    });                                                                                                       // 411
                                                                                                              // 412
    return changes;                                                                                           // 413
  }                                                                                                           // 414
};                                                                                                            // 415
                                                                                                              // 416
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-object.js                                                          //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe', 'angular-meteor.collection', 'getUpdates', 'diffArray']);
                                                                                                              // 4
angularMeteorObject.factory('AngularMeteorObject', [                                                          // 5
  '$q', '$meteorSubscribe', '$meteorCollection', '$meteorUtils', 'diffArray', 'getUpdates',                   // 6
  function($q, $meteorSubscribe, $meteorCollection, $meteorUtils, diffArray, getUpdates) {                    // 7
    // A list of internals properties to not watch for, nor pass to the Document on update and etc.           // 8
    AngularMeteorObject.$$internalProps = [                                                                   // 9
      '$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', '$$scope',                         // 10
      'save', 'reset', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject',
      '_auto', '_setAutos', '_eventEmitter', '_serverBackup'                                                  // 12
    ];                                                                                                        // 13
                                                                                                              // 14
    function AngularMeteorObject (collection, id, options){                                                   // 15
      // Make data not be an object so we can extend it to preserve                                           // 16
      // Collection Helpers and the like                                                                      // 17
      var data = new function SubObject() {};                                                                 // 18
      var doc = collection.findOne(id, options);                                                              // 19
      angular.extend(data, doc);                                                                              // 20
      angular.extend(data, AngularMeteorObject);                                                              // 21
                                                                                                              // 22
      data._serverBackup = doc || {};                                                                         // 23
      data.$$collection = collection;                                                                         // 24
      data.$$options = options;                                                                               // 25
      data.$$id = id || new Mongo.ObjectID();                                                                 // 26
                                                                                                              // 27
      return data;                                                                                            // 28
    }                                                                                                         // 29
                                                                                                              // 30
    AngularMeteorObject.getRawObject = function () {                                                          // 31
      return angular.copy(_.omit(this, this.$$internalProps));                                                // 32
    };                                                                                                        // 33
                                                                                                              // 34
    AngularMeteorObject.subscribe = function () {                                                             // 35
      $meteorSubscribe.subscribe.apply(this, arguments);                                                      // 36
      return this;                                                                                            // 37
    };                                                                                                        // 38
                                                                                                              // 39
    AngularMeteorObject.save = function(custom) {                                                             // 40
      var deferred = $q.defer();                                                                              // 41
      var collection = this.$$collection;                                                                     // 42
      var createFulfill = _.partial($meteorUtils.fulfill, deferred, null);                                    // 43
      var oldDoc = collection.findOne(this.$$id);                                                             // 44
      var mods;                                                                                               // 45
                                                                                                              // 46
      // update                                                                                               // 47
      if (oldDoc) {                                                                                           // 48
        if (custom)                                                                                           // 49
          mods = { $set: custom };                                                                            // 50
        else {                                                                                                // 51
          mods = getUpdates(oldDoc, this.getRawObject());                                                     // 52
          // If there are no updates, there is nothing to do here, returning                                  // 53
          if (_.isEmpty(mods)) {                                                                              // 54
            return $q.when({ action: 'updated' });                                                            // 55
          }                                                                                                   // 56
        }                                                                                                     // 57
                                                                                                              // 58
        var pullUpdate;                                                                                       // 59
        if (mods.$pull) {                                                                                     // 60
          pullUpdate = { $pull : mods.$pull };                                                                // 61
        }                                                                                                     // 62
                                                                                                              // 63
        if (!pullUpdate) {                                                                                    // 64
          // NOTE: do not use #upsert() method, since it does not exist in some collections                   // 65
          collection.update(this.$$id, mods, createFulfill({action: 'updated'}));                             // 66
        }                                                                                                     // 67
        else {                                                                                                // 68
          collection.update(this.$$id, mods);                                                                 // 69
          collection.update(this.$$id, pullUpdate, createFulfill({action: 'updated'}))                        // 70
        }                                                                                                     // 71
      }                                                                                                       // 72
      // insert                                                                                               // 73
      else {                                                                                                  // 74
        if (custom)                                                                                           // 75
          mods = _.clone(custom);                                                                             // 76
        else                                                                                                  // 77
          mods = this.getRawObject();                                                                         // 78
                                                                                                              // 79
        mods._id = this.$$id;                                                                                 // 80
        collection.insert(mods, createFulfill({ action: 'inserted' }));                                       // 81
      }                                                                                                       // 82
                                                                                                              // 83
      return deferred.promise;                                                                                // 84
    };                                                                                                        // 85
                                                                                                              // 86
    AngularMeteorObject.reset = function(keepClientProps) {                                                   // 87
      var self = this;                                                                                        // 88
      var options = this.$$options;                                                                           // 89
      var id = this.$$id;                                                                                     // 90
      var doc = this.$$collection.findOne(id, options);                                                       // 91
                                                                                                              // 92
      if (doc) {                                                                                              // 93
        // extend SubObject                                                                                   // 94
        var docKeys = _.keys(doc);                                                                            // 95
        var docExtension = _.pick(doc, docKeys);                                                              // 96
        var clientProps;                                                                                      // 97
                                                                                                              // 98
        angular.extend(Object.getPrototypeOf(self), Object.getPrototypeOf(doc));                              // 99
        _.extend(self, docExtension);                                                                         // 100
        _.extend(self._serverBackup, docExtension);                                                           // 101
                                                                                                              // 102
        if (keepClientProps) {                                                                                // 103
          clientProps = _.intersection(_.keys(self), _.keys(self._serverBackup));                             // 104
        } else {                                                                                              // 105
          clientProps = _.keys(self);                                                                         // 106
        }                                                                                                     // 107
                                                                                                              // 108
        var serverProps = _.keys(doc);                                                                        // 109
        var removedKeys = _.difference(clientProps, serverProps, self.$$internalProps);                       // 110
                                                                                                              // 111
        removedKeys.forEach(function (prop) {                                                                 // 112
          delete self[prop];                                                                                  // 113
          delete self._serverBackup[prop];                                                                    // 114
        });                                                                                                   // 115
      }                                                                                                       // 116
                                                                                                              // 117
      else {                                                                                                  // 118
        _.keys(this.getRawObject()).forEach(function(prop) {                                                  // 119
          delete self[prop];                                                                                  // 120
        });                                                                                                   // 121
                                                                                                              // 122
        self._serverBackup = {};                                                                              // 123
      }                                                                                                       // 124
    };                                                                                                        // 125
                                                                                                              // 126
    AngularMeteorObject.stop = function () {                                                                  // 127
      if (this.unregisterAutoDestroy)                                                                         // 128
        this.unregisterAutoDestroy();                                                                         // 129
                                                                                                              // 130
      if (this.unregisterAutoBind)                                                                            // 131
        this.unregisterAutoBind();                                                                            // 132
                                                                                                              // 133
      if (this.autorunComputation && this.autorunComputation.stop)                                            // 134
        this.autorunComputation.stop();                                                                       // 135
    };                                                                                                        // 136
                                                                                                              // 137
    return AngularMeteorObject;                                                                               // 138
}]);                                                                                                          // 139
                                                                                                              // 140
                                                                                                              // 141
angularMeteorObject.factory('$meteorObject', [                                                                // 142
  '$rootScope', '$meteorUtils', 'getUpdates', 'AngularMeteorObject',                                          // 143
  function($rootScope, $meteorUtils, getUpdates, AngularMeteorObject) {                                       // 144
    function $meteorObject(collection, id, auto, options) {                                                   // 145
      // Validate parameters                                                                                  // 146
      if (!collection) {                                                                                      // 147
        throw new TypeError("The first argument of $meteorObject is undefined.");                             // 148
      }                                                                                                       // 149
                                                                                                              // 150
      if (!angular.isFunction(collection.findOne)) {                                                          // 151
        throw new TypeError("The first argument of $meteorObject must be a function or a have a findOne function property.");
      }                                                                                                       // 153
                                                                                                              // 154
      var data = new AngularMeteorObject(collection, id, options);                                            // 155
      data._auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570  // 156
      angular.extend(data, $meteorObject);                                                                    // 157
      data._setAutos();                                                                                       // 158
      return data;                                                                                            // 159
    }                                                                                                         // 160
                                                                                                              // 161
    $meteorObject._setAutos = function() {                                                                    // 162
      var self = this;                                                                                        // 163
                                                                                                              // 164
      this.autorunComputation = $meteorUtils.autorun($rootScope, function() {                                 // 165
        self.reset(true);                                                                                     // 166
      });                                                                                                     // 167
                                                                                                              // 168
      // Deep watches the model and performs autobind                                                         // 169
      this.unregisterAutoBind = this._auto && $rootScope.$watch(function(){                                   // 170
        return self.getRawObject();                                                                           // 171
      }, function (item, oldItem) {                                                                           // 172
        if (item === oldItem) {                                                                               // 173
          self.$$collection.update({_id: item._id}, self.getRawObject());                                     // 174
          return;                                                                                             // 175
        }                                                                                                     // 176
                                                                                                              // 177
        var id = item._id;                                                                                    // 178
        delete item._id;                                                                                      // 179
        delete oldItem._id;                                                                                   // 180
                                                                                                              // 181
        var updates = getUpdates(oldItem, item);                                                              // 182
        if (_.isEmpty(updates)) return;                                                                       // 183
        var pullUpdate;                                                                                       // 184
                                                                                                              // 185
        if (updates.$pull) {                                                                                  // 186
          pullUpdate = { $pull : updates.$pull };                                                             // 187
          delete updates.$pull;                                                                               // 188
        }                                                                                                     // 189
        self.$$collection.update({_id: id}, updates);                                                         // 190
                                                                                                              // 191
        if (pullUpdate) {                                                                                     // 192
          self.$$collection.update({ _id : id}, pullUpdate);                                                  // 193
        }                                                                                                     // 194
      }, true);                                                                                               // 195
                                                                                                              // 196
      this.unregisterAutoDestroy = $rootScope.$on('$destroy', function() {                                    // 197
        if (self && self.stop) {                                                                              // 198
          self.stop();                                                                                        // 199
        }                                                                                                     // 200
      });                                                                                                     // 201
    };                                                                                                        // 202
                                                                                                              // 203
    return $meteorObject;                                                                                     // 204
}]);                                                                                                          // 205
                                                                                                              // 206
angularMeteorObject.run([                                                                                     // 207
  '$rootScope', '$meteorObject', '$meteorStopper',                                                            // 208
  function ($rootScope, $meteorObject, $meteorStopper) {                                                      // 209
    var scopeProto = Object.getPrototypeOf($rootScope);                                                       // 210
    scopeProto.$meteorObject = $meteorStopper($meteorObject);                                                 // 211
}]);                                                                                                          // 212
                                                                                                              // 213
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-user.js                                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var angularMeteorUser = angular.module('angular-meteor.user', ['angular-meteor.utils']);                      // 3
                                                                                                              // 4
// requires package 'accounts-password'                                                                       // 5
angularMeteorUser.service('$meteorUser', [                                                                    // 6
  '$rootScope', '$meteorUtils', '$q',                                                                         // 7
  function($rootScope, $meteorUtils, $q){                                                                     // 8
    var pack = Package['accounts-base'];                                                                      // 9
    if (!pack) return;                                                                                        // 10
                                                                                                              // 11
    var self = this;                                                                                          // 12
    var Accounts = pack.Accounts;                                                                             // 13
                                                                                                              // 14
    this.waitForUser = function(){                                                                            // 15
                                                                                                              // 16
      var deferred = $q.defer();                                                                              // 17
                                                                                                              // 18
      $meteorUtils.autorun($rootScope, function(){                                                            // 19
        if ( !Meteor.loggingIn() )                                                                            // 20
          deferred.resolve( Meteor.user() );                                                                  // 21
      });                                                                                                     // 22
                                                                                                              // 23
      return deferred.promise;                                                                                // 24
    };                                                                                                        // 25
                                                                                                              // 26
    this.requireUser = function(){                                                                            // 27
                                                                                                              // 28
      var deferred = $q.defer();                                                                              // 29
                                                                                                              // 30
      $meteorUtils.autorun($rootScope, function(){                                                            // 31
        if ( !Meteor.loggingIn() ) {                                                                          // 32
          if ( Meteor.user() == null)                                                                         // 33
            deferred.reject("AUTH_REQUIRED");                                                                 // 34
          else                                                                                                // 35
            deferred.resolve( Meteor.user() );                                                                // 36
        }                                                                                                     // 37
      });                                                                                                     // 38
                                                                                                              // 39
      return deferred.promise;                                                                                // 40
    };                                                                                                        // 41
                                                                                                              // 42
    this.requireValidUser = function(validatorFn) {                                                           // 43
      return self.requireUser().then(function(user){                                                          // 44
        var valid = validatorFn( user );                                                                      // 45
                                                                                                              // 46
        if ( valid === true )                                                                                 // 47
          return user;                                                                                        // 48
        else if ( typeof valid === "string" )                                                                 // 49
          return $q.reject( valid );                                                                          // 50
        else                                                                                                  // 51
          return $q.reject( "FORBIDDEN" );                                                                    // 52
	    });                                                                                                      // 53
	  };                                                                                                         // 54
                                                                                                              // 55
    this.loginWithPassword = $meteorUtils.promissor(Meteor, 'loginWithPassword');                             // 56
    this.createUser = $meteorUtils.promissor(Accounts, 'createUser');                                         // 57
    this.changePassword = $meteorUtils.promissor(Accounts, 'changePassword');                                 // 58
    this.forgotPassword = $meteorUtils.promissor(Accounts, 'forgotPassword');                                 // 59
    this.resetPassword = $meteorUtils.promissor(Accounts, 'resetPassword');                                   // 60
    this.verifyEmail = $meteorUtils.promissor(Accounts, 'verifyEmail');                                       // 61
    this.logout = $meteorUtils.promissor(Meteor, 'logout');                                                   // 62
    this.logoutOtherClients = $meteorUtils.promissor(Meteor, 'logoutOtherClients');                           // 63
    this.loginWithFacebook = $meteorUtils.promissor(Meteor, 'loginWithFacebook');                             // 64
    this.loginWithTwitter = $meteorUtils.promissor(Meteor, 'loginWithTwitter');                               // 65
    this.loginWithGoogle = $meteorUtils.promissor(Meteor, 'loginWithGoogle');                                 // 66
    this.loginWithGithub = $meteorUtils.promissor(Meteor, 'loginWithGithub');                                 // 67
    this.loginWithMeteorDeveloperAccount = $meteorUtils.promissor(Meteor, 'loginWithMeteorDeveloperAccount');
    this.loginWithMeetup = $meteorUtils.promissor(Meteor, 'loginWithMeetup');                                 // 69
    this.loginWithWeibo = $meteorUtils.promissor(Meteor, 'loginWithWeibo');                                   // 70
  }                                                                                                           // 71
]);                                                                                                           // 72
                                                                                                              // 73
angularMeteorUser.run([                                                                                       // 74
  '$rootScope', '$meteorUtils',                                                                               // 75
  function($rootScope, $meteorUtils){                                                                         // 76
    $meteorUtils.autorun($rootScope, function(){                                                              // 77
      if (!Meteor.user) return;                                                                               // 78
      $rootScope.currentUser = Meteor.user();                                                                 // 79
      $rootScope.loggingIn = Meteor.loggingIn();                                                              // 80
    });                                                                                                       // 81
  }                                                                                                           // 82
]);                                                                                                           // 83
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-methods.js                                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var angularMeteorMethods = angular.module('angular-meteor.methods', ['angular-meteor.utils']);                // 3
                                                                                                              // 4
angularMeteorMethods.service('$meteorMethods', [                                                              // 5
  '$q', '$meteorUtils',                                                                                       // 6
  function($q, $meteorUtils) {                                                                                // 7
    this.call = function(){                                                                                   // 8
      var deferred = $q.defer();                                                                              // 9
      var fulfill = $meteorUtils.fulfill(deferred);                                                           // 10
      var args = _.toArray(arguments).concat(fulfill);                                                        // 11
      Meteor.call.apply(this, args);                                                                          // 12
      return deferred.promise;                                                                                // 13
    };                                                                                                        // 14
  }                                                                                                           // 15
]);                                                                                                           // 16
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-session.js                                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
var angularMeteorSession = angular.module('angular-meteor.session', ['angular-meteor.utils']);                // 2
                                                                                                              // 3
angularMeteorSession.factory('$meteorSession', ['$meteorUtils', '$parse',                                     // 4
  function ($meteorUtils, $parse) {                                                                           // 5
    return function (session) {                                                                               // 6
                                                                                                              // 7
      return {                                                                                                // 8
                                                                                                              // 9
        bind: function(scope, model) {                                                                        // 10
          var getter = $parse(model);                                                                         // 11
          var setter = getter.assign;                                                                         // 12
          $meteorUtils.autorun(scope, function() {                                                            // 13
            setter(scope, Session.get(session));                                                              // 14
          });                                                                                                 // 15
                                                                                                              // 16
          scope.$watch(model, function(newItem, oldItem) {                                                    // 17
            Session.set(session, getter(scope));                                                              // 18
          }, true);                                                                                           // 19
                                                                                                              // 20
        }                                                                                                     // 21
      };                                                                                                      // 22
    }                                                                                                         // 23
  }                                                                                                           // 24
]);                                                                                                           // 25
                                                                                                              // 26
                                                                                                              // 27
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-reactive-scope.js                                                  //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/**                                                                                                           // 1
 * Created by netanel on 29/12/14.                                                                            // 2
 */                                                                                                           // 3
var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', []);                         // 4
                                                                                                              // 5
angularMeteorReactiveScope.run(['$rootScope', '$parse', function($rootScope, $parse) {                        // 6
  Object.getPrototypeOf($rootScope).getReactively = function(property, objectEquality) {                      // 7
    var self = this;                                                                                          // 8
    var getValue = $parse(property);                                                                          // 9
    objectEquality = !!objectEquality;                                                                        // 10
                                                                                                              // 11
    if (!self.hasOwnProperty('$$trackerDeps')) {                                                              // 12
      self.$$trackerDeps = {};                                                                                // 13
    }                                                                                                         // 14
                                                                                                              // 15
    if (!self.$$trackerDeps[property]) {                                                                      // 16
      self.$$trackerDeps[property] = new Tracker.Dependency();                                                // 17
                                                                                                              // 18
      self.$watch(function() {                                                                                // 19
        return getValue(self)                                                                                 // 20
      }, function(newVal, oldVal) {                                                                           // 21
        if (newVal !== oldVal) {                                                                              // 22
          self.$$trackerDeps[property].changed();                                                             // 23
        }                                                                                                     // 24
      }, objectEquality);                                                                                     // 25
    }                                                                                                         // 26
                                                                                                              // 27
    self.$$trackerDeps[property].depend();                                                                    // 28
                                                                                                              // 29
    return getValue(self);                                                                                    // 30
  };                                                                                                          // 31
  Object.getPrototypeOf($rootScope).getCollectionReactively = function(property) {                            // 32
    var self = this;                                                                                          // 33
    var getValue = $parse(property);                                                                          // 34
                                                                                                              // 35
                                                                                                              // 36
    if (!self.hasOwnProperty('$$trackerDeps')) {                                                              // 37
      self.$$trackerDeps = {};                                                                                // 38
    }                                                                                                         // 39
                                                                                                              // 40
    if (!self.$$trackerDeps[property]) {                                                                      // 41
      self.$$trackerDeps[property] = new Tracker.Dependency();                                                // 42
                                                                                                              // 43
      self.$watchCollection(property, function() {                                                            // 44
        self.$$trackerDeps[property].changed();                                                               // 45
      });                                                                                                     // 46
    }                                                                                                         // 47
                                                                                                              // 48
    self.$$trackerDeps[property].depend();                                                                    // 49
                                                                                                              // 50
    return getValue(self);                                                                                    // 51
  };                                                                                                          // 52
}]);                                                                                                          // 53
                                                                                                              // 54
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-utils.js                                                           //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
var angularMeteorUtils = angular.module('angular-meteor.utils', []);                                          // 2
                                                                                                              // 3
angularMeteorUtils.service('$meteorUtils', [                                                                  // 4
  '$q', '$timeout',                                                                                           // 5
  function ($q, $timeout) {                                                                                   // 6
    var self = this;                                                                                          // 7
    this.getCollectionByName = function(string){                                                              // 8
      return Mongo.Collection.get(string);                                                                    // 9
    };                                                                                                        // 10
    this.autorun = function(scope, fn) {                                                                      // 11
      // wrapping around Deps.autorun                                                                         // 12
      var comp = Tracker.autorun(function(c) {                                                                // 13
        fn(c);                                                                                                // 14
                                                                                                              // 15
        // this is run immediately for the first call                                                         // 16
        // but after that, we need to $apply to start Angular digest                                          // 17
        if (!c.firstRun) $timeout(angular.noop, 0);                                                           // 18
      });                                                                                                     // 19
      // stop autorun when scope is destroyed                                                                 // 20
      scope.$on('$destroy', function() {                                                                      // 21
        comp.stop();                                                                                          // 22
      });                                                                                                     // 23
      // return autorun object so that it can be stopped manually                                             // 24
      return comp;                                                                                            // 25
    };                                                                                                        // 26
    // Borrowed from angularFire - https://github.com/firebase/angularfire/blob/master/src/utils.js#L445-L454
    this.stripDollarPrefixedKeys = function (data) {                                                          // 28
      if( !angular.isObject(data) ||                                                                          // 29
        data instanceof Date ||                                                                               // 30
        data instanceof File ||                                                                               // 31
        (typeof FS === 'object' && data instanceof FS.File)) {                                                // 32
        return data;                                                                                          // 33
      }                                                                                                       // 34
      var out = angular.isArray(data)? [] : {};                                                               // 35
      angular.forEach(data, function(v,k) {                                                                   // 36
        if(typeof k !== 'string' || k.charAt(0) !== '$') {                                                    // 37
          out[k] = self.stripDollarPrefixedKeys(v);                                                           // 38
        }                                                                                                     // 39
      });                                                                                                     // 40
      return out;                                                                                             // 41
    };                                                                                                        // 42
    // Returns a callback which fulfills promise                                                              // 43
    this.fulfill = function(deferred, boundError, boundResult) {                                              // 44
      return function(err, result) {                                                                          // 45
        if (err)                                                                                              // 46
          deferred.reject(boundError == null ? err : boundError);                                             // 47
        else if (typeof boundResult == "function")                                                            // 48
          deferred.resolve(boundResult == null ? result : boundResult(result));                               // 49
        else                                                                                                  // 50
          deferred.resolve(boundResult == null ? result : boundResult);                                       // 51
      };                                                                                                      // 52
    };                                                                                                        // 53
    // creates a function which invokes method with the given arguments and returns a promise                 // 54
    this.promissor = function(obj, method) {                                                                  // 55
      return function() {                                                                                     // 56
        var deferred = $q.defer();                                                                            // 57
        var fulfill = self.fulfill(deferred);                                                                 // 58
        var args = _.toArray(arguments).concat(fulfill);                                                      // 59
        obj[method].apply(obj, args);                                                                         // 60
        return deferred.promise;                                                                              // 61
      };                                                                                                      // 62
    };                                                                                                        // 63
  }                                                                                                           // 64
]);                                                                                                           // 65
                                                                                                              // 66
angularMeteorUtils.run(['$rootScope', '$meteorUtils',                                                         // 67
  function($rootScope, $meteorUtils) {                                                                        // 68
    Object.getPrototypeOf($rootScope).$meteorAutorun = function(fn) {                                         // 69
      return $meteorUtils.autorun(this, fn);                                                                  // 70
    };                                                                                                        // 71
}]);                                                                                                          // 72
                                                                                                              // 73
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/modules/angular-meteor-camera.js                                                          //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var angularMeteorCamera = angular.module('angular-meteor.camera', ['angular-meteor.utils']);                  // 3
                                                                                                              // 4
// requires package 'mdg:camera'                                                                              // 5
angularMeteorCamera.service('$meteorCamera', [                                                                // 6
  '$q', '$meteorUtils',                                                                                       // 7
  function ($q, $meteorUtils) {                                                                               // 8
    var pack = Package['mdg:camera'];                                                                         // 9
    if (!pack) return;                                                                                        // 10
                                                                                                              // 11
    var MeteorCamera = pack.MeteorCamera;                                                                     // 12
                                                                                                              // 13
    this.getPicture = function(options){                                                                      // 14
      options = options || {};                                                                                // 15
      var deferred = $q.defer();                                                                              // 16
      MeteorCamera.getPicture(options, $meteorUtils.fulfill(deferred));                                       // 17
      return deferred.promise;                                                                                // 18
    };                                                                                                        // 19
  }                                                                                                           // 20
]);                                                                                                           // 21
                                                                                                              // 22
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular/angular-meteor.js                                                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// Define angular-meteor and its dependencies                                                                 // 1
var angularMeteor = angular.module('angular-meteor', [                                                        // 2
  'angular-meteor.subscribe',                                                                                 // 3
  'angular-meteor.collection',                                                                                // 4
  'angular-meteor.object',                                                                                    // 5
  'angular-meteor.user',                                                                                      // 6
  'angular-meteor.methods',                                                                                   // 7
  'angular-meteor.session',                                                                                   // 8
  'angular-meteor.reactive-scope',                                                                            // 9
  'angular-meteor.utils',                                                                                     // 10
  'angular-meteor.camera'                                                                                     // 11
]);                                                                                                           // 12
                                                                                                              // 13
angularMeteor.run(['$compile', '$document', '$rootScope', function ($compile, $document, $rootScope) {        // 14
    // Recompile after iron:router builds page                                                                // 15
    if(Package['iron:router']) {                                                                              // 16
      var appLoaded = false;                                                                                  // 17
      Package['iron:router'].Router.onAfterAction(function(req, res, next) {                                  // 18
        Tracker.afterFlush(function() {                                                                       // 19
          if (!appLoaded) {                                                                                   // 20
            $compile($document)($rootScope);                                                                  // 21
            if (!$rootScope.$$phase) $rootScope.$apply();                                                     // 22
            appLoaded = true;                                                                                 // 23
          }                                                                                                   // 24
        })                                                                                                    // 25
      });                                                                                                     // 26
    }                                                                                                         // 27
  }]);                                                                                                        // 28
                                                                                                              // 29
// Putting all services under $meteor service for syntactic sugar                                             // 30
angularMeteor.service('$meteor', ['$meteorCollection', '$meteorCollectionFS', '$meteorObject', '$meteorMethods', '$meteorSession', '$meteorSubscribe', '$meteorUtils', '$meteorCamera', '$meteorUser',
  function($meteorCollection, $meteorCollectionFS, $meteorObject, $meteorMethods, $meteorSession, $meteorSubscribe, $meteorUtils, $meteorCamera, $meteorUser){
    this.collection = $meteorCollection;                                                                      // 33
    this.collectionFS = $meteorCollectionFS;                                                                  // 34
    this.object = $meteorObject;                                                                              // 35
    this.subscribe = $meteorSubscribe.subscribe;                                                              // 36
    this.call = $meteorMethods.call;                                                                          // 37
    this.loginWithPassword = $meteorUser.loginWithPassword;                                                   // 38
    this.requireUser = $meteorUser.requireUser;                                                               // 39
    this.requireValidUser = $meteorUser.requireValidUser;                                                     // 40
    this.waitForUser = $meteorUser.waitForUser;                                                               // 41
    this.createUser = $meteorUser.createUser;                                                                 // 42
    this.changePassword = $meteorUser.changePassword;                                                         // 43
    this.forgotPassword = $meteorUser.forgotPassword;                                                         // 44
    this.resetPassword = $meteorUser.resetPassword;                                                           // 45
    this.verifyEmail = $meteorUser.verifyEmail;                                                               // 46
    this.loginWithMeteorDeveloperAccount = $meteorUser.loginWithMeteorDeveloperAccount;                       // 47
    this.loginWithFacebook = $meteorUser.loginWithFacebook;                                                   // 48
    this.loginWithGithub = $meteorUser.loginWithGithub;                                                       // 49
    this.loginWithGoogle = $meteorUser.loginWithGoogle;                                                       // 50
    this.loginWithMeetup = $meteorUser.loginWithMeetup;                                                       // 51
    this.loginWithTwitter = $meteorUser.loginWithTwitter;                                                     // 52
    this.loginWithWeibo = $meteorUser.loginWithWeibo;                                                         // 53
    this.logout = $meteorUser.logout;                                                                         // 54
    this.logoutOtherClients = $meteorUser.logoutOtherClients;                                                 // 55
    this.session = $meteorSession;                                                                            // 56
    this.autorun = $meteorUtils.autorun;                                                                      // 57
    this.getCollectionByName = $meteorUtils.getCollectionByName;                                              // 58
    this.getPicture = $meteorCamera.getPicture;                                                               // 59
}]);                                                                                                          // 60
                                                                                                              // 61
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.angular = {};

})();
