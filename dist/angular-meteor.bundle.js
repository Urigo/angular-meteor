//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var _ = Package.underscore._;
var Random = Package.random.Random;

/* Package-scope variables */
var ObserveSequence, seqChangedToEmpty, seqChangedToArray, seqChangedToCursor;

(function () {

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
var idStringify = LocalCollection._idStringify;                                  // 12
var idParse = LocalCollection._idParse;                                          // 13
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
  //     'null', arrays and cursors.                                             // 25
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
          // If we were previously observing a cursor, replace lastSeqArray with // 86
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
  var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges;       // 153
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
      //   2. The element is moved back. Then the positions in between *and* the // 222
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
      id = (item && item._id) || index;                                          // 295
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
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
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

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/lai:collection-extensions/collection-extensions.js                               //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
// The collection extensions namespace                                                       // 1
CollectionExtensions = {};                                                                   // 2
                                                                                             // 3
// Stores all the collection extensions                                                      // 4
CollectionExtensions._extensions = [];                                                       // 5
                                                                                             // 6
// This is where you would add custom functionality to                                       // 7
// Mongo.Collection/Meteor.Collection                                                        // 8
Meteor.addCollectionExtension = function (customFunction) {                                  // 9
  if (typeof customFunction !== 'function') {                                                // 10
    throw new Meteor.Error(                                                                  // 11
      'collection-extension-wrong-argument',                                                 // 12
      'You must pass a function \
       into Meteor.addCollectionExtension().');                                              // 14
  }                                                                                          // 15
  CollectionExtensions._extensions.push(customFunction);                                     // 16
  // If Meteor.users exists, apply the extension right away                                  // 17
  if (typeof Meteor.users !== 'undefined') {                                                 // 18
    customFunction.apply(Meteor.users, ['users']);                                           // 19
  }                                                                                          // 20
};                                                                                           // 21
                                                                                             // 22
// Utility function to add a prototype function to your                                      // 23
// Meteor/Mongo.Collection object                                                            // 24
Meteor.addCollectionPrototype = function (name, customFunction) {                            // 25
  if (typeof name !== 'string') {                                                            // 26
    throw new Meteor.Error(                                                                  // 27
      'collection-extension-wrong-argument',                                                 // 28
      'You must pass a string as the first argument \
       into Meteor.addCollectionPrototype().');                                              // 30
  }                                                                                          // 31
  if (typeof customFunction !== 'function') {                                                // 32
    throw new Meteor.Error(                                                                  // 33
      'collection-extension-wrong-argument',                                                 // 34
      'You must pass a function as the second argument \
       into Meteor.addCollectionPrototype().');                                              // 36
  }                                                                                          // 37
  (typeof Mongo !== 'undefined' ?                                                            // 38
    Mongo.Collection :                                                                       // 39
    Meteor.Collection).prototype[name] = customFunction;                                     // 40
};                                                                                           // 41
                                                                                             // 42
// This is used to reassign the prototype of unfortunately                                   // 43
// and unstoppably already instantiated Mongo instances                                      // 44
// i.e. Meteor.users                                                                         // 45
CollectionExtensions._reassignCollectionPrototype = function (instance, constr) {            // 46
  var hasSetPrototypeOf = typeof Object.setPrototypeOf === 'function';                       // 47
                                                                                             // 48
  if (!constr) constr = typeof Mongo !== 'undefined' ? Mongo.Collection : Meteor.Collection; // 49
                                                                                             // 50
  // __proto__ is not available in < IE11                                                    // 51
  // Note: Assigning a prototype dynamically has performance implications                    // 52
  if (hasSetPrototypeOf) {                                                                   // 53
    Object.setPrototypeOf(instance, constr.prototype);                                       // 54
  } else if (instance.__proto__) {                                                           // 55
    instance.__proto__ = constr.prototype;                                                   // 56
  }                                                                                          // 57
};                                                                                           // 58
                                                                                             // 59
// This monkey-patches the Collection constructor                                            // 60
// This code is the same monkey-patching code                                                // 61
// that matb33:collection-hooks uses, which works pretty nicely                              // 62
CollectionExtensions._wrapCollection = function (ns, as) {                                   // 63
  // Save the original prototype                                                             // 64
  if (!as._CollectionPrototype) as._CollectionPrototype = new as.Collection(null);           // 65
                                                                                             // 66
  var constructor = as.Collection;                                                           // 67
  var proto = as._CollectionPrototype;                                                       // 68
                                                                                             // 69
  ns.Collection = function () {                                                              // 70
    var ret = constructor.apply(this, arguments);                                            // 71
    // This is where all the collection extensions get processed                             // 72
    CollectionExtensions._processCollectionExtensions(this, arguments);                      // 73
    return ret;                                                                              // 74
  };                                                                                         // 75
                                                                                             // 76
  ns.Collection.prototype = proto;                                                           // 77
  ns.Collection.prototype.constructor = ns.Collection;                                       // 78
                                                                                             // 79
  for (var prop in constructor) {                                                            // 80
    if (constructor.hasOwnProperty(prop)) {                                                  // 81
      ns.Collection[prop] = constructor[prop];                                               // 82
    }                                                                                        // 83
  }                                                                                          // 84
};                                                                                           // 85
                                                                                             // 86
CollectionExtensions._processCollectionExtensions = function (self, args) {                  // 87
  // Using old-school operations for better performance                                      // 88
  // Please don't judge me ;P                                                                // 89
  var args = args ? [].slice.call(args, 0) : undefined;                                      // 90
  var extensions = CollectionExtensions._extensions;                                         // 91
  for (var i = 0, len = extensions.length; i < len; i++) {                                   // 92
    extensions[i].apply(self, args);                                                         // 93
  }                                                                                          // 94
};                                                                                           // 95
                                                                                             // 96
if (typeof Mongo !== 'undefined') {                                                          // 97
  CollectionExtensions._wrapCollection(Meteor, Mongo);                                       // 98
  CollectionExtensions._wrapCollection(Mongo, Mongo);                                        // 99
} else {                                                                                     // 100
  CollectionExtensions._wrapCollection(Meteor, Meteor);                                      // 101
}                                                                                            // 102
                                                                                             // 103
if (typeof Meteor.users !== 'undefined') {                                                   // 104
  // Ensures that Meteor.users instanceof Mongo.Collection                                   // 105
  CollectionExtensions._reassignCollectionPrototype(Meteor.users);                           // 106
}                                                                                            // 107
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['lai:collection-extensions'] = {};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/dburles:mongo-collection-instances/mongo-instances.js                                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var instances = [];                                                                                           // 1
                                                                                                              // 2
Meteor.addCollectionExtension(function (name, options) {                                                      // 3
  instances.push({                                                                                            // 4
    name: name,                                                                                               // 5
    instance: this,                                                                                           // 6
    options: options                                                                                          // 7
  });                                                                                                         // 8
});                                                                                                           // 9
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['dburles:mongo-collection-instances'] = {};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;

(function () {

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






(function () {

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
        if (!_.isObject(v) || _.isEmpty(v)) return k;                                                         // 27
                                                                                                              // 28
        return getKeyPaths(v).map(function(subKey) {                                                          // 29
          return k + '.' + subKey;                                                                            // 30
        });                                                                                                   // 31
      });                                                                                                     // 32
                                                                                                              // 33
      return _.flatten(keys);                                                                                 // 34
    };                                                                                                        // 35
                                                                                                              // 36
    var getDeepValues = function(obj) {                                                                       // 37
      var values = _.values(obj).map(function(v) {                                                            // 38
        if (!_.isObject(v) || _.isEmpty(v))                                                                   // 39
          return v;                                                                                           // 40
        else                                                                                                  // 41
          return getDeepValues(v);                                                                            // 42
      });                                                                                                     // 43
                                                                                                              // 44
      return flatten(values);                                                                                 // 45
    };                                                                                                        // 46
                                                                                                              // 47
    var flatten = function(arr) {                                                                             // 48
      return arr.reduce(function(flattened, v, i) {                                                           // 49
        if (_.isArray(v) && !_.isEmpty(v))                                                                    // 50
          flattened.push.apply(flattened, flatten(v));                                                        // 51
        else                                                                                                  // 52
          flattened.push(v);                                                                                  // 53
                                                                                                              // 54
        return flattened;                                                                                     // 55
      }, []);                                                                                                 // 56
    };                                                                                                        // 57
                                                                                                              // 58
    var setFilled = function(obj, k, v) {                                                                     // 59
      if (!_.isEmpty(v)) obj[k] = v;                                                                          // 60
    };                                                                                                        // 61
                                                                                                              // 62
    var assert = function(result, msg) {                                                                      // 63
      if (!result) throwErr(msg);                                                                             // 64
    };                                                                                                        // 65
                                                                                                              // 66
    var throwErr = function(msg) {                                                                            // 67
      throw Error('get-updates error - ' + msg);                                                              // 68
    };                                                                                                        // 69
                                                                                                              // 70
    return {                                                                                                  // 71
      rip: rip,                                                                                               // 72
      toPaths: toPaths,                                                                                       // 73
      getKeyPaths: getKeyPaths,                                                                               // 74
      getDeepValues: getDeepValues,                                                                           // 75
      setFilled: setFilled,                                                                                   // 76
      assert: assert,                                                                                         // 77
      throwErr: throwErr                                                                                      // 78
    };                                                                                                        // 79
  })();                                                                                                       // 80
                                                                                                              // 81
  var getDifference = (function() {                                                                           // 82
    var getDifference = function(src, dst, isShallow) {                                                       // 83
      var level;                                                                                              // 84
                                                                                                              // 85
      if (isShallow > 1)                                                                                      // 86
        level = isShallow;                                                                                    // 87
      else if (isShallow)                                                                                     // 88
        level = 1;                                                                                            // 89
                                                                                                              // 90
      if (level) {                                                                                            // 91
        src = utils.rip(src, level);                                                                          // 92
        dst = utils.rip(dst, level);                                                                          // 93
      }                                                                                                       // 94
                                                                                                              // 95
      return compare(src, dst);                                                                               // 96
    };                                                                                                        // 97
                                                                                                              // 98
    var compare = function(src, dst) {                                                                        // 99
      var srcKeys = _.keys(src);                                                                              // 100
      var dstKeys = _.keys(dst);                                                                              // 101
                                                                                                              // 102
      var keys = _.chain([])                                                                                  // 103
        .concat(srcKeys)                                                                                      // 104
        .concat(dstKeys)                                                                                      // 105
        .uniq()                                                                                               // 106
        .without('$$hashKey')                                                                                 // 107
        .value();                                                                                             // 108
                                                                                                              // 109
      return keys.reduce(function(diff, k) {                                                                  // 110
        var srcValue = src[k];                                                                                // 111
        var dstValue = dst[k];                                                                                // 112
                                                                                                              // 113
        if (_.isDate(srcValue) && _.isDate(dstValue)) {                                                       // 114
          if (srcValue.getTime() != dstValue.getTime()) diff[k] = dstValue;                                   // 115
        }                                                                                                     // 116
                                                                                                              // 117
        if (_.isObject(srcValue) && _.isObject(dstValue)) {                                                   // 118
          var valueDiff = getDifference(srcValue, dstValue);                                                  // 119
          utils.setFilled(diff, k, valueDiff);                                                                // 120
        }                                                                                                     // 121
                                                                                                              // 122
        else if (srcValue !== dstValue) {                                                                     // 123
          diff[k] = dstValue;                                                                                 // 124
        }                                                                                                     // 125
                                                                                                              // 126
        return diff;                                                                                          // 127
      }, {});                                                                                                 // 128
    };                                                                                                        // 129
                                                                                                              // 130
    return getDifference;                                                                                     // 131
  })();                                                                                                       // 132
                                                                                                              // 133
  var getUpdates = (function() {                                                                              // 134
    var getUpdates = function(src, dst, isShallow) {                                                          // 135
      utils.assert(_.isObject(src), 'first argument must be an object');                                      // 136
      utils.assert(_.isObject(dst), 'second argument must be an object');                                     // 137
                                                                                                              // 138
      var diff = getDifference(src, dst, isShallow);                                                          // 139
      var paths = utils.toPaths(diff);                                                                        // 140
                                                                                                              // 141
      var set = createSet(paths);                                                                             // 142
      var unset = createUnset(paths);                                                                         // 143
      var pull = createPull(unset);                                                                           // 144
                                                                                                              // 145
      var updates = {};                                                                                       // 146
      utils.setFilled(updates, '$set', set);                                                                  // 147
      utils.setFilled(updates, '$unset', unset);                                                              // 148
      utils.setFilled(updates, '$pull', pull);                                                                // 149
                                                                                                              // 150
      return updates;                                                                                         // 151
    };                                                                                                        // 152
                                                                                                              // 153
    var createSet = function(paths) {                                                                         // 154
      var undefinedKeys = getUndefinedKeys(paths);                                                            // 155
      return _.omit(paths, undefinedKeys);                                                                    // 156
    };                                                                                                        // 157
                                                                                                              // 158
    var createUnset = function(paths) {                                                                       // 159
      var undefinedKeys = getUndefinedKeys(paths);                                                            // 160
      var unset = _.pick(paths, undefinedKeys);                                                               // 161
                                                                                                              // 162
      return _.reduce(unset, function(result, v, k) {                                                         // 163
        result[k] = true;                                                                                     // 164
        return result;                                                                                        // 165
      }, {});                                                                                                 // 166
    };                                                                                                        // 167
                                                                                                              // 168
    var createPull = function(unset) {                                                                        // 169
      var arrKeyPaths = _.keys(unset).map(function(k) {                                                       // 170
        var split = k.match(/(.*)\.\d+$/);                                                                    // 171
        return split && split[1];                                                                             // 172
      });                                                                                                     // 173
                                                                                                              // 174
      return _.compact(arrKeyPaths).reduce(function(pull, k) {                                                // 175
        pull[k] = null;                                                                                       // 176
        return pull;                                                                                          // 177
      }, {});                                                                                                 // 178
    };                                                                                                        // 179
                                                                                                              // 180
    var getUndefinedKeys = function(obj) {                                                                    // 181
      return _.keys(obj).filter(function (k) {                                                                // 182
        var v = obj[k];                                                                                       // 183
        return _.isUndefined(v);                                                                              // 184
      });                                                                                                     // 185
    };                                                                                                        // 186
                                                                                                              // 187
    return getUpdates;                                                                                        // 188
  })();                                                                                                       // 189
                                                                                                              // 190
  module.value('getUpdates', getUpdates);                                                                     // 191
})();                                                                                                         // 192
                                                                                                              // 193
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

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
                                                                                                              // 10
      args.push({                                                                                             // 11
        onReady: function() {                                                                                 // 12
          deferred.resolve(subscription);                                                                     // 13
        },                                                                                                    // 14
        onError: function(err) {                                                                              // 15
          deferred.reject(err);                                                                               // 16
        }                                                                                                     // 17
      });                                                                                                     // 18
                                                                                                              // 19
      subscription =  Meteor.subscribe.apply(scope, args);                                                    // 20
                                                                                                              // 21
      return subscription;                                                                                    // 22
    };                                                                                                        // 23
                                                                                                              // 24
    this.subscribe = function(){                                                                              // 25
      var deferred = $q.defer();                                                                              // 26
      var args = Array.prototype.slice.call(arguments);                                                       // 27
      var subscription = null;                                                                                // 28
                                                                                                              // 29
      self._subscribe(this, deferred, args);                                                                  // 30
                                                                                                              // 31
      return deferred.promise;                                                                                // 32
    };                                                                                                        // 33
  }]);                                                                                                        // 34
                                                                                                              // 35
angularMeteorSubscribe.run(['$rootScope', '$q', '$meteorSubscribe',                                           // 36
  function($rootScope, $q, $meteorSubscribe) {                                                                // 37
    Object.getPrototypeOf($rootScope).$meteorSubscribe = function() {                                         // 38
      var deferred = $q.defer();                                                                              // 39
      var args = Array.prototype.slice.call(arguments);                                                       // 40
                                                                                                              // 41
      var subscription = $meteorSubscribe._subscribe(this, deferred, args);                                   // 42
                                                                                                              // 43
      this.$on('$destroy', function() {                                                                       // 44
        subscription.stop();                                                                                  // 45
      });                                                                                                     // 46
                                                                                                              // 47
      return deferred.promise;                                                                                // 48
    };                                                                                                        // 49
}]);                                                                                                          // 50
                                                                                                              // 51
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

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






(function () {

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
      var createFulfill = _.partial($meteorUtils.fulfill, deferred, null);                                    // 85
      var fulfill;                                                                                            // 86
                                                                                                              // 87
      // delete $$hashkey                                                                                     // 88
      doc = $meteorUtils.stripDollarPrefixedKeys(doc);                                                        // 89
      var docId = doc._id;                                                                                    // 90
      var isExist = collection.findOne(docId);                                                                // 91
                                                                                                              // 92
      // update                                                                                               // 93
      if (isExist) {                                                                                          // 94
        // Deletes _id property (from the copy) so that                                                       // 95
        // it can be $set using update.                                                                       // 96
        delete doc._id;                                                                                       // 97
        var modifier = useUnsetModifier ? {$unset: doc} : {$set: doc};                                        // 98
        fulfill = createFulfill({_id: docId, action: 'updated'});                                             // 99
        // NOTE: do not use #upsert() method, since it does not exist in some collections                     // 100
        collection.update(docId, modifier, fulfill);                                                          // 101
      // insert                                                                                               // 102
      } else {                                                                                                // 103
        fulfill = createFulfill({_id: docId, action: 'inserted'});                                            // 104
        collection.insert(doc, fulfill);                                                                      // 105
      }                                                                                                       // 106
                                                                                                              // 107
      return deferred.promise;                                                                                // 108
    };                                                                                                        // 109
                                                                                                              // 110
    AngularMeteorCollection.remove = function(keyOrDocs) {                                                    // 111
      var keys;                                                                                               // 112
      // remove whole collection                                                                              // 113
      if (!keyOrDocs) {                                                                                       // 114
        keys = _.pluck(this, '_id');                                                                          // 115
      } else {                                                                                                // 116
        // remove docs                                                                                        // 117
        keys = _.map([].concat(keyOrDocs), function(keyOrDoc) {                                               // 118
          return keyOrDoc._id || keyOrDoc;                                                                    // 119
        });                                                                                                   // 120
      }                                                                                                       // 121
      // Checks if all keys are correct.                                                                      // 122
      check(keys, [Match.OneOf(String, Mongo.ObjectID)]);                                                     // 123
                                                                                                              // 124
      var promises = keys.map(function(key) {                                                                 // 125
        return this._removeDoc(key);                                                                          // 126
      }, this);                                                                                               // 127
                                                                                                              // 128
      var allPromise = $q.all(promises);                                                                      // 129
                                                                                                              // 130
      allPromise.finally(function() {                                                                         // 131
        $timeout(angular.noop);                                                                               // 132
      });                                                                                                     // 133
                                                                                                              // 134
      return allPromise;                                                                                      // 135
    };                                                                                                        // 136
                                                                                                              // 137
    AngularMeteorCollection._removeDoc = function(id) {                                                       // 138
      var deferred = $q.defer();                                                                              // 139
      var collection = this.$$collection;                                                                     // 140
      var fulfill = $meteorUtils.fulfill(deferred, null, { _id: id, action: 'removed' });                     // 141
      collection.remove(id, fulfill);                                                                         // 142
      return deferred.promise;                                                                                // 143
    };                                                                                                        // 144
                                                                                                              // 145
    AngularMeteorCollection._updateCursor = function(cursor, autoClientSave) {                                // 146
      var self = this;                                                                                        // 147
                                                                                                              // 148
      // XXX - consider adding an option for a non-orderd result                                              // 149
      // for faster performance.                                                                              // 150
      if (self._hObserve) {                                                                                   // 151
        self._hObserve.stop();                                                                                // 152
        self._hDataAutorun.stop();                                                                            // 153
      }                                                                                                       // 154
                                                                                                              // 155
      var serverMode = false;                                                                                 // 156
      function setServerUpdateMode(name) {                                                                    // 157
        serverMode = true;                                                                                    // 158
        // To simplify server update logic, we don't follow                                                   // 159
        // updates from the client at the same time.                                                          // 160
        self._unsetAutoClientSave();                                                                          // 161
      }                                                                                                       // 162
                                                                                                              // 163
      var hUnsetTimeout = null;                                                                               // 164
      // Here we use $timeout to combine multiple updates that go                                             // 165
      // each one after another.                                                                              // 166
      function unsetServerUpdateMode() {                                                                      // 167
        if (hUnsetTimeout) {                                                                                  // 168
          $timeout.cancel(hUnsetTimeout);                                                                     // 169
          hUnsetTimeout = null;                                                                               // 170
        }                                                                                                     // 171
        hUnsetTimeout = $timeout(function() {                                                                 // 172
          serverMode = false;                                                                                 // 173
          // Finds updates that was potentially done from the client side                                     // 174
          // and saves them.                                                                                  // 175
          var changes = collectionUtils.diff(self, self._serverBackup,                                        // 176
            self._diffArrayFunc);                                                                             // 177
          self._saveChanges(changes);                                                                         // 178
          // After, continues following client updates.                                                       // 179
          if (autoClientSave) {                                                                               // 180
            self._setAutoClientSave();                                                                        // 181
          }                                                                                                   // 182
        }, 0);                                                                                                // 183
      }                                                                                                       // 184
                                                                                                              // 185
      this._hObserve = cursor.observe({                                                                       // 186
        addedAt: function(doc, atIndex) {                                                                     // 187
          self.splice(atIndex, 0, doc);                                                                       // 188
          self._serverBackup.splice(atIndex, 0, doc);                                                         // 189
          setServerUpdateMode();                                                                              // 190
        },                                                                                                    // 191
                                                                                                              // 192
        changedAt: function(doc, oldDoc, atIndex) {                                                           // 193
          diffArray.deepCopyChanges(self[atIndex], doc);                                                      // 194
          diffArray.deepCopyRemovals(self[atIndex], doc);                                                     // 195
          self._serverBackup[atIndex] = self[atIndex];                                                        // 196
          setServerUpdateMode();                                                                              // 197
        },                                                                                                    // 198
                                                                                                              // 199
        movedTo: function(doc, fromIndex, toIndex) {                                                          // 200
          self.splice(fromIndex, 1);                                                                          // 201
          self.splice(toIndex, 0, doc);                                                                       // 202
          self._serverBackup.splice(fromIndex, 1);                                                            // 203
          self._serverBackup.splice(toIndex, 0, doc);                                                         // 204
          setServerUpdateMode();                                                                              // 205
        },                                                                                                    // 206
                                                                                                              // 207
        removedAt: function(oldDoc) {                                                                         // 208
          var removedIndex = collectionUtils.findIndexById(self, oldDoc);                                     // 209
                                                                                                              // 210
          if (removedIndex != -1) {                                                                           // 211
            self.splice(removedIndex, 1);                                                                     // 212
            self._serverBackup.splice(removedIndex, 1);                                                       // 213
            setServerUpdateMode();                                                                            // 214
          } else {                                                                                            // 215
            // If it's been removed on client then it's already not in collection                             // 216
            // itself but still is in the _serverBackup.                                                      // 217
            removedIndex = collectionUtils.findIndexById(self._serverBackup, oldDoc);                         // 218
                                                                                                              // 219
            if (removedIndex != -1) {                                                                         // 220
              self._serverBackup.splice(removedIndex, 1);                                                     // 221
            }                                                                                                 // 222
          }                                                                                                   // 223
        }                                                                                                     // 224
      });                                                                                                     // 225
                                                                                                              // 226
      this._hDataAutorun = Tracker.autorun(function() {                                                       // 227
        cursor.fetch();                                                                                       // 228
        if (serverMode) {                                                                                     // 229
          unsetServerUpdateMode();                                                                            // 230
        }                                                                                                     // 231
      });                                                                                                     // 232
    };                                                                                                        // 233
                                                                                                              // 234
    AngularMeteorCollection.stop = function() {                                                               // 235
      this._stopCursor();                                                                                     // 236
      this._hNewCurAutorun.stop();                                                                            // 237
    };                                                                                                        // 238
                                                                                                              // 239
    AngularMeteorCollection._stopCursor = function() {                                                        // 240
      this._unsetAutoClientSave();                                                                            // 241
                                                                                                              // 242
      if (this._hObserve) {                                                                                   // 243
        this._hObserve.stop();                                                                                // 244
        this._hDataAutorun.stop();                                                                            // 245
      }                                                                                                       // 246
                                                                                                              // 247
      this.splice(0);                                                                                         // 248
      this._serverBackup.splice(0);                                                                           // 249
    };                                                                                                        // 250
                                                                                                              // 251
    AngularMeteorCollection._unsetAutoClientSave = function(name) {                                           // 252
      if (this._hRegAutoBind) {                                                                               // 253
        this._hRegAutoBind();                                                                                 // 254
        this._hRegAutoBind = null;                                                                            // 255
      }                                                                                                       // 256
    };                                                                                                        // 257
                                                                                                              // 258
    AngularMeteorCollection._setAutoClientSave = function() {                                                 // 259
      var self = this;                                                                                        // 260
                                                                                                              // 261
      // Always unsets auto save to keep only one $watch handler.                                             // 262
      self._unsetAutoClientSave();                                                                            // 263
                                                                                                              // 264
      self._hRegAutoBind = $rootScope.$watch(function() {                                                     // 265
        return self;                                                                                          // 266
      }, function(nItems, oItems) {                                                                           // 267
        if (nItems === oItems) return;                                                                        // 268
                                                                                                              // 269
        self._unsetAutoClientSave();                                                                          // 270
        var changes = collectionUtils.diff(self, oItems,                                                      // 271
          self._diffArrayFunc);                                                                               // 272
        self._saveChanges(changes);                                                                           // 273
        self._setAutoClientSave();                                                                            // 274
      }, true);                                                                                               // 275
    };                                                                                                        // 276
                                                                                                              // 277
    AngularMeteorCollection._saveChanges = function(changes) {                                                // 278
      // First applies changes to the collection itself.                                                      // 279
      var newDocs = [];                                                                                       // 280
      for (var itemInd = changes.added.length - 1; itemInd >= 0; itemInd--) {                                 // 281
        this.splice(changes.added[itemInd].index, 1);                                                         // 282
        newDocs.push(changes.added[itemInd].item);                                                            // 283
      }                                                                                                       // 284
      // Then saves all new docs in bulk.                                                                     // 285
      if (newDocs.length) {                                                                                   // 286
        this.save(newDocs);                                                                                   // 287
      }                                                                                                       // 288
                                                                                                              // 289
      // Collects docs to remove.                                                                             // 290
      var removeDocs = [];                                                                                    // 291
      for (var itemInd = 0; itemInd < changes.removed.length; itemInd++) {                                    // 292
        removeDocs.push(changes.removed[itemInd].item);                                                       // 293
      }                                                                                                       // 294
      // Removes docs in bulk.                                                                                // 295
      if (removeDocs.length) {                                                                                // 296
        this.remove(removeDocs);                                                                              // 297
      }                                                                                                       // 298
                                                                                                              // 299
      // Collects set and unset changes.                                                                      // 300
      var setDocs = [], unsetDocs = [];                                                                       // 301
      for (var itemInd = 0; itemInd < changes.changed.length; itemInd++) {                                    // 302
        var change = changes.changed[itemInd];                                                                // 303
        if (change.setDiff) {                                                                                 // 304
          setDocs.push(change.setDiff);                                                                       // 305
        }                                                                                                     // 306
        if (change.unsetDiff) {                                                                               // 307
          unsetDocs.push(change.unsetDiff);                                                                   // 308
        }                                                                                                     // 309
      }                                                                                                       // 310
      // Then saves all changes in bulk.                                                                      // 311
      if (setDocs.length) {                                                                                   // 312
        this.save(setDocs);                                                                                   // 313
      }                                                                                                       // 314
      if (unsetDocs.length) {                                                                                 // 315
        this.save(unsetDocs, true);                                                                           // 316
      }                                                                                                       // 317
    };                                                                                                        // 318
                                                                                                              // 319
    return AngularMeteorCollection;                                                                           // 320
}]);                                                                                                          // 321
                                                                                                              // 322
angularMeteorCollection.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray',                     // 323
  function($meteorCollection, diffArray) {                                                                    // 324
    function $meteorCollectionFS(reactiveFunc, autoClientSave, collection) {                                  // 325
      return new $meteorCollection(reactiveFunc, autoClientSave, collection, noNestedDiffArray);              // 326
    }                                                                                                         // 327
                                                                                                              // 328
    var noNestedDiffArray = function(lastSeqArray, seqArray, callbacks) {                                     // 329
      return diffArray(lastSeqArray, seqArray, callbacks, true);                                              // 330
    };                                                                                                        // 331
                                                                                                              // 332
    return $meteorCollectionFS;                                                                               // 333
}]);                                                                                                          // 334
                                                                                                              // 335
angularMeteorCollection.factory('$meteorCollection', [                                                        // 336
  'AngularMeteorCollection', '$rootScope', 'diffArray',                                                       // 337
  function(AngularMeteorCollection, $rootScope, diffArray) {                                                  // 338
    function $meteorCollection(reactiveFunc, autoClientSave, collection, diffArrayFunc) {                     // 339
      // Validate parameters                                                                                  // 340
      if (!reactiveFunc) {                                                                                    // 341
        throw new TypeError('The first argument of $meteorCollection is undefined.');                         // 342
      }                                                                                                       // 343
                                                                                                              // 344
      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {                     // 345
        throw new TypeError(                                                                                  // 346
          'The first argument of $meteorCollection must be a function or\
            a have a find function property.');                                                               // 348
      }                                                                                                       // 349
                                                                                                              // 350
      if (!angular.isFunction(reactiveFunc)) {                                                                // 351
        collection = angular.isDefined(collection) ? collection : reactiveFunc;                               // 352
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);                                               // 353
      }                                                                                                       // 354
                                                                                                              // 355
      // By default auto save - true.                                                                         // 356
      autoClientSave = angular.isDefined(autoClientSave) ? autoClientSave : true;                             // 357
      var ngCollection = new AngularMeteorCollection(reactiveFunc, collection,                                // 358
        diffArrayFunc || diffArray, autoClientSave);                                                          // 359
                                                                                                              // 360
      return ngCollection;                                                                                    // 361
    }                                                                                                         // 362
                                                                                                              // 363
    return $meteorCollection;                                                                                 // 364
 }]);                                                                                                         // 365
                                                                                                              // 366
angularMeteorCollection.run([                                                                                 // 367
  '$rootScope', '$meteorCollection', '$meteorCollectionFS', '$meteorStopper',                                 // 368
  function($rootScope, $meteorCollection, $meteorCollectionFS, $meteorStopper) {                              // 369
    var scopeProto = Object.getPrototypeOf($rootScope);                                                       // 370
    scopeProto.$meteorCollection = $meteorStopper($meteorCollection);                                         // 371
    scopeProto.$meteorCollectionFS = $meteorStopper($meteorCollectionFS);                                     // 372
 }]);                                                                                                         // 373
                                                                                                              // 374
                                                                                                              // 375
// Local utilities                                                                                            // 376
var collectionUtils = {                                                                                       // 377
                                                                                                              // 378
  findIndexById: function(collection, doc) {                                                                  // 379
    var foundDoc = _.find(collection, function(colDoc) {                                                      // 380
      // EJSON.equals used to compare Mongo.ObjectIDs and Strings.                                            // 381
      return EJSON.equals(colDoc._id, doc._id);                                                               // 382
    });                                                                                                       // 383
    return _.indexOf(collection, foundDoc);                                                                   // 384
  },                                                                                                          // 385
                                                                                                              // 386
  // Finds changes between two collections and saves differences.                                             // 387
  diff: function(newCollection, oldCollection, diffMethod) {                                                  // 388
    var changes = {added: [], removed: [], changed: []};                                                      // 389
                                                                                                              // 390
    diffMethod(oldCollection, newCollection, {                                                                // 391
      addedAt: function(id, item, index) {                                                                    // 392
        changes.added.push({item: item, index: index});                                                       // 393
      },                                                                                                      // 394
                                                                                                              // 395
      removedAt: function(id, item, index) {                                                                  // 396
        changes.removed.push({item: item, index: index});                                                     // 397
      },                                                                                                      // 398
                                                                                                              // 399
      changedAt: function(id, setDiff, unsetDiff, index, oldItem) {                                           // 400
        changes.changed.push({setDiff: setDiff, unsetDiff: unsetDiff});                                       // 401
      },                                                                                                      // 402
                                                                                                              // 403
      movedTo: function(id, item, fromIndex, toIndex) {                                                       // 404
        // XXX do we need this?                                                                               // 405
      }                                                                                                       // 406
    });                                                                                                       // 407
                                                                                                              // 408
    return changes;                                                                                           // 409
  }                                                                                                           // 410
};                                                                                                            // 411
                                                                                                              // 412
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

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
        else                                                                                                  // 51
          mods = getUpdates(oldDoc, this.getRawObject());                                                     // 52
                                                                                                              // 53
        // NOTE: do not use #upsert() method, since it does not exist in some collections                     // 54
        collection.update(this.$$id, mods, createFulfill({ action: 'updated' }));                             // 55
      }                                                                                                       // 56
      // insert                                                                                               // 57
      else {                                                                                                  // 58
        if (custom)                                                                                           // 59
          mods = _.clone(custom);                                                                             // 60
        else                                                                                                  // 61
          mods = this.getRawObject();                                                                         // 62
                                                                                                              // 63
        mods._id = this.$$id;                                                                                 // 64
        collection.insert(mods, createFulfill({ action: 'inserted' }));                                       // 65
      }                                                                                                       // 66
                                                                                                              // 67
      return deferred.promise;                                                                                // 68
    };                                                                                                        // 69
                                                                                                              // 70
    AngularMeteorObject.reset = function(keepClientProps) {                                                   // 71
      var self = this;                                                                                        // 72
      var options = this.$$options;                                                                           // 73
      var id = this.$$id;                                                                                     // 74
      var doc = this.$$collection.findOne(id, options);                                                       // 75
                                                                                                              // 76
      if (doc) {                                                                                              // 77
        // extend SubObject                                                                                   // 78
        var docKeys = _.keys(doc);                                                                            // 79
        var docExtension = _.pick(doc, docKeys);                                                              // 80
        var clientProps;                                                                                      // 81
                                                                                                              // 82
        angular.extend(Object.getPrototypeOf(self), Object.getPrototypeOf(doc));                              // 83
        _.extend(self, docExtension);                                                                         // 84
        _.extend(self._serverBackup, docExtension);                                                           // 85
                                                                                                              // 86
        if (keepClientProps) {                                                                                // 87
          clientProps = _.intersection(_.keys(self), _.keys(self._serverBackup));                             // 88
        } else {                                                                                              // 89
          clientProps = _.keys(self);                                                                         // 90
        }                                                                                                     // 91
                                                                                                              // 92
        var serverProps = _.keys(doc);                                                                        // 93
        var removedKeys = _.difference(clientProps, serverProps, self.$$internalProps);                       // 94
                                                                                                              // 95
        removedKeys.forEach(function (prop) {                                                                 // 96
          delete self[prop];                                                                                  // 97
          delete self._serverBackup[prop];                                                                    // 98
        });                                                                                                   // 99
      }                                                                                                       // 100
                                                                                                              // 101
      else {                                                                                                  // 102
        _.keys(this.getRawObject()).forEach(function(prop) {                                                  // 103
          delete self[prop];                                                                                  // 104
        });                                                                                                   // 105
                                                                                                              // 106
        self._serverBackup = {};                                                                              // 107
      }                                                                                                       // 108
    };                                                                                                        // 109
                                                                                                              // 110
    AngularMeteorObject.stop = function () {                                                                  // 111
      if (this.unregisterAutoDestroy)                                                                         // 112
        this.unregisterAutoDestroy();                                                                         // 113
                                                                                                              // 114
      if (this.unregisterAutoBind)                                                                            // 115
        this.unregisterAutoBind();                                                                            // 116
                                                                                                              // 117
      if (this.autorunComputation && this.autorunComputation.stop)                                            // 118
        this.autorunComputation.stop();                                                                       // 119
    };                                                                                                        // 120
                                                                                                              // 121
    return AngularMeteorObject;                                                                               // 122
}]);                                                                                                          // 123
                                                                                                              // 124
                                                                                                              // 125
angularMeteorObject.factory('$meteorObject', [                                                                // 126
  '$rootScope', '$meteorUtils', 'getUpdates', 'AngularMeteorObject',                                          // 127
  function($rootScope, $meteorUtils, getUpdates, AngularMeteorObject) {                                       // 128
    function $meteorObject(collection, id, auto, options) {                                                   // 129
      // Validate parameters                                                                                  // 130
      if (!collection) {                                                                                      // 131
        throw new TypeError("The first argument of $meteorObject is undefined.");                             // 132
      }                                                                                                       // 133
                                                                                                              // 134
      if (!angular.isFunction(collection.findOne)) {                                                          // 135
        throw new TypeError("The first argument of $meteorObject must be a function or a have a findOne function property.");
      }                                                                                                       // 137
                                                                                                              // 138
      var data = new AngularMeteorObject(collection, id, options);                                            // 139
      data._auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570  // 140
      angular.extend(data, $meteorObject);                                                                    // 141
      data._setAutos();                                                                                       // 142
      return data;                                                                                            // 143
    }                                                                                                         // 144
                                                                                                              // 145
    $meteorObject._setAutos = function() {                                                                    // 146
      var self = this;                                                                                        // 147
                                                                                                              // 148
      this.autorunComputation = $meteorUtils.autorun($rootScope, function() {                                 // 149
        self.reset(true);                                                                                     // 150
      });                                                                                                     // 151
                                                                                                              // 152
      // Deep watches the model and performs autobind                                                         // 153
      this.unregisterAutoBind = this._auto && $rootScope.$watch(function(){                                   // 154
        return self.getRawObject();                                                                           // 155
      }, function (item, oldItem) {                                                                           // 156
        if (item === oldItem) return;                                                                         // 157
                                                                                                              // 158
        var id = item._id;                                                                                    // 159
        delete item._id;                                                                                      // 160
        delete oldItem._id;                                                                                   // 161
                                                                                                              // 162
        var updates = getUpdates(oldItem, item);                                                              // 163
        if (_.isEmpty(updates)) return;                                                                       // 164
                                                                                                              // 165
        self.$$collection.update({_id: id}, updates);                                                         // 166
      }, true);                                                                                               // 167
                                                                                                              // 168
      this.unregisterAutoDestroy = $rootScope.$on('$destroy', function() {                                    // 169
        if (self && self.stop) {                                                                              // 170
          self.stop();                                                                                        // 171
        }                                                                                                     // 172
      });                                                                                                     // 173
    };                                                                                                        // 174
                                                                                                              // 175
    return $meteorObject;                                                                                     // 176
}]);                                                                                                          // 177
                                                                                                              // 178
angularMeteorObject.run([                                                                                     // 179
  '$rootScope', '$meteorObject', '$meteorStopper',                                                            // 180
  function ($rootScope, $meteorObject, $meteorStopper) {                                                      // 181
    var scopeProto = Object.getPrototypeOf($rootScope);                                                       // 182
    scopeProto.$meteorObject = $meteorStopper($meteorObject);                                                 // 183
}]);                                                                                                          // 184
                                                                                                              // 185
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

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
    this.loginWithMeteorDeveloperAccount = $meteorUtils.promissor(Meteor, 'loginWithMeteorDeveloperAccount'); // 68
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






(function () {

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






(function () {

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






(function () {

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






(function () {

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
    // Borrowed from angularFire - https://github.com/firebase/angularfire/blob/master/src/utils.js#L445-L454 // 27
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
        else                                                                                                  // 48
          deferred.resolve(boundResult == null ? result : boundResult);                                       // 49
      };                                                                                                      // 50
    };                                                                                                        // 51
    // creates a function which invokes method with the given arguments and returns a promise                 // 52
    this.promissor = function(obj, method) {                                                                  // 53
      return function() {                                                                                     // 54
        var deferred = $q.defer();                                                                            // 55
        var fulfill = self.fulfill(deferred);                                                                 // 56
        var args = _.toArray(arguments).concat(fulfill);                                                      // 57
        obj[method].apply(obj, args);                                                                         // 58
        return deferred.promise;                                                                              // 59
      };                                                                                                      // 60
    };                                                                                                        // 61
  }                                                                                                           // 62
]);                                                                                                           // 63
                                                                                                              // 64
angularMeteorUtils.run(['$rootScope', '$meteorUtils',                                                         // 65
  function($rootScope, $meteorUtils) {                                                                        // 66
    Object.getPrototypeOf($rootScope).$meteorAutorun = function(fn) {                                         // 67
      return $meteorUtils.autorun(this, fn);                                                                  // 68
    };                                                                                                        // 69
}]);                                                                                                          // 70
                                                                                                              // 71
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

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






(function () {

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
