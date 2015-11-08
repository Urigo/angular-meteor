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
var _ = Package.underscore._;
var Base64 = Package.base64.Base64;

/* Package-scope variables */
var EJSON, EJSONTest;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ejson/packages/ejson.js                                                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
(function(){                                                                                                         // 1
                                                                                                                     // 2
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ejson/ejson.js                                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * @namespace                                                                                                        // 2
 * @summary Namespace for EJSON functions                                                                            // 3
 */                                                                                                                  // 4
EJSON = {};                                                                                                          // 5
EJSONTest = {};                                                                                                      // 6
                                                                                                                     // 7
                                                                                                                     // 8
                                                                                                                     // 9
// Custom type interface definition                                                                                  // 10
/**                                                                                                                  // 11
 * @class CustomType                                                                                                 // 12
 * @instanceName customType                                                                                          // 13
 * @memberOf EJSON                                                                                                   // 14
 * @summary The interface that a class must satisfy to be able to become an                                          // 15
 * EJSON custom type via EJSON.addType.                                                                              // 16
 */                                                                                                                  // 17
                                                                                                                     // 18
/**                                                                                                                  // 19
 * @function typeName                                                                                                // 20
 * @memberOf EJSON.CustomType                                                                                        // 21
 * @summary Return the tag used to identify this type.  This must match the tag used to register this type with [`EJSON.addType`](#ejson_add_type).
 * @locus Anywhere                                                                                                   // 23
 * @instance                                                                                                         // 24
 */                                                                                                                  // 25
                                                                                                                     // 26
/**                                                                                                                  // 27
 * @function toJSONValue                                                                                             // 28
 * @memberOf EJSON.CustomType                                                                                        // 29
 * @summary Serialize this instance into a JSON-compatible value.                                                    // 30
 * @locus Anywhere                                                                                                   // 31
 * @instance                                                                                                         // 32
 */                                                                                                                  // 33
                                                                                                                     // 34
/**                                                                                                                  // 35
 * @function clone                                                                                                   // 36
 * @memberOf EJSON.CustomType                                                                                        // 37
 * @summary Return a value `r` such that `this.equals(r)` is true, and modifications to `r` do not affect `this` and vice versa.
 * @locus Anywhere                                                                                                   // 39
 * @instance                                                                                                         // 40
 */                                                                                                                  // 41
                                                                                                                     // 42
/**                                                                                                                  // 43
 * @function equals                                                                                                  // 44
 * @memberOf EJSON.CustomType                                                                                        // 45
 * @summary Return `true` if `other` has a value equal to `this`; `false` otherwise.                                 // 46
 * @locus Anywhere                                                                                                   // 47
 * @param {Object} other Another object to compare this to.                                                          // 48
 * @instance                                                                                                         // 49
 */                                                                                                                  // 50
                                                                                                                     // 51
                                                                                                                     // 52
var customTypes = {};                                                                                                // 53
// Add a custom type, using a method of your choice to get to and                                                    // 54
// from a basic JSON-able representation.  The factory argument                                                      // 55
// is a function of JSON-able --> your object                                                                        // 56
// The type you add must have:                                                                                       // 57
// - A toJSONValue() method, so that Meteor can serialize it                                                         // 58
// - a typeName() method, to show how to look it up in our type table.                                               // 59
// It is okay if these methods are monkey-patched on.                                                                // 60
// EJSON.clone will use toJSONValue and the given factory to produce                                                 // 61
// a clone, but you may specify a method clone() that will be                                                        // 62
// used instead.                                                                                                     // 63
// Similarly, EJSON.equals will use toJSONValue to make comparisons,                                                 // 64
// but you may provide a method equals() instead.                                                                    // 65
/**                                                                                                                  // 66
 * @summary Add a custom datatype to EJSON.                                                                          // 67
 * @locus Anywhere                                                                                                   // 68
 * @param {String} name A tag for your custom type; must be unique among custom data types defined in your project, and must match the result of your type's `typeName` method.
 * @param {Function} factory A function that deserializes a JSON-compatible value into an instance of your type.  This should match the serialization performed by your type's `toJSONValue` method.
 */                                                                                                                  // 71
EJSON.addType = function (name, factory) {                                                                           // 72
  if (_.has(customTypes, name))                                                                                      // 73
    throw new Error("Type " + name + " already present");                                                            // 74
  customTypes[name] = factory;                                                                                       // 75
};                                                                                                                   // 76
                                                                                                                     // 77
var isInfOrNan = function (obj) {                                                                                    // 78
  return _.isNaN(obj) || obj === Infinity || obj === -Infinity;                                                      // 79
};                                                                                                                   // 80
                                                                                                                     // 81
var builtinConverters = [                                                                                            // 82
  { // Date                                                                                                          // 83
    matchJSONValue: function (obj) {                                                                                 // 84
      return _.has(obj, '$date') && _.size(obj) === 1;                                                               // 85
    },                                                                                                               // 86
    matchObject: function (obj) {                                                                                    // 87
      return obj instanceof Date;                                                                                    // 88
    },                                                                                                               // 89
    toJSONValue: function (obj) {                                                                                    // 90
      return {$date: obj.getTime()};                                                                                 // 91
    },                                                                                                               // 92
    fromJSONValue: function (obj) {                                                                                  // 93
      return new Date(obj.$date);                                                                                    // 94
    }                                                                                                                // 95
  },                                                                                                                 // 96
  { // NaN, Inf, -Inf. (These are the only objects with typeof !== 'object'                                          // 97
    // which we match.)                                                                                              // 98
    matchJSONValue: function (obj) {                                                                                 // 99
      return _.has(obj, '$InfNaN') && _.size(obj) === 1;                                                             // 100
    },                                                                                                               // 101
    matchObject: isInfOrNan,                                                                                         // 102
    toJSONValue: function (obj) {                                                                                    // 103
      var sign;                                                                                                      // 104
      if (_.isNaN(obj))                                                                                              // 105
        sign = 0;                                                                                                    // 106
      else if (obj === Infinity)                                                                                     // 107
        sign = 1;                                                                                                    // 108
      else                                                                                                           // 109
        sign = -1;                                                                                                   // 110
      return {$InfNaN: sign};                                                                                        // 111
    },                                                                                                               // 112
    fromJSONValue: function (obj) {                                                                                  // 113
      return obj.$InfNaN/0;                                                                                          // 114
    }                                                                                                                // 115
  },                                                                                                                 // 116
  { // Binary                                                                                                        // 117
    matchJSONValue: function (obj) {                                                                                 // 118
      return _.has(obj, '$binary') && _.size(obj) === 1;                                                             // 119
    },                                                                                                               // 120
    matchObject: function (obj) {                                                                                    // 121
      return typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array                                          // 122
        || (obj && _.has(obj, '$Uint8ArrayPolyfill'));                                                               // 123
    },                                                                                                               // 124
    toJSONValue: function (obj) {                                                                                    // 125
      return {$binary: Base64.encode(obj)};                                                                          // 126
    },                                                                                                               // 127
    fromJSONValue: function (obj) {                                                                                  // 128
      return Base64.decode(obj.$binary);                                                                             // 129
    }                                                                                                                // 130
  },                                                                                                                 // 131
  { // Escaping one level                                                                                            // 132
    matchJSONValue: function (obj) {                                                                                 // 133
      return _.has(obj, '$escape') && _.size(obj) === 1;                                                             // 134
    },                                                                                                               // 135
    matchObject: function (obj) {                                                                                    // 136
      if (_.isEmpty(obj) || _.size(obj) > 2) {                                                                       // 137
        return false;                                                                                                // 138
      }                                                                                                              // 139
      return _.any(builtinConverters, function (converter) {                                                         // 140
        return converter.matchJSONValue(obj);                                                                        // 141
      });                                                                                                            // 142
    },                                                                                                               // 143
    toJSONValue: function (obj) {                                                                                    // 144
      var newObj = {};                                                                                               // 145
      _.each(obj, function (value, key) {                                                                            // 146
        newObj[key] = EJSON.toJSONValue(value);                                                                      // 147
      });                                                                                                            // 148
      return {$escape: newObj};                                                                                      // 149
    },                                                                                                               // 150
    fromJSONValue: function (obj) {                                                                                  // 151
      var newObj = {};                                                                                               // 152
      _.each(obj.$escape, function (value, key) {                                                                    // 153
        newObj[key] = EJSON.fromJSONValue(value);                                                                    // 154
      });                                                                                                            // 155
      return newObj;                                                                                                 // 156
    }                                                                                                                // 157
  },                                                                                                                 // 158
  { // Custom                                                                                                        // 159
    matchJSONValue: function (obj) {                                                                                 // 160
      return _.has(obj, '$type') && _.has(obj, '$value') && _.size(obj) === 2;                                       // 161
    },                                                                                                               // 162
    matchObject: function (obj) {                                                                                    // 163
      return EJSON._isCustomType(obj);                                                                               // 164
    },                                                                                                               // 165
    toJSONValue: function (obj) {                                                                                    // 166
      var jsonValue = Meteor._noYieldsAllowed(function () {                                                          // 167
        return obj.toJSONValue();                                                                                    // 168
      });                                                                                                            // 169
      return {$type: obj.typeName(), $value: jsonValue};                                                             // 170
    },                                                                                                               // 171
    fromJSONValue: function (obj) {                                                                                  // 172
      var typeName = obj.$type;                                                                                      // 173
      if (!_.has(customTypes, typeName))                                                                             // 174
        throw new Error("Custom EJSON type " + typeName + " is not defined");                                        // 175
      var converter = customTypes[typeName];                                                                         // 176
      return Meteor._noYieldsAllowed(function () {                                                                   // 177
        return converter(obj.$value);                                                                                // 178
      });                                                                                                            // 179
    }                                                                                                                // 180
  }                                                                                                                  // 181
];                                                                                                                   // 182
                                                                                                                     // 183
EJSON._isCustomType = function (obj) {                                                                               // 184
  return obj &&                                                                                                      // 185
    typeof obj.toJSONValue === 'function' &&                                                                         // 186
    typeof obj.typeName === 'function' &&                                                                            // 187
    _.has(customTypes, obj.typeName());                                                                              // 188
};                                                                                                                   // 189
                                                                                                                     // 190
EJSON._getTypes = function () {                                                                                      // 191
  return customTypes;                                                                                                // 192
};                                                                                                                   // 193
                                                                                                                     // 194
EJSON._getConverters = function () {                                                                                 // 195
  return builtinConverters;                                                                                          // 196
};                                                                                                                   // 197
                                                                                                                     // 198
// for both arrays and objects, in-place modification.                                                               // 199
var adjustTypesToJSONValue =                                                                                         // 200
EJSON._adjustTypesToJSONValue = function (obj) {                                                                     // 201
  // Is it an atom that we need to adjust?                                                                           // 202
  if (obj === null)                                                                                                  // 203
    return null;                                                                                                     // 204
  var maybeChanged = toJSONValueHelper(obj);                                                                         // 205
  if (maybeChanged !== undefined)                                                                                    // 206
    return maybeChanged;                                                                                             // 207
                                                                                                                     // 208
  // Other atoms are unchanged.                                                                                      // 209
  if (typeof obj !== 'object')                                                                                       // 210
    return obj;                                                                                                      // 211
                                                                                                                     // 212
  // Iterate over array or object structure.                                                                         // 213
  _.each(obj, function (value, key) {                                                                                // 214
    if (typeof value !== 'object' && value !== undefined &&                                                          // 215
        !isInfOrNan(value))                                                                                          // 216
      return; // continue                                                                                            // 217
                                                                                                                     // 218
    var changed = toJSONValueHelper(value);                                                                          // 219
    if (changed) {                                                                                                   // 220
      obj[key] = changed;                                                                                            // 221
      return; // on to the next key                                                                                  // 222
    }                                                                                                                // 223
    // if we get here, value is an object but not adjustable                                                         // 224
    // at this level.  recurse.                                                                                      // 225
    adjustTypesToJSONValue(value);                                                                                   // 226
  });                                                                                                                // 227
  return obj;                                                                                                        // 228
};                                                                                                                   // 229
                                                                                                                     // 230
// Either return the JSON-compatible version of the argument, or undefined (if                                       // 231
// the item isn't itself replaceable, but maybe some fields in it are)                                               // 232
var toJSONValueHelper = function (item) {                                                                            // 233
  for (var i = 0; i < builtinConverters.length; i++) {                                                               // 234
    var converter = builtinConverters[i];                                                                            // 235
    if (converter.matchObject(item)) {                                                                               // 236
      return converter.toJSONValue(item);                                                                            // 237
    }                                                                                                                // 238
  }                                                                                                                  // 239
  return undefined;                                                                                                  // 240
};                                                                                                                   // 241
                                                                                                                     // 242
/**                                                                                                                  // 243
 * @summary Serialize an EJSON-compatible value into its plain JSON representation.                                  // 244
 * @locus Anywhere                                                                                                   // 245
 * @param {EJSON} val A value to serialize to plain JSON.                                                            // 246
 */                                                                                                                  // 247
EJSON.toJSONValue = function (item) {                                                                                // 248
  var changed = toJSONValueHelper(item);                                                                             // 249
  if (changed !== undefined)                                                                                         // 250
    return changed;                                                                                                  // 251
  if (typeof item === 'object') {                                                                                    // 252
    item = EJSON.clone(item);                                                                                        // 253
    adjustTypesToJSONValue(item);                                                                                    // 254
  }                                                                                                                  // 255
  return item;                                                                                                       // 256
};                                                                                                                   // 257
                                                                                                                     // 258
// for both arrays and objects. Tries its best to just                                                               // 259
// use the object you hand it, but may return something                                                              // 260
// different if the object you hand it itself needs changing.                                                        // 261
//                                                                                                                   // 262
var adjustTypesFromJSONValue =                                                                                       // 263
EJSON._adjustTypesFromJSONValue = function (obj) {                                                                   // 264
  if (obj === null)                                                                                                  // 265
    return null;                                                                                                     // 266
  var maybeChanged = fromJSONValueHelper(obj);                                                                       // 267
  if (maybeChanged !== obj)                                                                                          // 268
    return maybeChanged;                                                                                             // 269
                                                                                                                     // 270
  // Other atoms are unchanged.                                                                                      // 271
  if (typeof obj !== 'object')                                                                                       // 272
    return obj;                                                                                                      // 273
                                                                                                                     // 274
  _.each(obj, function (value, key) {                                                                                // 275
    if (typeof value === 'object') {                                                                                 // 276
      var changed = fromJSONValueHelper(value);                                                                      // 277
      if (value !== changed) {                                                                                       // 278
        obj[key] = changed;                                                                                          // 279
        return;                                                                                                      // 280
      }                                                                                                              // 281
      // if we get here, value is an object but not adjustable                                                       // 282
      // at this level.  recurse.                                                                                    // 283
      adjustTypesFromJSONValue(value);                                                                               // 284
    }                                                                                                                // 285
  });                                                                                                                // 286
  return obj;                                                                                                        // 287
};                                                                                                                   // 288
                                                                                                                     // 289
// Either return the argument changed to have the non-json                                                           // 290
// rep of itself (the Object version) or the argument itself.                                                        // 291
                                                                                                                     // 292
// DOES NOT RECURSE.  For actually getting the fully-changed value, use                                              // 293
// EJSON.fromJSONValue                                                                                               // 294
var fromJSONValueHelper = function (value) {                                                                         // 295
  if (typeof value === 'object' && value !== null) {                                                                 // 296
    if (_.size(value) <= 2                                                                                           // 297
        && _.all(value, function (v, k) {                                                                            // 298
          return typeof k === 'string' && k.substr(0, 1) === '$';                                                    // 299
        })) {                                                                                                        // 300
      for (var i = 0; i < builtinConverters.length; i++) {                                                           // 301
        var converter = builtinConverters[i];                                                                        // 302
        if (converter.matchJSONValue(value)) {                                                                       // 303
          return converter.fromJSONValue(value);                                                                     // 304
        }                                                                                                            // 305
      }                                                                                                              // 306
    }                                                                                                                // 307
  }                                                                                                                  // 308
  return value;                                                                                                      // 309
};                                                                                                                   // 310
                                                                                                                     // 311
/**                                                                                                                  // 312
 * @summary Deserialize an EJSON value from its plain JSON representation.                                           // 313
 * @locus Anywhere                                                                                                   // 314
 * @param {JSONCompatible} val A value to deserialize into EJSON.                                                    // 315
 */                                                                                                                  // 316
EJSON.fromJSONValue = function (item) {                                                                              // 317
  var changed = fromJSONValueHelper(item);                                                                           // 318
  if (changed === item && typeof item === 'object') {                                                                // 319
    item = EJSON.clone(item);                                                                                        // 320
    adjustTypesFromJSONValue(item);                                                                                  // 321
    return item;                                                                                                     // 322
  } else {                                                                                                           // 323
    return changed;                                                                                                  // 324
  }                                                                                                                  // 325
};                                                                                                                   // 326
                                                                                                                     // 327
/**                                                                                                                  // 328
 * @summary Serialize a value to a string.                                                                           // 329
                                                                                                                     // 330
For EJSON values, the serialization fully represents the value. For non-EJSON values, serializes the same way as `JSON.stringify`.
 * @locus Anywhere                                                                                                   // 332
 * @param {EJSON} val A value to stringify.                                                                          // 333
 * @param {Object} [options]                                                                                         // 334
 * @param {Boolean | Integer | String} options.indent Indents objects and arrays for easy readability.  When `true`, indents by 2 spaces; when an integer, indents by that number of spaces; and when a string, uses the string as the indentation pattern.
 * @param {Boolean} options.canonical When `true`, stringifies keys in an object in sorted order.                    // 336
 */                                                                                                                  // 337
EJSON.stringify = function (item, options) {                                                                         // 338
  var json = EJSON.toJSONValue(item);                                                                                // 339
  if (options && (options.canonical || options.indent)) {                                                            // 340
    return EJSON._canonicalStringify(json, options);                                                                 // 341
  } else {                                                                                                           // 342
    return JSON.stringify(json);                                                                                     // 343
  }                                                                                                                  // 344
};                                                                                                                   // 345
                                                                                                                     // 346
/**                                                                                                                  // 347
 * @summary Parse a string into an EJSON value. Throws an error if the string is not valid EJSON.                    // 348
 * @locus Anywhere                                                                                                   // 349
 * @param {String} str A string to parse into an EJSON value.                                                        // 350
 */                                                                                                                  // 351
EJSON.parse = function (item) {                                                                                      // 352
  if (typeof item !== 'string')                                                                                      // 353
    throw new Error("EJSON.parse argument should be a string");                                                      // 354
  return EJSON.fromJSONValue(JSON.parse(item));                                                                      // 355
};                                                                                                                   // 356
                                                                                                                     // 357
/**                                                                                                                  // 358
 * @summary Returns true if `x` is a buffer of binary data, as returned from [`EJSON.newBinary`](#ejson_new_binary).
 * @param {Object} x The variable to check.                                                                          // 360
 * @locus Anywhere                                                                                                   // 361
 */                                                                                                                  // 362
EJSON.isBinary = function (obj) {                                                                                    // 363
  return !!((typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array) ||                                      // 364
    (obj && obj.$Uint8ArrayPolyfill));                                                                               // 365
};                                                                                                                   // 366
                                                                                                                     // 367
/**                                                                                                                  // 368
 * @summary Return true if `a` and `b` are equal to each other.  Return false otherwise.  Uses the `equals` method on `a` if present, otherwise performs a deep comparison.
 * @locus Anywhere                                                                                                   // 370
 * @param {EJSON} a                                                                                                  // 371
 * @param {EJSON} b                                                                                                  // 372
 * @param {Object} [options]                                                                                         // 373
 * @param {Boolean} options.keyOrderSensitive Compare in key sensitive order, if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}` is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.  The default is `false`.
 */                                                                                                                  // 375
EJSON.equals = function (a, b, options) {                                                                            // 376
  var i;                                                                                                             // 377
  var keyOrderSensitive = !!(options && options.keyOrderSensitive);                                                  // 378
  if (a === b)                                                                                                       // 379
    return true;                                                                                                     // 380
  if (_.isNaN(a) && _.isNaN(b))                                                                                      // 381
    return true; // This differs from the IEEE spec for NaN equality, b/c we don't want                              // 382
                 // anything ever with a NaN to be poisoned from becoming equal to anything.                         // 383
  if (!a || !b) // if either one is falsy, they'd have to be === to be equal                                         // 384
    return false;                                                                                                    // 385
  if (!(typeof a === 'object' && typeof b === 'object'))                                                             // 386
    return false;                                                                                                    // 387
  if (a instanceof Date && b instanceof Date)                                                                        // 388
    return a.valueOf() === b.valueOf();                                                                              // 389
  if (EJSON.isBinary(a) && EJSON.isBinary(b)) {                                                                      // 390
    if (a.length !== b.length)                                                                                       // 391
      return false;                                                                                                  // 392
    for (i = 0; i < a.length; i++) {                                                                                 // 393
      if (a[i] !== b[i])                                                                                             // 394
        return false;                                                                                                // 395
    }                                                                                                                // 396
    return true;                                                                                                     // 397
  }                                                                                                                  // 398
  if (typeof (a.equals) === 'function')                                                                              // 399
    return a.equals(b, options);                                                                                     // 400
  if (typeof (b.equals) === 'function')                                                                              // 401
    return b.equals(a, options);                                                                                     // 402
  if (a instanceof Array) {                                                                                          // 403
    if (!(b instanceof Array))                                                                                       // 404
      return false;                                                                                                  // 405
    if (a.length !== b.length)                                                                                       // 406
      return false;                                                                                                  // 407
    for (i = 0; i < a.length; i++) {                                                                                 // 408
      if (!EJSON.equals(a[i], b[i], options))                                                                        // 409
        return false;                                                                                                // 410
    }                                                                                                                // 411
    return true;                                                                                                     // 412
  }                                                                                                                  // 413
  // fallback for custom types that don't implement their own equals                                                 // 414
  switch (EJSON._isCustomType(a) + EJSON._isCustomType(b)) {                                                         // 415
    case 1: return false;                                                                                            // 416
    case 2: return EJSON.equals(EJSON.toJSONValue(a), EJSON.toJSONValue(b));                                         // 417
  }                                                                                                                  // 418
  // fall back to structural equality of objects                                                                     // 419
  var ret;                                                                                                           // 420
  if (keyOrderSensitive) {                                                                                           // 421
    var bKeys = [];                                                                                                  // 422
    _.each(b, function (val, x) {                                                                                    // 423
        bKeys.push(x);                                                                                               // 424
    });                                                                                                              // 425
    i = 0;                                                                                                           // 426
    ret = _.all(a, function (val, x) {                                                                               // 427
      if (i >= bKeys.length) {                                                                                       // 428
        return false;                                                                                                // 429
      }                                                                                                              // 430
      if (x !== bKeys[i]) {                                                                                          // 431
        return false;                                                                                                // 432
      }                                                                                                              // 433
      if (!EJSON.equals(val, b[bKeys[i]], options)) {                                                                // 434
        return false;                                                                                                // 435
      }                                                                                                              // 436
      i++;                                                                                                           // 437
      return true;                                                                                                   // 438
    });                                                                                                              // 439
    return ret && i === bKeys.length;                                                                                // 440
  } else {                                                                                                           // 441
    i = 0;                                                                                                           // 442
    ret = _.all(a, function (val, key) {                                                                             // 443
      if (!_.has(b, key)) {                                                                                          // 444
        return false;                                                                                                // 445
      }                                                                                                              // 446
      if (!EJSON.equals(val, b[key], options)) {                                                                     // 447
        return false;                                                                                                // 448
      }                                                                                                              // 449
      i++;                                                                                                           // 450
      return true;                                                                                                   // 451
    });                                                                                                              // 452
    return ret && _.size(b) === i;                                                                                   // 453
  }                                                                                                                  // 454
};                                                                                                                   // 455
                                                                                                                     // 456
/**                                                                                                                  // 457
 * @summary Return a deep copy of `val`.                                                                             // 458
 * @locus Anywhere                                                                                                   // 459
 * @param {EJSON} val A value to copy.                                                                               // 460
 */                                                                                                                  // 461
EJSON.clone = function (v) {                                                                                         // 462
  var ret;                                                                                                           // 463
  if (typeof v !== "object")                                                                                         // 464
    return v;                                                                                                        // 465
  if (v === null)                                                                                                    // 466
    return null; // null has typeof "object"                                                                         // 467
  if (v instanceof Date)                                                                                             // 468
    return new Date(v.getTime());                                                                                    // 469
  // RegExps are not really EJSON elements (eg we don't define a serialization                                       // 470
  // for them), but they're immutable anyway, so we can support them in clone.                                       // 471
  if (v instanceof RegExp)                                                                                           // 472
    return v;                                                                                                        // 473
  if (EJSON.isBinary(v)) {                                                                                           // 474
    ret = EJSON.newBinary(v.length);                                                                                 // 475
    for (var i = 0; i < v.length; i++) {                                                                             // 476
      ret[i] = v[i];                                                                                                 // 477
    }                                                                                                                // 478
    return ret;                                                                                                      // 479
  }                                                                                                                  // 480
  // XXX: Use something better than underscore's isArray                                                             // 481
  if (_.isArray(v) || _.isArguments(v)) {                                                                            // 482
    // For some reason, _.map doesn't work in this context on Opera (weird test                                      // 483
    // failures).                                                                                                    // 484
    ret = [];                                                                                                        // 485
    for (i = 0; i < v.length; i++)                                                                                   // 486
      ret[i] = EJSON.clone(v[i]);                                                                                    // 487
    return ret;                                                                                                      // 488
  }                                                                                                                  // 489
  // handle general user-defined typed Objects if they have a clone method                                           // 490
  if (typeof v.clone === 'function') {                                                                               // 491
    return v.clone();                                                                                                // 492
  }                                                                                                                  // 493
  // handle other custom types                                                                                       // 494
  if (EJSON._isCustomType(v)) {                                                                                      // 495
    return EJSON.fromJSONValue(EJSON.clone(EJSON.toJSONValue(v)), true);                                             // 496
  }                                                                                                                  // 497
  // handle other objects                                                                                            // 498
  ret = {};                                                                                                          // 499
  _.each(v, function (value, key) {                                                                                  // 500
    ret[key] = EJSON.clone(value);                                                                                   // 501
  });                                                                                                                // 502
  return ret;                                                                                                        // 503
};                                                                                                                   // 504
                                                                                                                     // 505
/**                                                                                                                  // 506
 * @summary Allocate a new buffer of binary data that EJSON can serialize.                                           // 507
 * @locus Anywhere                                                                                                   // 508
 * @param {Number} size The number of bytes of binary data to allocate.                                              // 509
 */                                                                                                                  // 510
// EJSON.newBinary is the public documented API for this functionality,                                              // 511
// but the implementation is in the 'base64' package to avoid                                                        // 512
// introducing a circular dependency. (If the implementation were here,                                              // 513
// then 'base64' would have to use EJSON.newBinary, and 'ejson' would                                                // 514
// also have to use 'base64'.)                                                                                       // 515
EJSON.newBinary = Base64.newBinary;                                                                                  // 516
                                                                                                                     // 517
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     // 527
}).call(this);                                                                                                       // 528
                                                                                                                     // 529
                                                                                                                     // 530
                                                                                                                     // 531
                                                                                                                     // 532
                                                                                                                     // 533
                                                                                                                     // 534
(function(){                                                                                                         // 535
                                                                                                                     // 536
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ejson/stringify.js                                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Based on json2.js from https://github.com/douglascrockford/JSON-js                                                // 1
//                                                                                                                   // 2
//    json2.js                                                                                                       // 3
//    2012-10-08                                                                                                     // 4
//                                                                                                                   // 5
//    Public Domain.                                                                                                 // 6
//                                                                                                                   // 7
//    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.                                                        // 8
                                                                                                                     // 9
function quote(string) {                                                                                             // 10
  return JSON.stringify(string);                                                                                     // 11
}                                                                                                                    // 12
                                                                                                                     // 13
var str = function (key, holder, singleIndent, outerIndent, canonical) {                                             // 14
                                                                                                                     // 15
  // Produce a string from holder[key].                                                                              // 16
                                                                                                                     // 17
  var i;          // The loop counter.                                                                               // 18
  var k;          // The member key.                                                                                 // 19
  var v;          // The member value.                                                                               // 20
  var length;                                                                                                        // 21
  var innerIndent = outerIndent;                                                                                     // 22
  var partial;                                                                                                       // 23
  var value = holder[key];                                                                                           // 24
                                                                                                                     // 25
  // What happens next depends on the value's type.                                                                  // 26
                                                                                                                     // 27
  switch (typeof value) {                                                                                            // 28
  case 'string':                                                                                                     // 29
    return quote(value);                                                                                             // 30
  case 'number':                                                                                                     // 31
    // JSON numbers must be finite. Encode non-finite numbers as null.                                               // 32
    return isFinite(value) ? String(value) : 'null';                                                                 // 33
  case 'boolean':                                                                                                    // 34
    return String(value);                                                                                            // 35
  // If the type is 'object', we might be dealing with an object or an array or                                      // 36
  // null.                                                                                                           // 37
  case 'object':                                                                                                     // 38
    // Due to a specification blunder in ECMAScript, typeof null is 'object',                                        // 39
    // so watch out for that case.                                                                                   // 40
    if (!value) {                                                                                                    // 41
      return 'null';                                                                                                 // 42
    }                                                                                                                // 43
    // Make an array to hold the partial results of stringifying this object value.                                  // 44
    innerIndent = outerIndent + singleIndent;                                                                        // 45
    partial = [];                                                                                                    // 46
                                                                                                                     // 47
    // Is the value an array?                                                                                        // 48
    if (_.isArray(value) || _.isArguments(value)) {                                                                  // 49
                                                                                                                     // 50
      // The value is an array. Stringify every element. Use null as a placeholder                                   // 51
      // for non-JSON values.                                                                                        // 52
                                                                                                                     // 53
      length = value.length;                                                                                         // 54
      for (i = 0; i < length; i += 1) {                                                                              // 55
        partial[i] = str(i, value, singleIndent, innerIndent, canonical) || 'null';                                  // 56
      }                                                                                                              // 57
                                                                                                                     // 58
      // Join all of the elements together, separated with commas, and wrap them in                                  // 59
      // brackets.                                                                                                   // 60
                                                                                                                     // 61
      if (partial.length === 0) {                                                                                    // 62
        v = '[]';                                                                                                    // 63
      } else if (innerIndent) {                                                                                      // 64
        v = '[\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + ']';                      // 65
      } else {                                                                                                       // 66
        v = '[' + partial.join(',') + ']';                                                                           // 67
      }                                                                                                              // 68
      return v;                                                                                                      // 69
    }                                                                                                                // 70
                                                                                                                     // 71
                                                                                                                     // 72
    // Iterate through all of the keys in the object.                                                                // 73
    var keys = _.keys(value);                                                                                        // 74
    if (canonical)                                                                                                   // 75
      keys = keys.sort();                                                                                            // 76
    _.each(keys, function (k) {                                                                                      // 77
      v = str(k, value, singleIndent, innerIndent, canonical);                                                       // 78
      if (v) {                                                                                                       // 79
        partial.push(quote(k) + (innerIndent ? ': ' : ':') + v);                                                     // 80
      }                                                                                                              // 81
    });                                                                                                              // 82
                                                                                                                     // 83
                                                                                                                     // 84
    // Join all of the member texts together, separated with commas,                                                 // 85
    // and wrap them in braces.                                                                                      // 86
                                                                                                                     // 87
    if (partial.length === 0) {                                                                                      // 88
      v = '{}';                                                                                                      // 89
    } else if (innerIndent) {                                                                                        // 90
      v = '{\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + '}';                        // 91
    } else {                                                                                                         // 92
      v = '{' + partial.join(',') + '}';                                                                             // 93
    }                                                                                                                // 94
    return v;                                                                                                        // 95
  }                                                                                                                  // 96
}                                                                                                                    // 97
                                                                                                                     // 98
// If the JSON object does not yet have a stringify method, give it one.                                             // 99
                                                                                                                     // 100
EJSON._canonicalStringify = function (value, options) {                                                              // 101
  // Make a fake root object containing our value under the key of ''.                                               // 102
  // Return the result of stringifying the value.                                                                    // 103
  options = _.extend({                                                                                               // 104
    indent: "",                                                                                                      // 105
    canonical: false                                                                                                 // 106
  }, options);                                                                                                       // 107
  if (options.indent === true) {                                                                                     // 108
    options.indent = "  ";                                                                                           // 109
  } else if (typeof options.indent === 'number') {                                                                   // 110
    var newIndent = "";                                                                                              // 111
    for (var i = 0; i < options.indent; i++) {                                                                       // 112
      newIndent += ' ';                                                                                              // 113
    }                                                                                                                // 114
    options.indent = newIndent;                                                                                      // 115
  }                                                                                                                  // 116
  return str('', {'': value}, options.indent, "", options.canonical);                                                // 117
};                                                                                                                   // 118
                                                                                                                     // 119
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     // 663
}).call(this);                                                                                                       // 664
                                                                                                                     // 665
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.ejson = {
  EJSON: EJSON,
  EJSONTest: EJSONTest
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
var EJSON = Package.ejson.EJSON;
var IdMap = Package['id-map'].IdMap;
var Random = Package.random.Random;

/* Package-scope variables */
var MongoID;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/mongo-id/packages/mongo-id.js                                                                   //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
(function(){                                                                                                // 1
                                                                                                            // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                                                    //    // 4
// packages/mongo-id/id.js                                                                            //    // 5
//                                                                                                    //    // 6
////////////////////////////////////////////////////////////////////////////////////////////////////////    // 7
                                                                                                      //    // 8
MongoID = {};                                                                                         // 1  // 9
                                                                                                      // 2  // 10
MongoID._looksLikeObjectID = function (str) {                                                         // 3  // 11
  return str.length === 24 && str.match(/^[0-9a-f]*$/);                                               // 4  // 12
};                                                                                                    // 5  // 13
                                                                                                      // 6  // 14
MongoID.ObjectID = function (hexString) {                                                             // 7  // 15
  //random-based impl of Mongo ObjectID                                                               // 8  // 16
  var self = this;                                                                                    // 9  // 17
  if (hexString) {                                                                                    // 10
    hexString = hexString.toLowerCase();                                                              // 11
    if (!MongoID._looksLikeObjectID(hexString)) {                                                     // 12
      throw new Error("Invalid hexadecimal string for creating an ObjectID");                         // 13
    }                                                                                                 // 14
    // meant to work with _.isEqual(), which relies on structural equality                            // 15
    self._str = hexString;                                                                            // 16
  } else {                                                                                            // 17
    self._str = Random.hexString(24);                                                                 // 18
  }                                                                                                   // 19
};                                                                                                    // 20
                                                                                                      // 21
MongoID.ObjectID.prototype.toString = function () {                                                   // 22
  var self = this;                                                                                    // 23
  return "ObjectID(\"" + self._str + "\")";                                                           // 24
};                                                                                                    // 25
                                                                                                      // 26
MongoID.ObjectID.prototype.equals = function (other) {                                                // 27
  var self = this;                                                                                    // 28
  return other instanceof MongoID.ObjectID &&                                                         // 29
    self.valueOf() === other.valueOf();                                                               // 30
};                                                                                                    // 31
                                                                                                      // 32
MongoID.ObjectID.prototype.clone = function () {                                                      // 33
  var self = this;                                                                                    // 34
  return new MongoID.ObjectID(self._str);                                                             // 35
};                                                                                                    // 36
                                                                                                      // 37
MongoID.ObjectID.prototype.typeName = function() {                                                    // 38
  return "oid";                                                                                       // 39
};                                                                                                    // 40
                                                                                                      // 41
MongoID.ObjectID.prototype.getTimestamp = function() {                                                // 42
  var self = this;                                                                                    // 43
  return parseInt(self._str.substr(0, 8), 16);                                                        // 44
};                                                                                                    // 45
                                                                                                      // 46
MongoID.ObjectID.prototype.valueOf =                                                                  // 47
    MongoID.ObjectID.prototype.toJSONValue =                                                          // 48
    MongoID.ObjectID.prototype.toHexString =                                                          // 49
    function () { return this._str; };                                                                // 50
                                                                                                      // 51
EJSON.addType("oid",  function (str) {                                                                // 52
  return new MongoID.ObjectID(str);                                                                   // 53
});                                                                                                   // 54
                                                                                                      // 55
MongoID.idStringify = function (id) {                                                                 // 56
  if (id instanceof MongoID.ObjectID) {                                                               // 57
    return id.valueOf();                                                                              // 58
  } else if (typeof id === 'string') {                                                                // 59
    if (id === "") {                                                                                  // 60
      return id;                                                                                      // 61
    } else if (id.substr(0, 1) === "-" || // escape previously dashed strings                         // 62
               id.substr(0, 1) === "~" || // escape escaped numbers, true, false                      // 63
               MongoID._looksLikeObjectID(id) || // escape object-id-form strings                     // 64
               id.substr(0, 1) === '{') { // escape object-form strings, for maybe implementing later       // 73
      return "-" + id;                                                                                // 66
    } else {                                                                                          // 67
      return id; // other strings go through unchanged.                                               // 68
    }                                                                                                 // 69
  } else if (id === undefined) {                                                                      // 70
    return '-';                                                                                       // 71
  } else if (typeof id === 'object' && id !== null) {                                                 // 72
    throw new Error("Meteor does not currently support objects other than ObjectID as ids");          // 73
  } else { // Numbers, true, false, null                                                              // 74
    return "~" + JSON.stringify(id);                                                                  // 75
  }                                                                                                   // 76
};                                                                                                    // 77
                                                                                                      // 78
                                                                                                      // 79
MongoID.idParse = function (id) {                                                                     // 80
  if (id === "") {                                                                                    // 81
    return id;                                                                                        // 82
  } else if (id === '-') {                                                                            // 83
    return undefined;                                                                                 // 84
  } else if (id.substr(0, 1) === '-') {                                                               // 85
    return id.substr(1);                                                                              // 86
  } else if (id.substr(0, 1) === '~') {                                                               // 87
    return JSON.parse(id.substr(1));                                                                  // 88
  } else if (MongoID._looksLikeObjectID(id)) {                                                        // 89
    return new MongoID.ObjectID(id);                                                                  // 90
  } else {                                                                                            // 91
    return id;                                                                                        // 92
  }                                                                                                   // 93
};                                                                                                    // 94
                                                                                                      // 95
                                                                                                      // 96
////////////////////////////////////////////////////////////////////////////////////////////////////////    // 105
                                                                                                            // 106
}).call(this);                                                                                              // 107
                                                                                                            // 108
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mongo-id'] = {
  MongoID: MongoID
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
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var DiffSequence;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/diff-sequence/packages/diff-sequence.js                                       //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
(function(){                                                                              // 1
                                                                                          // 2
/////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                 //     // 4
// packages/diff-sequence/diff.js                                                  //     // 5
//                                                                                 //     // 6
/////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                   //     // 8
DiffSequence = {};                                                                 // 1   // 9
                                                                                   // 2   // 10
// ordered: bool.                                                                  // 3   // 11
// old_results and new_results: collections of documents.                          // 4   // 12
//    if ordered, they are arrays.                                                 // 5   // 13
//    if unordered, they are IdMaps                                                // 6   // 14
DiffSequence.diffQueryChanges = function (ordered, oldResults, newResults,         // 7   // 15
                                              observer, options) {                 // 8   // 16
  if (ordered)                                                                     // 9   // 17
    DiffSequence.diffQueryOrderedChanges(                                          // 10  // 18
      oldResults, newResults, observer, options);                                  // 11  // 19
  else                                                                             // 12  // 20
    DiffSequence.diffQueryUnorderedChanges(                                        // 13  // 21
      oldResults, newResults, observer, options);                                  // 14  // 22
};                                                                                 // 15  // 23
                                                                                   // 16  // 24
DiffSequence.diffQueryUnorderedChanges = function (oldResults, newResults,         // 17  // 25
                                                       observer, options) {        // 18  // 26
  options = options || {};                                                         // 19  // 27
  var projectionFn = options.projectionFn || EJSON.clone;                          // 20  // 28
                                                                                   // 21  // 29
  if (observer.movedBefore) {                                                      // 22  // 30
    throw new Error("_diffQueryUnordered called with a movedBefore observer!");    // 23  // 31
  }                                                                                // 24  // 32
                                                                                   // 25  // 33
  newResults.forEach(function (newDoc, id) {                                       // 26  // 34
    var oldDoc = oldResults.get(id);                                               // 27  // 35
    if (oldDoc) {                                                                  // 28  // 36
      if (observer.changed && !EJSON.equals(oldDoc, newDoc)) {                     // 29  // 37
        var projectedNew = projectionFn(newDoc);                                   // 30  // 38
        var projectedOld = projectionFn(oldDoc);                                   // 31  // 39
        var changedFields =                                                        // 32  // 40
              DiffSequence.makeChangedFields(projectedNew, projectedOld);          // 33  // 41
        if (! _.isEmpty(changedFields)) {                                          // 34  // 42
          observer.changed(id, changedFields);                                     // 35  // 43
        }                                                                          // 36  // 44
      }                                                                            // 37  // 45
    } else if (observer.added) {                                                   // 38  // 46
      var fields = projectionFn(newDoc);                                           // 39  // 47
      delete fields._id;                                                           // 40  // 48
      observer.added(newDoc._id, fields);                                          // 41  // 49
    }                                                                              // 42  // 50
  });                                                                              // 43  // 51
                                                                                   // 44  // 52
  if (observer.removed) {                                                          // 45  // 53
    oldResults.forEach(function (oldDoc, id) {                                     // 46  // 54
      if (!newResults.has(id))                                                     // 47  // 55
        observer.removed(id);                                                      // 48  // 56
    });                                                                            // 49  // 57
  }                                                                                // 50  // 58
};                                                                                 // 51  // 59
                                                                                   // 52  // 60
                                                                                   // 53  // 61
DiffSequence.diffQueryOrderedChanges = function (old_results, new_results,         // 54  // 62
                                                     observer, options) {          // 55  // 63
  options = options || {};                                                         // 56  // 64
  var projectionFn = options.projectionFn || EJSON.clone;                          // 57  // 65
                                                                                   // 58  // 66
  var new_presence_of_id = {};                                                     // 59  // 67
  _.each(new_results, function (doc) {                                             // 60  // 68
    if (new_presence_of_id[doc._id])                                               // 61  // 69
      Meteor._debug("Duplicate _id in new_results");                               // 62  // 70
    new_presence_of_id[doc._id] = true;                                            // 63  // 71
  });                                                                              // 64  // 72
                                                                                   // 65  // 73
  var old_index_of_id = {};                                                        // 66  // 74
  _.each(old_results, function (doc, i) {                                          // 67  // 75
    if (doc._id in old_index_of_id)                                                // 68  // 76
      Meteor._debug("Duplicate _id in old_results");                               // 69  // 77
    old_index_of_id[doc._id] = i;                                                  // 70  // 78
  });                                                                              // 71  // 79
                                                                                   // 72  // 80
  // ALGORITHM:                                                                    // 73  // 81
  //                                                                               // 74  // 82
  // To determine which docs should be considered "moved" (and which               // 75  // 83
  // merely change position because of other docs moving) we run                   // 76  // 84
  // a "longest common subsequence" (LCS) algorithm.  The LCS of the               // 77  // 85
  // old doc IDs and the new doc IDs gives the docs that should NOT be             // 78  // 86
  // considered moved.                                                             // 79  // 87
                                                                                   // 80  // 88
  // To actually call the appropriate callbacks to get from the old state to the   // 81  // 89
  // new state:                                                                    // 82  // 90
                                                                                   // 83  // 91
  // First, we call removed() on all the items that only appear in the old         // 84  // 92
  // state.                                                                        // 85  // 93
                                                                                   // 86  // 94
  // Then, once we have the items that should not move, we walk through the new    // 87  // 95
  // results array group-by-group, where a "group" is a set of items that have     // 88  // 96
  // moved, anchored on the end by an item that should not move.  One by one, we   // 89  // 97
  // move each of those elements into place "before" the anchoring end-of-group    // 90  // 98
  // item, and fire changed events on them if necessary.  Then we fire a changed   // 91  // 99
  // event on the anchor, and move on to the next group.  There is always at       // 92  // 100
  // least one group; the last group is anchored by a virtual "null" id at the     // 93  // 101
  // end.                                                                          // 94  // 102
                                                                                   // 95  // 103
  // Asymptotically: O(N k) where k is number of ops, or potentially               // 96  // 104
  // O(N log N) if inner loop of LCS were made to be binary search.                // 97  // 105
                                                                                   // 98  // 106
                                                                                   // 99  // 107
  //////// LCS (longest common sequence, with respect to _id)                      // 100
  // (see Wikipedia article on Longest Increasing Subsequence,                     // 101
  // where the LIS is taken of the sequence of old indices of the                  // 102
  // docs in new_results)                                                          // 103
  //                                                                               // 104
  // unmoved: the output of the algorithm; members of the LCS,                     // 105
  // in the form of indices into new_results                                       // 106
  var unmoved = [];                                                                // 107
  // max_seq_len: length of LCS found so far                                       // 108
  var max_seq_len = 0;                                                             // 109
  // seq_ends[i]: the index into new_results of the last doc in a                  // 110
  // common subsequence of length of i+1 <= max_seq_len                            // 111
  var N = new_results.length;                                                      // 112
  var seq_ends = new Array(N);                                                     // 113
  // ptrs:  the common subsequence ending with new_results[n] extends              // 114
  // a common subsequence ending with new_results[ptr[n]], unless                  // 115
  // ptr[n] is -1.                                                                 // 116
  var ptrs = new Array(N);                                                         // 117
  // virtual sequence of old indices of new results                                // 118
  var old_idx_seq = function(i_new) {                                              // 119
    return old_index_of_id[new_results[i_new]._id];                                // 120
  };                                                                               // 121
  // for each item in new_results, use it to extend a common subsequence           // 122
  // of length j <= max_seq_len                                                    // 123
  for(var i=0; i<N; i++) {                                                         // 124
    if (old_index_of_id[new_results[i]._id] !== undefined) {                       // 125
      var j = max_seq_len;                                                         // 126
      // this inner loop would traditionally be a binary search,                   // 127
      // but scanning backwards we will likely find a subseq to extend             // 128
      // pretty soon, bounded for example by the total number of ops.              // 129
      // If this were to be changed to a binary search, we'd still want            // 130
      // to scan backwards a bit as an optimization.                               // 131
      while (j > 0) {                                                              // 132
        if (old_idx_seq(seq_ends[j-1]) < old_idx_seq(i))                           // 133
          break;                                                                   // 134
        j--;                                                                       // 135
      }                                                                            // 136
                                                                                   // 137
      ptrs[i] = (j === 0 ? -1 : seq_ends[j-1]);                                    // 138
      seq_ends[j] = i;                                                             // 139
      if (j+1 > max_seq_len)                                                       // 140
        max_seq_len = j+1;                                                         // 141
    }                                                                              // 142
  }                                                                                // 143
                                                                                   // 144
  // pull out the LCS/LIS into unmoved                                             // 145
  var idx = (max_seq_len === 0 ? -1 : seq_ends[max_seq_len-1]);                    // 146
  while (idx >= 0) {                                                               // 147
    unmoved.push(idx);                                                             // 148
    idx = ptrs[idx];                                                               // 149
  }                                                                                // 150
  // the unmoved item list is built backwards, so fix that                         // 151
  unmoved.reverse();                                                               // 152
                                                                                   // 153
  // the last group is always anchored by the end of the result list, which is     // 154
  // an id of "null"                                                               // 155
  unmoved.push(new_results.length);                                                // 156
                                                                                   // 157
  _.each(old_results, function (doc) {                                             // 158
    if (!new_presence_of_id[doc._id])                                              // 159
      observer.removed && observer.removed(doc._id);                               // 160
  });                                                                              // 161
  // for each group of things in the new_results that is anchored by an unmoved    // 162
  // element, iterate through the things before it.                                // 163
  var startOfGroup = 0;                                                            // 164
  _.each(unmoved, function (endOfGroup) {                                          // 165
    var groupId = new_results[endOfGroup] ? new_results[endOfGroup]._id : null;    // 166
    var oldDoc, newDoc, fields, projectedNew, projectedOld;                        // 167
    for (var i = startOfGroup; i < endOfGroup; i++) {                              // 168
      newDoc = new_results[i];                                                     // 169
      if (!_.has(old_index_of_id, newDoc._id)) {                                   // 170
        fields = projectionFn(newDoc);                                             // 171
        delete fields._id;                                                         // 172
        observer.addedBefore && observer.addedBefore(newDoc._id, fields, groupId);        // 181
        observer.added && observer.added(newDoc._id, fields);                      // 174
      } else {                                                                     // 175
        // moved                                                                   // 176
        oldDoc = old_results[old_index_of_id[newDoc._id]];                         // 177
        projectedNew = projectionFn(newDoc);                                       // 178
        projectedOld = projectionFn(oldDoc);                                       // 179
        fields = DiffSequence.makeChangedFields(projectedNew, projectedOld);       // 180
        if (!_.isEmpty(fields)) {                                                  // 181
          observer.changed && observer.changed(newDoc._id, fields);                // 182
        }                                                                          // 183
        observer.movedBefore && observer.movedBefore(newDoc._id, groupId);         // 184
      }                                                                            // 185
    }                                                                              // 186
    if (groupId) {                                                                 // 187
      newDoc = new_results[endOfGroup];                                            // 188
      oldDoc = old_results[old_index_of_id[newDoc._id]];                           // 189
      projectedNew = projectionFn(newDoc);                                         // 190
      projectedOld = projectionFn(oldDoc);                                         // 191
      fields = DiffSequence.makeChangedFields(projectedNew, projectedOld);         // 192
      if (!_.isEmpty(fields)) {                                                    // 193
        observer.changed && observer.changed(newDoc._id, fields);                  // 194
      }                                                                            // 195
    }                                                                              // 196
    startOfGroup = endOfGroup+1;                                                   // 197
  });                                                                              // 198
                                                                                   // 199
                                                                                   // 200
};                                                                                 // 201
                                                                                   // 202
                                                                                   // 203
// General helper for diff-ing two objects.                                        // 204
// callbacks is an object like so:                                                 // 205
// { leftOnly: function (key, leftValue) {...},                                    // 206
//   rightOnly: function (key, rightValue) {...},                                  // 207
//   both: function (key, leftValue, rightValue) {...},                            // 208
// }                                                                               // 209
DiffSequence.diffObjects = function (left, right, callbacks) {                     // 210
  _.each(left, function (leftValue, key) {                                         // 211
    if (_.has(right, key))                                                         // 212
      callbacks.both && callbacks.both(key, leftValue, right[key]);                // 213
    else                                                                           // 214
      callbacks.leftOnly && callbacks.leftOnly(key, leftValue);                    // 215
  });                                                                              // 216
  if (callbacks.rightOnly) {                                                       // 217
    _.each(right, function(rightValue, key) {                                      // 218
      if (!_.has(left, key))                                                       // 219
        callbacks.rightOnly(key, rightValue);                                      // 220
    });                                                                            // 221
  }                                                                                // 222
};                                                                                 // 223
                                                                                   // 224
                                                                                   // 225
DiffSequence.makeChangedFields = function (newDoc, oldDoc) {                       // 226
  var fields = {};                                                                 // 227
  DiffSequence.diffObjects(oldDoc, newDoc, {                                       // 228
    leftOnly: function (key, value) {                                              // 229
      fields[key] = undefined;                                                     // 230
    },                                                                             // 231
    rightOnly: function (key, value) {                                             // 232
      fields[key] = value;                                                         // 233
    },                                                                             // 234
    both: function (key, leftValue, rightValue) {                                  // 235
      if (!EJSON.equals(leftValue, rightValue))                                    // 236
        fields[key] = rightValue;                                                  // 237
    }                                                                              // 238
  });                                                                              // 239
  return fields;                                                                   // 240
};                                                                                 // 241
                                                                                   // 242
DiffSequence.applyChanges = function (doc, changeFields) {                         // 243
  _.each(changeFields, function (value, key) {                                     // 244
    if (value === undefined)                                                       // 245
      delete doc[key];                                                             // 246
    else                                                                           // 247
      doc[key] = value;                                                            // 248
  });                                                                              // 249
};                                                                                 // 250
                                                                                   // 251
                                                                                   // 252
/////////////////////////////////////////////////////////////////////////////////////     // 261
                                                                                          // 262
}).call(this);                                                                            // 263
                                                                                          // 264
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['diff-sequence'] = {
  DiffSequence: DiffSequence
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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var MongoID = Package['mongo-id'].MongoID;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var _ = Package.underscore._;
var Random = Package.random.Random;

/* Package-scope variables */
var ObserveSequence, seqChangedToEmpty, seqChangedToArray, seqChangedToCursor;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/observe-sequence/packages/observe-sequence.js                               //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
(function(){                                                                            // 1
                                                                                        // 2
///////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                               //     // 4
// packages/observe-sequence/observe_sequence.js                                 //     // 5
//                                                                               //     // 6
///////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                 //     // 8
var warn = function () {                                                         // 1   // 9
  if (ObserveSequence._suppressWarnings) {                                       // 2   // 10
    ObserveSequence._suppressWarnings--;                                         // 3   // 11
  } else {                                                                       // 4   // 12
    if (typeof console !== 'undefined' && console.warn)                          // 5   // 13
      console.warn.apply(console, arguments);                                    // 6   // 14
                                                                                 // 7   // 15
    ObserveSequence._loggedWarnings++;                                           // 8   // 16
  }                                                                              // 9   // 17
};                                                                               // 10  // 18
                                                                                 // 11  // 19
var idStringify = MongoID.idStringify;                                           // 12  // 20
var idParse = MongoID.idParse;                                                   // 13  // 21
                                                                                 // 14  // 22
ObserveSequence = {                                                              // 15  // 23
  _suppressWarnings: 0,                                                          // 16  // 24
  _loggedWarnings: 0,                                                            // 17  // 25
                                                                                 // 18  // 26
  // A mechanism similar to cursor.observe which receives a reactive             // 19  // 27
  // function returning a sequence type and firing appropriate callbacks         // 20  // 28
  // when the value changes.                                                     // 21  // 29
  //                                                                             // 22  // 30
  // @param sequenceFunc {Function} a reactive function returning a              // 23  // 31
  //     sequence type. The currently supported sequence types are:              // 24  // 32
  //     Array, Cursor, and null.                                                // 25  // 33
  //                                                                             // 26  // 34
  // @param callbacks {Object} similar to a specific subset of                   // 27  // 35
  //     callbacks passed to `cursor.observe`                                    // 28  // 36
  //     (http://docs.meteor.com/#observe), with minor variations to             // 29  // 37
  //     support the fact that not all sequences contain objects with            // 30  // 38
  //     _id fields.  Specifically:                                              // 31  // 39
  //                                                                             // 32  // 40
  //     * addedAt(id, item, atIndex, beforeId)                                  // 33  // 41
  //     * changedAt(id, newItem, oldItem, atIndex)                              // 34  // 42
  //     * removedAt(id, oldItem, atIndex)                                       // 35  // 43
  //     * movedTo(id, item, fromIndex, toIndex, beforeId)                       // 36  // 44
  //                                                                             // 37  // 45
  // @returns {Object(stop: Function)} call 'stop' on the return value           // 38  // 46
  //     to stop observing this sequence function.                               // 39  // 47
  //                                                                             // 40  // 48
  // We don't make any assumptions about our ability to compare sequence         // 41  // 49
  // elements (ie, we don't assume EJSON.equals works; maybe there is extra      // 42  // 50
  // state/random methods on the objects) so unlike cursor.observe, we may       // 43  // 51
  // sometimes call changedAt() when nothing actually changed.                   // 44  // 52
  // XXX consider if we *can* make the stronger assumption and avoid             // 45  // 53
  //     no-op changedAt calls (in some cases?)                                  // 46  // 54
  //                                                                             // 47  // 55
  // XXX currently only supports the callbacks used by our                       // 48  // 56
  // implementation of {{#each}}, but this can be expanded.                      // 49  // 57
  //                                                                             // 50  // 58
  // XXX #each doesn't use the indices (though we'll eventually need             // 51  // 59
  // a way to get them when we support `@index`), but calling                    // 52  // 60
  // `cursor.observe` causes the index to be calculated on every                 // 53  // 61
  // callback using a linear scan (unless you turn it off by passing             // 54  // 62
  // `_no_indices`).  Any way to avoid calculating indices on a pure             // 55  // 63
  // cursor observe like we used to?                                             // 56  // 64
  observe: function (sequenceFunc, callbacks) {                                  // 57  // 65
    var lastSeq = null;                                                          // 58  // 66
    var activeObserveHandle = null;                                              // 59  // 67
                                                                                 // 60  // 68
    // 'lastSeqArray' contains the previous value of the sequence                // 61  // 69
    // we're observing. It is an array of objects with '_id' and                 // 62  // 70
    // 'item' fields.  'item' is the element in the array, or the                // 63  // 71
    // document in the cursor.                                                   // 64  // 72
    //                                                                           // 65  // 73
    // '_id' is whichever of the following is relevant, unless it has            // 66  // 74
    // already appeared -- in which case it's randomly generated.                // 67  // 75
    //                                                                           // 68  // 76
    // * if 'item' is an object:                                                 // 69  // 77
    //   * an '_id' field, if present                                            // 70  // 78
    //   * otherwise, the index in the array                                     // 71  // 79
    //                                                                           // 72  // 80
    // * if 'item' is a number or string, use that value                         // 73  // 81
    //                                                                           // 74  // 82
    // XXX this can be generalized by allowing {{#each}} to accept a             // 75  // 83
    // general 'key' argument which could be a function, a dotted                // 76  // 84
    // field name, or the special @index value.                                  // 77  // 85
    var lastSeqArray = []; // elements are objects of form {_id, item}           // 78  // 86
    var computation = Tracker.autorun(function () {                              // 79  // 87
      var seq = sequenceFunc();                                                  // 80  // 88
                                                                                 // 81  // 89
      Tracker.nonreactive(function () {                                          // 82  // 90
        var seqArray; // same structure as `lastSeqArray` above.                 // 83  // 91
                                                                                 // 84  // 92
        if (activeObserveHandle) {                                               // 85  // 93
          // If we were previously observing a cursor, replace lastSeqArray with        // 94
          // more up-to-date information.  Then stop the old observe.            // 87  // 95
          lastSeqArray = _.map(lastSeq.fetch(), function (doc) {                 // 88  // 96
            return {_id: doc._id, item: doc};                                    // 89  // 97
          });                                                                    // 90  // 98
          activeObserveHandle.stop();                                            // 91  // 99
          activeObserveHandle = null;                                            // 92  // 100
        }                                                                        // 93  // 101
                                                                                 // 94  // 102
        if (!seq) {                                                              // 95  // 103
          seqArray = seqChangedToEmpty(lastSeqArray, callbacks);                 // 96  // 104
        } else if (seq instanceof Array) {                                       // 97  // 105
          seqArray = seqChangedToArray(lastSeqArray, seq, callbacks);            // 98  // 106
        } else if (isStoreCursor(seq)) {                                         // 99  // 107
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
      //   2. The element is moved back. Then the positions in between *and* the        // 230
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
///////////////////////////////////////////////////////////////////////////////////     // 357
                                                                                        // 358
}).call(this);                                                                          // 359
                                                                                        // 360
//////////////////////////////////////////////////////////////////////////////////////////

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

/* Package-scope variables */
var ECMAScript;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.ecmascript = {
  ECMAScript: ECMAScript
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

/* Package-scope variables */
var babelHelpers;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/babel-runtime/packages/babel-runtime.js                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
(function(){                                                                                                      // 1
                                                                                                                  // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                                         //     // 4
// packages/babel-runtime/babel-runtime.js                                                                 //     // 5
//                                                                                                         //     // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                                           //     // 8
var hasOwn = Object.prototype.hasOwnProperty;                                                              // 1   // 9
                                                                                                           // 2   // 10
function canDefineNonEnumerableProperties() {                                                              // 3   // 11
  var testObj = {};                                                                                        // 4   // 12
  var testPropName = "t";                                                                                  // 5   // 13
                                                                                                           // 6   // 14
  try {                                                                                                    // 7   // 15
    Object.defineProperty(testObj, testPropName, {                                                         // 8   // 16
      enumerable: false,                                                                                   // 9   // 17
      value: testObj                                                                                       // 10  // 18
    });                                                                                                    // 11  // 19
                                                                                                           // 12  // 20
    for (var k in testObj) {                                                                               // 13  // 21
      if (k === testPropName) {                                                                            // 14  // 22
        return false;                                                                                      // 15  // 23
      }                                                                                                    // 16  // 24
    }                                                                                                      // 17  // 25
  } catch (e) {                                                                                            // 18  // 26
    return false;                                                                                          // 19  // 27
  }                                                                                                        // 20  // 28
                                                                                                           // 21  // 29
  return testObj[testPropName] === testObj;                                                                // 22  // 30
}                                                                                                          // 23  // 31
                                                                                                           // 24  // 32
// The name `babelHelpers` is hard-coded in Babel.  Otherwise we would make it                             // 25  // 33
// something capitalized and more descriptive, like `BabelRuntime`.                                        // 26  // 34
babelHelpers = {                                                                                           // 27  // 35
  // Meteor-specific runtime helper for wrapping the object of for-in                                      // 28  // 36
  // loops, so that inherited Array methods defined by es5-shim can be                                     // 29  // 37
  // ignored in browsers where they cannot be defined as non-enumerable.                                   // 30  // 38
  sanitizeForInObject: canDefineNonEnumerableProperties()                                                  // 31  // 39
    ? function (value) { return value; }                                                                   // 32  // 40
    : function (obj) {                                                                                     // 33  // 41
      if (Array.isArray(obj)) {                                                                            // 34  // 42
        var newObj = {};                                                                                   // 35  // 43
        var keys = Object.keys(obj);                                                                       // 36  // 44
        var keyCount = keys.length;                                                                        // 37  // 45
        for (var i = 0; i < keyCount; ++i) {                                                               // 38  // 46
          var key = keys[i];                                                                               // 39  // 47
          newObj[key] = obj[key];                                                                          // 40  // 48
        }                                                                                                  // 41  // 49
        return newObj;                                                                                     // 42  // 50
      }                                                                                                    // 43  // 51
                                                                                                           // 44  // 52
      return obj;                                                                                          // 45  // 53
    },                                                                                                     // 46  // 54
                                                                                                           // 47  // 55
  // es6.templateLiterals                                                                                  // 48  // 56
  // Constructs the object passed to the tag function in a tagged                                          // 49  // 57
  // template literal.                                                                                     // 50  // 58
  taggedTemplateLiteralLoose: function (strings, raw) {                                                    // 51  // 59
    // Babel's own version of this calls Object.freeze on `strings` and                                    // 52  // 60
    // `strings.raw`, but it doesn't seem worth the compatibility and                                      // 53  // 61
    // performance concerns.  If you're writing code against this helper,                                  // 54  // 62
    // don't add properties to these objects.                                                              // 55  // 63
    strings.raw = raw;                                                                                     // 56  // 64
    return strings;                                                                                        // 57  // 65
  },                                                                                                       // 58  // 66
                                                                                                           // 59  // 67
  // es6.classes                                                                                           // 60  // 68
  // Checks that a class constructor is being called with `new`, and throws                                // 61  // 69
  // an error if it is not.                                                                                // 62  // 70
  classCallCheck: function (instance, Constructor) {                                                       // 63  // 71
    if (!(instance instanceof Constructor)) {                                                              // 64  // 72
      throw new TypeError("Cannot call a class as a function");                                            // 65  // 73
    }                                                                                                      // 66  // 74
  },                                                                                                       // 67  // 75
                                                                                                           // 68  // 76
  // es6.classes                                                                                           // 69  // 77
  inherits: function (subClass, superClass) {                                                              // 70  // 78
    if (typeof superClass !== "function" && superClass !== null) {                                         // 71  // 79
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);        // 80
    }                                                                                                      // 73  // 81
                                                                                                           // 74  // 82
    if (superClass) {                                                                                      // 75  // 83
      if (Object.create) {                                                                                 // 76  // 84
        // All but IE 8                                                                                    // 77  // 85
        subClass.prototype = Object.create(superClass.prototype, {                                         // 78  // 86
          constructor: {                                                                                   // 79  // 87
            value: subClass,                                                                               // 80  // 88
            enumerable: false,                                                                             // 81  // 89
            writable: true,                                                                                // 82  // 90
            configurable: true                                                                             // 83  // 91
          }                                                                                                // 84  // 92
        });                                                                                                // 85  // 93
      } else {                                                                                             // 86  // 94
        // IE 8 path.  Slightly worse for modern browsers, because `constructor`                           // 87  // 95
        // is enumerable and shows up in the inspector unnecessarily.                                      // 88  // 96
        // It's not an "own" property of any instance though.                                              // 89  // 97
        //                                                                                                 // 90  // 98
        // For correctness when writing code,                                                              // 91  // 99
        // don't enumerate all the own-and-inherited properties of an instance                             // 92  // 100
        // of a class and expect not to find `constructor` (but who does that?).                           // 93  // 101
        var F = function () {                                                                              // 94  // 102
          this.constructor = subClass;                                                                     // 95  // 103
        };                                                                                                 // 96  // 104
        F.prototype = superClass.prototype;                                                                // 97  // 105
        subClass.prototype = new F();                                                                      // 98  // 106
      }                                                                                                    // 99  // 107
                                                                                                           // 100
      // For modern browsers, this would be `subClass.__proto__ = superClass`,                             // 101
      // but IE <=10 don't support `__proto__`, and in this case the difference                            // 102
      // would be detectable; code that works in modern browsers could easily                              // 103
      // fail on IE 8 if we ever used the `__proto__` trick.                                               // 104
      //                                                                                                   // 105
      // There's no perfect way to make static methods inherited if they are                               // 106
      // assigned after declaration of the classes.  The best we can do is                                 // 107
      // to copy them.  In other words, when you write `class Foo                                          // 108
      // extends Bar`, we copy the static methods from Bar onto Foo, but future                            // 109
      // ones are not copied.                                                                              // 110
      //                                                                                                   // 111
      // For correctness when writing code, don't add static methods to a class                            // 112
      // after you subclass it.                                                                            // 113
      for (var k in superClass) {                                                                          // 114
        if (hasOwn.call(superClass, k)) {                                                                  // 115
          subClass[k] = superClass[k];                                                                     // 116
        }                                                                                                  // 117
      }                                                                                                    // 118
    }                                                                                                      // 119
  },                                                                                                       // 120
                                                                                                           // 121
  createClass: (function () {                                                                              // 122
    var hasDefineProperty = false;                                                                         // 123
    try {                                                                                                  // 124
      // IE 8 has a broken Object.defineProperty, so feature-test by                                       // 125
      // trying to call it.                                                                                // 126
      Object.defineProperty({}, 'x', {});                                                                  // 127
      hasDefineProperty = true;                                                                            // 128
    } catch (e) {}                                                                                         // 129
                                                                                                           // 130
    function defineProperties(target, props) {                                                             // 131
      for (var i = 0; i < props.length; i++) {                                                             // 132
        var descriptor = props[i];                                                                         // 133
        descriptor.enumerable = descriptor.enumerable || false;                                            // 134
        descriptor.configurable = true;                                                                    // 135
        if ("value" in descriptor) descriptor.writable = true;                                             // 136
        Object.defineProperty(target, descriptor.key, descriptor);                                         // 137
      }                                                                                                    // 138
    }                                                                                                      // 139
                                                                                                           // 140
    return function (Constructor, protoProps, staticProps) {                                               // 141
      if (! hasDefineProperty) {                                                                           // 142
        // e.g. `class Foo { get bar() {} }`.  If you try to use getters and                               // 143
        // setters in IE 8, you will get a big nasty error, with or without                                // 144
        // Babel.  I don't know of any other syntax features besides getters                               // 145
        // and setters that will trigger this error.                                                       // 146
        throw new Error(                                                                                   // 147
          "Your browser does not support this type of class property.  " +                                 // 148
            "For example, Internet Explorer 8 does not support getters and " +                             // 149
            "setters.");                                                                                   // 150
      }                                                                                                    // 151
                                                                                                           // 152
      if (protoProps) defineProperties(Constructor.prototype, protoProps);                                 // 153
      if (staticProps) defineProperties(Constructor, staticProps);                                         // 154
      return Constructor;                                                                                  // 155
    };                                                                                                     // 156
  })(),                                                                                                    // 157
                                                                                                           // 158
  // es7.objectRestSpread and react (JSX)                                                                  // 159
  _extends: Object.assign || (function (target) {                                                          // 160
    for (var i = 1; i < arguments.length; i++) {                                                           // 161
      var source = arguments[i];                                                                           // 162
      for (var key in source) {                                                                            // 163
        if (hasOwn.call(source, key)) {                                                                    // 164
          target[key] = source[key];                                                                       // 165
        }                                                                                                  // 166
      }                                                                                                    // 167
    }                                                                                                      // 168
    return target;                                                                                         // 169
  }),                                                                                                      // 170
                                                                                                           // 171
  // es6.destructuring                                                                                     // 172
  objectWithoutProperties: function (obj, keys) {                                                          // 173
    var target = {};                                                                                       // 174
    outer: for (var i in obj) {                                                                            // 175
      if (! hasOwn.call(obj, i)) continue;                                                                 // 176
      for (var j = 0; j < keys.length; j++) {                                                              // 177
        if (keys[j] === i) continue outer;                                                                 // 178
      }                                                                                                    // 179
      target[i] = obj[i];                                                                                  // 180
    }                                                                                                      // 181
    return target;                                                                                         // 182
  },                                                                                                       // 183
                                                                                                           // 184
  // es6.destructuring                                                                                     // 185
  objectDestructuringEmpty: function (obj) {                                                               // 186
    if (obj == null) throw new TypeError("Cannot destructure undefined");                                  // 187
  },                                                                                                       // 188
                                                                                                           // 189
  // es6.spread                                                                                            // 190
  bind: Function.prototype.bind || (function () {                                                          // 191
    var isCallable = function (value) { return typeof value === 'function'; };                             // 192
    var $Object = Object;                                                                                  // 193
    var to_string = Object.prototype.toString;                                                             // 194
    var array_slice = Array.prototype.slice;                                                               // 195
    var array_concat = Array.prototype.concat;                                                             // 196
    var array_push = Array.prototype.push;                                                                 // 197
    var max = Math.max;                                                                                    // 198
    var Empty = function Empty() {};                                                                       // 199
                                                                                                           // 200
    // Copied from es5-shim.js (3ac7942).  See original for more comments.                                 // 201
    return function bind(that) {                                                                           // 202
      var target = this;                                                                                   // 203
      if (!isCallable(target)) {                                                                           // 204
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);                   // 205
      }                                                                                                    // 206
                                                                                                           // 207
      var args = array_slice.call(arguments, 1);                                                           // 208
                                                                                                           // 209
      var bound;                                                                                           // 210
      var binder = function () {                                                                           // 211
                                                                                                           // 212
        if (this instanceof bound) {                                                                       // 213
          var result = target.apply(                                                                       // 214
            this,                                                                                          // 215
            array_concat.call(args, array_slice.call(arguments))                                           // 216
          );                                                                                               // 217
          if ($Object(result) === result) {                                                                // 218
            return result;                                                                                 // 219
          }                                                                                                // 220
          return this;                                                                                     // 221
        } else {                                                                                           // 222
          return target.apply(                                                                             // 223
            that,                                                                                          // 224
            array_concat.call(args, array_slice.call(arguments))                                           // 225
          );                                                                                               // 226
        }                                                                                                  // 227
      };                                                                                                   // 228
                                                                                                           // 229
      var boundLength = max(0, target.length - args.length);                                               // 230
                                                                                                           // 231
      var boundArgs = [];                                                                                  // 232
      for (var i = 0; i < boundLength; i++) {                                                              // 233
        array_push.call(boundArgs, '$' + i);                                                               // 234
      }                                                                                                    // 235
                                                                                                           // 236
      // Create a Function from source code so that it has the right `.length`.                            // 237
      // Probably not important for Babel.  This code violates CSPs that ban                               // 238
      // `eval`, but the browsers that need this polyfill don't have CSP!                                  // 239
      bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
                                                                                                           // 241
      if (target.prototype) {                                                                              // 242
        Empty.prototype = target.prototype;                                                                // 243
        bound.prototype = new Empty();                                                                     // 244
        Empty.prototype = null;                                                                            // 245
      }                                                                                                    // 246
                                                                                                           // 247
      return bound;                                                                                        // 248
    };                                                                                                     // 249
                                                                                                           // 250
  })(),                                                                                                    // 251
                                                                                                           // 252
  slice: Array.prototype.slice                                                                             // 253
};                                                                                                         // 254
                                                                                                           // 255
/////////////////////////////////////////////////////////////////////////////////////////////////////////////     // 264
                                                                                                                  // 265
}).call(this);                                                                                                    // 266
                                                                                                                  // 267
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['babel-runtime'] = {
  babelHelpers: babelHelpers
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

/* Package-scope variables */
var Symbol, Map, Set, __g, __e;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/ecmascript-runtime/.npm/package/node_modules/meteor-ecmascript-runtime/client.js                  //
// This file is in bare mode and is not in its own closure.                                                   //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/******/ (function(modules) { // webpackBootstrap                                                             // 1
/******/ 	// The module cache                                                                                 // 2
/******/ 	var installedModules = {};                                                                          // 3
                                                                                                              // 4
/******/ 	// The require function                                                                             // 5
/******/ 	function __webpack_require__(moduleId) {                                                            // 6
                                                                                                              // 7
/******/ 		// Check if module is in cache                                                                     // 8
/******/ 		if(installedModules[moduleId])                                                                     // 9
/******/ 			return installedModules[moduleId].exports;                                                        // 10
                                                                                                              // 11
/******/ 		// Create a new module (and put it into the cache)                                                 // 12
/******/ 		var module = installedModules[moduleId] = {                                                        // 13
/******/ 			exports: {},                                                                                      // 14
/******/ 			id: moduleId,                                                                                     // 15
/******/ 			loaded: false                                                                                     // 16
/******/ 		};                                                                                                 // 17
                                                                                                              // 18
/******/ 		// Execute the module function                                                                     // 19
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);               // 20
                                                                                                              // 21
/******/ 		// Flag the module as loaded                                                                       // 22
/******/ 		module.loaded = true;                                                                              // 23
                                                                                                              // 24
/******/ 		// Return the exports of the module                                                                // 25
/******/ 		return module.exports;                                                                             // 26
/******/ 	}                                                                                                   // 27
                                                                                                              // 28
                                                                                                              // 29
/******/ 	// expose the modules object (__webpack_modules__)                                                  // 30
/******/ 	__webpack_require__.m = modules;                                                                    // 31
                                                                                                              // 32
/******/ 	// expose the module cache                                                                          // 33
/******/ 	__webpack_require__.c = installedModules;                                                           // 34
                                                                                                              // 35
/******/ 	// __webpack_public_path__                                                                          // 36
/******/ 	__webpack_require__.p = "";                                                                         // 37
                                                                                                              // 38
/******/ 	// Load entry module and return exports                                                             // 39
/******/ 	return __webpack_require__(0);                                                                      // 40
/******/ })                                                                                                   // 41
/************************************************************************/                                    // 42
/******/ ([                                                                                                   // 43
/* 0 */                                                                                                       // 44
/***/ function(module, exports, __webpack_require__) {                                                        // 45
                                                                                                              // 46
	__webpack_require__(1);                                                                                      // 47
	__webpack_require__(50);                                                                                     // 48
	__webpack_require__(77);                                                                                     // 49
	__webpack_require__(96);                                                                                     // 50
                                                                                                              // 51
	Symbol = exports.Symbol = __webpack_require__(99);                                                           // 52
	Map = exports.Map = __webpack_require__(100);                                                                // 53
	Set = exports.Set = __webpack_require__(108);                                                                // 54
                                                                                                              // 55
                                                                                                              // 56
/***/ },                                                                                                      // 57
/* 1 */                                                                                                       // 58
/***/ function(module, exports, __webpack_require__) {                                                        // 59
                                                                                                              // 60
	__webpack_require__(2);                                                                                      // 61
	__webpack_require__(28);                                                                                     // 62
	__webpack_require__(31);                                                                                     // 63
	__webpack_require__(33);                                                                                     // 64
	__webpack_require__(37);                                                                                     // 65
	__webpack_require__(39);                                                                                     // 66
	__webpack_require__(41);                                                                                     // 67
	__webpack_require__(42);                                                                                     // 68
	__webpack_require__(43);                                                                                     // 69
	__webpack_require__(44);                                                                                     // 70
	__webpack_require__(45);                                                                                     // 71
	__webpack_require__(46);                                                                                     // 72
	__webpack_require__(47);                                                                                     // 73
	__webpack_require__(48);                                                                                     // 74
	__webpack_require__(49);                                                                                     // 75
                                                                                                              // 76
	module.exports = __webpack_require__(9).Object;                                                              // 77
                                                                                                              // 78
/***/ },                                                                                                      // 79
/* 2 */                                                                                                       // 80
/***/ function(module, exports, __webpack_require__) {                                                        // 81
                                                                                                              // 82
	'use strict';                                                                                                // 83
	// ECMAScript 6 symbols shim                                                                                 // 84
	var $              = __webpack_require__(3)                                                                  // 85
	  , global         = __webpack_require__(4)                                                                  // 86
	  , has            = __webpack_require__(5)                                                                  // 87
	  , SUPPORT_DESC   = __webpack_require__(6)                                                                  // 88
	  , $def           = __webpack_require__(8)                                                                  // 89
	  , $redef         = __webpack_require__(12)                                                                 // 90
	  , $fails         = __webpack_require__(7)                                                                  // 91
	  , shared         = __webpack_require__(14)                                                                 // 92
	  , setTag         = __webpack_require__(15)                                                                 // 93
	  , uid            = __webpack_require__(13)                                                                 // 94
	  , wks            = __webpack_require__(16)                                                                 // 95
	  , keyOf          = __webpack_require__(17)                                                                 // 96
	  , $names         = __webpack_require__(22)                                                                 // 97
	  , enumKeys       = __webpack_require__(23)                                                                 // 98
	  , isArray        = __webpack_require__(24)                                                                 // 99
	  , isObject       = __webpack_require__(25)                                                                 // 100
	  , anObject       = __webpack_require__(26)                                                                 // 101
	  , toIObject      = __webpack_require__(18)                                                                 // 102
	  , createDesc     = __webpack_require__(11)                                                                 // 103
	  , getDesc        = $.getDesc                                                                               // 104
	  , setDesc        = $.setDesc                                                                               // 105
	  , _create        = $.create                                                                                // 106
	  , getNames       = $names.get                                                                              // 107
	  , $Symbol        = global.Symbol                                                                           // 108
	  , $JSON          = global.JSON                                                                             // 109
	  , _stringify     = $JSON && $JSON.stringify                                                                // 110
	  , setter         = false                                                                                   // 111
	  , HIDDEN         = wks('_hidden')                                                                          // 112
	  , isEnum         = $.isEnum                                                                                // 113
	  , SymbolRegistry = shared('symbol-registry')                                                               // 114
	  , AllSymbols     = shared('symbols')                                                                       // 115
	  , useNative      = typeof $Symbol == 'function'                                                            // 116
	  , ObjectProto    = Object.prototype;                                                                       // 117
                                                                                                              // 118
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687                               // 119
	var setSymbolDesc = SUPPORT_DESC && $fails(function(){                                                       // 120
	  return _create(setDesc({}, 'a', {                                                                          // 121
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }                                              // 122
	  })).a != 7;                                                                                                // 123
	}) ? function(it, key, D){                                                                                   // 124
	  var protoDesc = getDesc(ObjectProto, key);                                                                 // 125
	  if(protoDesc)delete ObjectProto[key];                                                                      // 126
	  setDesc(it, key, D);                                                                                       // 127
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);                                   // 128
	} : setDesc;                                                                                                 // 129
                                                                                                              // 130
	var wrap = function(tag){                                                                                    // 131
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);                                                    // 132
	  sym._k = tag;                                                                                              // 133
	  SUPPORT_DESC && setter && setSymbolDesc(ObjectProto, tag, {                                                // 134
	    configurable: true,                                                                                      // 135
	    set: function(value){                                                                                    // 136
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;                              // 137
	      setSymbolDesc(this, tag, createDesc(1, value));                                                        // 138
	    }                                                                                                        // 139
	  });                                                                                                        // 140
	  return sym;                                                                                                // 141
	};                                                                                                           // 142
                                                                                                              // 143
	var isSymbol = function(it){                                                                                 // 144
	  return typeof it == 'symbol';                                                                              // 145
	};                                                                                                           // 146
                                                                                                              // 147
	var $defineProperty = function defineProperty(it, key, D){                                                   // 148
	  if(D && has(AllSymbols, key)){                                                                             // 149
	    if(!D.enumerable){                                                                                       // 150
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));                                            // 151
	      it[HIDDEN][key] = true;                                                                                // 152
	    } else {                                                                                                 // 153
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;                                         // 154
	      D = _create(D, {enumerable: createDesc(0, false)});                                                    // 155
	    } return setSymbolDesc(it, key, D);                                                                      // 156
	  } return setDesc(it, key, D);                                                                              // 157
	};                                                                                                           // 158
	var $defineProperties = function defineProperties(it, P){                                                    // 159
	  anObject(it);                                                                                              // 160
	  var keys = enumKeys(P = toIObject(P))                                                                      // 161
	    , i    = 0                                                                                               // 162
	    , l = keys.length                                                                                        // 163
	    , key;                                                                                                   // 164
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);                                                  // 165
	  return it;                                                                                                 // 166
	};                                                                                                           // 167
	var $create = function create(it, P){                                                                        // 168
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);                                  // 169
	};                                                                                                           // 170
	var $propertyIsEnumerable = function propertyIsEnumerable(key){                                              // 171
	  var E = isEnum.call(this, key);                                                                            // 172
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]             // 173
	    ? E : true;                                                                                              // 174
	};                                                                                                           // 175
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){                                  // 176
	  var D = getDesc(it = toIObject(it), key);                                                                  // 177
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;                 // 178
	  return D;                                                                                                  // 179
	};                                                                                                           // 180
	var $getOwnPropertyNames = function getOwnPropertyNames(it){                                                 // 181
	  var names  = getNames(toIObject(it))                                                                       // 182
	    , result = []                                                                                            // 183
	    , i      = 0                                                                                             // 184
	    , key;                                                                                                   // 185
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);            // 186
	  return result;                                                                                             // 187
	};                                                                                                           // 188
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){                                             // 189
	  var names  = getNames(toIObject(it))                                                                       // 190
	    , result = []                                                                                            // 191
	    , i      = 0                                                                                             // 192
	    , key;                                                                                                   // 193
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);                  // 194
	  return result;                                                                                             // 195
	};                                                                                                           // 196
	var $stringify = function stringify(it){                                                                     // 197
	  var args = [it]                                                                                            // 198
	    , i    = 1                                                                                               // 199
	    , replacer, $replacer;                                                                                   // 200
	  while(arguments.length > i)args.push(arguments[i++]);                                                      // 201
	  replacer = args[1];                                                                                        // 202
	  if(typeof replacer == 'function')$replacer = replacer;                                                     // 203
	  if($replacer || !isArray(replacer))replacer = function(key, value){                                        // 204
	    if($replacer)value = $replacer.call(this, key, value);                                                   // 205
	    if(!isSymbol(value))return value;                                                                        // 206
	  };                                                                                                         // 207
	  args[1] = replacer;                                                                                        // 208
	  return _stringify.apply($JSON, args);                                                                      // 209
	};                                                                                                           // 210
	var buggyJSON = $fails(function(){                                                                           // 211
	  var S = $Symbol();                                                                                         // 212
	  // MS Edge converts symbol values to JSON as {}                                                            // 213
	  // WebKit converts symbol values to JSON as null                                                           // 214
	  // V8 throws on boxed symbols                                                                              // 215
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';         // 216
	});                                                                                                          // 217
                                                                                                              // 218
	// 19.4.1.1 Symbol([description])                                                                            // 219
	if(!useNative){                                                                                              // 220
	  $Symbol = function Symbol(){                                                                               // 221
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');                                        // 222
	    return wrap(uid(arguments[0]));                                                                          // 223
	  };                                                                                                         // 224
	  $redef($Symbol.prototype, 'toString', function toString(){                                                 // 225
	    return this._k;                                                                                          // 226
	  });                                                                                                        // 227
                                                                                                              // 228
	  isSymbol = function(it){                                                                                   // 229
	    return it instanceof $Symbol;                                                                            // 230
	  };                                                                                                         // 231
                                                                                                              // 232
	  $.create     = $create;                                                                                    // 233
	  $.isEnum     = $propertyIsEnumerable;                                                                      // 234
	  $.getDesc    = $getOwnPropertyDescriptor;                                                                  // 235
	  $.setDesc    = $defineProperty;                                                                            // 236
	  $.setDescs   = $defineProperties;                                                                          // 237
	  $.getNames   = $names.get = $getOwnPropertyNames;                                                          // 238
	  $.getSymbols = $getOwnPropertySymbols;                                                                     // 239
                                                                                                              // 240
	  if(SUPPORT_DESC && !__webpack_require__(27)){                                                              // 241
	    $redef(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);                                // 242
	  }                                                                                                          // 243
	}                                                                                                            // 244
                                                                                                              // 245
	var symbolStatics = {                                                                                        // 246
	  // 19.4.2.1 Symbol.for(key)                                                                                // 247
	  'for': function(key){                                                                                      // 248
	    return has(SymbolRegistry, key += '')                                                                    // 249
	      ? SymbolRegistry[key]                                                                                  // 250
	      : SymbolRegistry[key] = $Symbol(key);                                                                  // 251
	  },                                                                                                         // 252
	  // 19.4.2.5 Symbol.keyFor(sym)                                                                             // 253
	  keyFor: function keyFor(key){                                                                              // 254
	    return keyOf(SymbolRegistry, key);                                                                       // 255
	  },                                                                                                         // 256
	  useSetter: function(){ setter = true; },                                                                   // 257
	  useSimple: function(){ setter = false; }                                                                   // 258
	};                                                                                                           // 259
	// 19.4.2.2 Symbol.hasInstance                                                                               // 260
	// 19.4.2.3 Symbol.isConcatSpreadable                                                                        // 261
	// 19.4.2.4 Symbol.iterator                                                                                  // 262
	// 19.4.2.6 Symbol.match                                                                                     // 263
	// 19.4.2.8 Symbol.replace                                                                                   // 264
	// 19.4.2.9 Symbol.search                                                                                    // 265
	// 19.4.2.10 Symbol.species                                                                                  // 266
	// 19.4.2.11 Symbol.split                                                                                    // 267
	// 19.4.2.12 Symbol.toPrimitive                                                                              // 268
	// 19.4.2.13 Symbol.toStringTag                                                                              // 269
	// 19.4.2.14 Symbol.unscopables                                                                              // 270
	$.each.call((                                                                                                // 271
	    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +                                        // 272
	    'species,split,toPrimitive,toStringTag,unscopables'                                                      // 273
	  ).split(','), function(it){                                                                                // 274
	    var sym = wks(it);                                                                                       // 275
	    symbolStatics[it] = useNative ? sym : wrap(sym);                                                         // 276
	  }                                                                                                          // 277
	);                                                                                                           // 278
                                                                                                              // 279
	setter = true;                                                                                               // 280
                                                                                                              // 281
	$def($def.G + $def.W, {Symbol: $Symbol});                                                                    // 282
                                                                                                              // 283
	$def($def.S, 'Symbol', symbolStatics);                                                                       // 284
                                                                                                              // 285
	$def($def.S + $def.F * !useNative, 'Object', {                                                               // 286
	  // 19.1.2.2 Object.create(O [, Properties])                                                                // 287
	  create: $create,                                                                                           // 288
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)                                                        // 289
	  defineProperty: $defineProperty,                                                                           // 290
	  // 19.1.2.3 Object.defineProperties(O, Properties)                                                         // 291
	  defineProperties: $defineProperties,                                                                       // 292
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)                                                          // 293
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,                                                       // 294
	  // 19.1.2.7 Object.getOwnPropertyNames(O)                                                                  // 295
	  getOwnPropertyNames: $getOwnPropertyNames,                                                                 // 296
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)                                                                // 297
	  getOwnPropertySymbols: $getOwnPropertySymbols                                                              // 298
	});                                                                                                          // 299
                                                                                                              // 300
	// 24.3.2 JSON.stringify(value [, replacer [, space]])                                                       // 301
	$JSON && $def($def.S + $def.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});                 // 302
                                                                                                              // 303
	// 19.4.3.5 Symbol.prototype[@@toStringTag]                                                                  // 304
	setTag($Symbol, 'Symbol');                                                                                   // 305
	// 20.2.1.9 Math[@@toStringTag]                                                                              // 306
	setTag(Math, 'Math', true);                                                                                  // 307
	// 24.3.3 JSON[@@toStringTag]                                                                                // 308
	setTag(global.JSON, 'JSON', true);                                                                           // 309
                                                                                                              // 310
/***/ },                                                                                                      // 311
/* 3 */                                                                                                       // 312
/***/ function(module, exports) {                                                                             // 313
                                                                                                              // 314
	var $Object = Object;                                                                                        // 315
	module.exports = {                                                                                           // 316
	  create:     $Object.create,                                                                                // 317
	  getProto:   $Object.getPrototypeOf,                                                                        // 318
	  isEnum:     {}.propertyIsEnumerable,                                                                       // 319
	  getDesc:    $Object.getOwnPropertyDescriptor,                                                              // 320
	  setDesc:    $Object.defineProperty,                                                                        // 321
	  setDescs:   $Object.defineProperties,                                                                      // 322
	  getKeys:    $Object.keys,                                                                                  // 323
	  getNames:   $Object.getOwnPropertyNames,                                                                   // 324
	  getSymbols: $Object.getOwnPropertySymbols,                                                                 // 325
	  each:       [].forEach                                                                                     // 326
	};                                                                                                           // 327
                                                                                                              // 328
/***/ },                                                                                                      // 329
/* 4 */                                                                                                       // 330
/***/ function(module, exports) {                                                                             // 331
                                                                                                              // 332
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028                                      // 333
	var UNDEFINED = 'undefined';                                                                                 // 334
	var global = module.exports = typeof window != UNDEFINED && window.Math == Math                              // 335
	  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();               // 336
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef                                      // 337
                                                                                                              // 338
/***/ },                                                                                                      // 339
/* 5 */                                                                                                       // 340
/***/ function(module, exports) {                                                                             // 341
                                                                                                              // 342
	var hasOwnProperty = {}.hasOwnProperty;                                                                      // 343
	module.exports = function(it, key){                                                                          // 344
	  return hasOwnProperty.call(it, key);                                                                       // 345
	};                                                                                                           // 346
                                                                                                              // 347
/***/ },                                                                                                      // 348
/* 6 */                                                                                                       // 349
/***/ function(module, exports, __webpack_require__) {                                                        // 350
                                                                                                              // 351
	// Thank's IE8 for his funny defineProperty                                                                  // 352
	module.exports = !__webpack_require__(7)(function(){                                                         // 353
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;                              // 354
	});                                                                                                          // 355
                                                                                                              // 356
/***/ },                                                                                                      // 357
/* 7 */                                                                                                       // 358
/***/ function(module, exports) {                                                                             // 359
                                                                                                              // 360
	module.exports = function(exec){                                                                             // 361
	  try {                                                                                                      // 362
	    return !!exec();                                                                                         // 363
	  } catch(e){                                                                                                // 364
	    return true;                                                                                             // 365
	  }                                                                                                          // 366
	};                                                                                                           // 367
                                                                                                              // 368
/***/ },                                                                                                      // 369
/* 8 */                                                                                                       // 370
/***/ function(module, exports, __webpack_require__) {                                                        // 371
                                                                                                              // 372
	var global     = __webpack_require__(4)                                                                      // 373
	  , core       = __webpack_require__(9)                                                                      // 374
	  , hide       = __webpack_require__(10)                                                                     // 375
	  , $redef     = __webpack_require__(12)                                                                     // 376
	  , PROTOTYPE  = 'prototype';                                                                                // 377
	var ctx = function(fn, that){                                                                                // 378
	  return function(){                                                                                         // 379
	    return fn.apply(that, arguments);                                                                        // 380
	  };                                                                                                         // 381
	};                                                                                                           // 382
	var $def = function(type, name, source){                                                                     // 383
	  var key, own, out, exp                                                                                     // 384
	    , isGlobal = type & $def.G                                                                               // 385
	    , isProto  = type & $def.P                                                                               // 386
	    , target   = isGlobal ? global : type & $def.S                                                           // 387
	        ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]                              // 388
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});                                          // 389
	  if(isGlobal)source = name;                                                                                 // 390
	  for(key in source){                                                                                        // 391
	    // contains in native                                                                                    // 392
	    own = !(type & $def.F) && target && key in target;                                                       // 393
	    // export native or passed                                                                               // 394
	    out = (own ? target : source)[key];                                                                      // 395
	    // bind timers to global for call from export context                                                    // 396
	    if(type & $def.B && own)exp = ctx(out, global);                                                          // 397
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;                          // 398
	    // extend global                                                                                         // 399
	    if(target && !own)$redef(target, key, out);                                                              // 400
	    // export                                                                                                // 401
	    if(exports[key] != out)hide(exports, key, exp);                                                          // 402
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;                                 // 403
	  }                                                                                                          // 404
	};                                                                                                           // 405
	global.core = core;                                                                                          // 406
	// type bitmap                                                                                               // 407
	$def.F = 1;  // forced                                                                                       // 408
	$def.G = 2;  // global                                                                                       // 409
	$def.S = 4;  // static                                                                                       // 410
	$def.P = 8;  // proto                                                                                        // 411
	$def.B = 16; // bind                                                                                         // 412
	$def.W = 32; // wrap                                                                                         // 413
	module.exports = $def;                                                                                       // 414
                                                                                                              // 415
/***/ },                                                                                                      // 416
/* 9 */                                                                                                       // 417
/***/ function(module, exports) {                                                                             // 418
                                                                                                              // 419
	var core = module.exports = {version: '1.2.1'};                                                              // 420
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef                                        // 421
                                                                                                              // 422
/***/ },                                                                                                      // 423
/* 10 */                                                                                                      // 424
/***/ function(module, exports, __webpack_require__) {                                                        // 425
                                                                                                              // 426
	var $          = __webpack_require__(3)                                                                      // 427
	  , createDesc = __webpack_require__(11);                                                                    // 428
	module.exports = __webpack_require__(6) ? function(object, key, value){                                      // 429
	  return $.setDesc(object, key, createDesc(1, value));                                                       // 430
	} : function(object, key, value){                                                                            // 431
	  object[key] = value;                                                                                       // 432
	  return object;                                                                                             // 433
	};                                                                                                           // 434
                                                                                                              // 435
/***/ },                                                                                                      // 436
/* 11 */                                                                                                      // 437
/***/ function(module, exports) {                                                                             // 438
                                                                                                              // 439
	module.exports = function(bitmap, value){                                                                    // 440
	  return {                                                                                                   // 441
	    enumerable  : !(bitmap & 1),                                                                             // 442
	    configurable: !(bitmap & 2),                                                                             // 443
	    writable    : !(bitmap & 4),                                                                             // 444
	    value       : value                                                                                      // 445
	  };                                                                                                         // 446
	};                                                                                                           // 447
                                                                                                              // 448
/***/ },                                                                                                      // 449
/* 12 */                                                                                                      // 450
/***/ function(module, exports, __webpack_require__) {                                                        // 451
                                                                                                              // 452
	// add fake Function#toString                                                                                // 453
	// for correct work wrapped methods / constructors with methods like LoDash isNative                         // 454
	var global    = __webpack_require__(4)                                                                       // 455
	  , hide      = __webpack_require__(10)                                                                      // 456
	  , SRC       = __webpack_require__(13)('src')                                                               // 457
	  , TO_STRING = 'toString'                                                                                   // 458
	  , $toString = Function[TO_STRING]                                                                          // 459
	  , TPL       = ('' + $toString).split(TO_STRING);                                                           // 460
                                                                                                              // 461
	__webpack_require__(9).inspectSource = function(it){                                                         // 462
	  return $toString.call(it);                                                                                 // 463
	};                                                                                                           // 464
                                                                                                              // 465
	(module.exports = function(O, key, val, safe){                                                               // 466
	  if(typeof val == 'function'){                                                                              // 467
	    hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));                                            // 468
	    if(!('name' in val))val.name = key;                                                                      // 469
	  }                                                                                                          // 470
	  if(O === global){                                                                                          // 471
	    O[key] = val;                                                                                            // 472
	  } else {                                                                                                   // 473
	    if(!safe)delete O[key];                                                                                  // 474
	    hide(O, key, val);                                                                                       // 475
	  }                                                                                                          // 476
	})(Function.prototype, TO_STRING, function toString(){                                                       // 477
	  return typeof this == 'function' && this[SRC] || $toString.call(this);                                     // 478
	});                                                                                                          // 479
                                                                                                              // 480
/***/ },                                                                                                      // 481
/* 13 */                                                                                                      // 482
/***/ function(module, exports) {                                                                             // 483
                                                                                                              // 484
	var id = 0                                                                                                   // 485
	  , px = Math.random();                                                                                      // 486
	module.exports = function(key){                                                                              // 487
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));                     // 488
	};                                                                                                           // 489
                                                                                                              // 490
/***/ },                                                                                                      // 491
/* 14 */                                                                                                      // 492
/***/ function(module, exports, __webpack_require__) {                                                        // 493
                                                                                                              // 494
	var global = __webpack_require__(4)                                                                          // 495
	  , SHARED = '__core-js_shared__'                                                                            // 496
	  , store  = global[SHARED] || (global[SHARED] = {});                                                        // 497
	module.exports = function(key){                                                                              // 498
	  return store[key] || (store[key] = {});                                                                    // 499
	};                                                                                                           // 500
                                                                                                              // 501
/***/ },                                                                                                      // 502
/* 15 */                                                                                                      // 503
/***/ function(module, exports, __webpack_require__) {                                                        // 504
                                                                                                              // 505
	var has  = __webpack_require__(5)                                                                            // 506
	  , hide = __webpack_require__(10)                                                                           // 507
	  , TAG  = __webpack_require__(16)('toStringTag');                                                           // 508
                                                                                                              // 509
	module.exports = function(it, tag, stat){                                                                    // 510
	  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);                                      // 511
	};                                                                                                           // 512
                                                                                                              // 513
/***/ },                                                                                                      // 514
/* 16 */                                                                                                      // 515
/***/ function(module, exports, __webpack_require__) {                                                        // 516
                                                                                                              // 517
	var store  = __webpack_require__(14)('wks')                                                                  // 518
	  , Symbol = __webpack_require__(4).Symbol;                                                                  // 519
	module.exports = function(name){                                                                             // 520
	  return store[name] || (store[name] =                                                                       // 521
	    Symbol && Symbol[name] || (Symbol || __webpack_require__(13))('Symbol.' + name));                        // 522
	};                                                                                                           // 523
                                                                                                              // 524
/***/ },                                                                                                      // 525
/* 17 */                                                                                                      // 526
/***/ function(module, exports, __webpack_require__) {                                                        // 527
                                                                                                              // 528
	var $         = __webpack_require__(3)                                                                       // 529
	  , toIObject = __webpack_require__(18);                                                                     // 530
	module.exports = function(object, el){                                                                       // 531
	  var O      = toIObject(object)                                                                             // 532
	    , keys   = $.getKeys(O)                                                                                  // 533
	    , length = keys.length                                                                                   // 534
	    , index  = 0                                                                                             // 535
	    , key;                                                                                                   // 536
	  while(length > index)if(O[key = keys[index++]] === el)return key;                                          // 537
	};                                                                                                           // 538
                                                                                                              // 539
/***/ },                                                                                                      // 540
/* 18 */                                                                                                      // 541
/***/ function(module, exports, __webpack_require__) {                                                        // 542
                                                                                                              // 543
	// to indexed object, toObject with fallback for non-array-like ES3 strings                                  // 544
	var IObject = __webpack_require__(19)                                                                        // 545
	  , defined = __webpack_require__(21);                                                                       // 546
	module.exports = function(it){                                                                               // 547
	  return IObject(defined(it));                                                                               // 548
	};                                                                                                           // 549
                                                                                                              // 550
/***/ },                                                                                                      // 551
/* 19 */                                                                                                      // 552
/***/ function(module, exports, __webpack_require__) {                                                        // 553
                                                                                                              // 554
	// indexed object, fallback for non-array-like ES3 strings                                                   // 555
	var cof = __webpack_require__(20);                                                                           // 556
	module.exports = 0 in Object('z') ? Object : function(it){                                                   // 557
	  return cof(it) == 'String' ? it.split('') : Object(it);                                                    // 558
	};                                                                                                           // 559
                                                                                                              // 560
/***/ },                                                                                                      // 561
/* 20 */                                                                                                      // 562
/***/ function(module, exports) {                                                                             // 563
                                                                                                              // 564
	var toString = {}.toString;                                                                                  // 565
                                                                                                              // 566
	module.exports = function(it){                                                                               // 567
	  return toString.call(it).slice(8, -1);                                                                     // 568
	};                                                                                                           // 569
                                                                                                              // 570
/***/ },                                                                                                      // 571
/* 21 */                                                                                                      // 572
/***/ function(module, exports) {                                                                             // 573
                                                                                                              // 574
	// 7.2.1 RequireObjectCoercible(argument)                                                                    // 575
	module.exports = function(it){                                                                               // 576
	  if(it == undefined)throw TypeError("Can't call method on  " + it);                                         // 577
	  return it;                                                                                                 // 578
	};                                                                                                           // 579
                                                                                                              // 580
/***/ },                                                                                                      // 581
/* 22 */                                                                                                      // 582
/***/ function(module, exports, __webpack_require__) {                                                        // 583
                                                                                                              // 584
	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window                                 // 585
	var toString  = {}.toString                                                                                  // 586
	  , toIObject = __webpack_require__(18)                                                                      // 587
	  , getNames  = __webpack_require__(3).getNames;                                                             // 588
                                                                                                              // 589
	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames                                    // 590
	  ? Object.getOwnPropertyNames(window) : [];                                                                 // 591
                                                                                                              // 592
	var getWindowNames = function(it){                                                                           // 593
	  try {                                                                                                      // 594
	    return getNames(it);                                                                                     // 595
	  } catch(e){                                                                                                // 596
	    return windowNames.slice();                                                                              // 597
	  }                                                                                                          // 598
	};                                                                                                           // 599
                                                                                                              // 600
	module.exports.get = function getOwnPropertyNames(it){                                                       // 601
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);                        // 602
	  return getNames(toIObject(it));                                                                            // 603
	};                                                                                                           // 604
                                                                                                              // 605
/***/ },                                                                                                      // 606
/* 23 */                                                                                                      // 607
/***/ function(module, exports, __webpack_require__) {                                                        // 608
                                                                                                              // 609
	// all enumerable object keys, includes symbols                                                              // 610
	var $ = __webpack_require__(3);                                                                              // 611
	module.exports = function(it){                                                                               // 612
	  var keys       = $.getKeys(it)                                                                             // 613
	    , getSymbols = $.getSymbols;                                                                             // 614
	  if(getSymbols){                                                                                            // 615
	    var symbols = getSymbols(it)                                                                             // 616
	      , isEnum  = $.isEnum                                                                                   // 617
	      , i       = 0                                                                                          // 618
	      , key;                                                                                                 // 619
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);                          // 620
	  }                                                                                                          // 621
	  return keys;                                                                                               // 622
	};                                                                                                           // 623
                                                                                                              // 624
/***/ },                                                                                                      // 625
/* 24 */                                                                                                      // 626
/***/ function(module, exports, __webpack_require__) {                                                        // 627
                                                                                                              // 628
	// 7.2.2 IsArray(argument)                                                                                   // 629
	var cof = __webpack_require__(20);                                                                           // 630
	module.exports = Array.isArray || function(arg){                                                             // 631
	  return cof(arg) == 'Array';                                                                                // 632
	};                                                                                                           // 633
                                                                                                              // 634
/***/ },                                                                                                      // 635
/* 25 */                                                                                                      // 636
/***/ function(module, exports) {                                                                             // 637
                                                                                                              // 638
	module.exports = function(it){                                                                               // 639
	  return typeof it === 'object' ? it !== null : typeof it === 'function';                                    // 640
	};                                                                                                           // 641
                                                                                                              // 642
/***/ },                                                                                                      // 643
/* 26 */                                                                                                      // 644
/***/ function(module, exports, __webpack_require__) {                                                        // 645
                                                                                                              // 646
	var isObject = __webpack_require__(25);                                                                      // 647
	module.exports = function(it){                                                                               // 648
	  if(!isObject(it))throw TypeError(it + ' is not an object!');                                               // 649
	  return it;                                                                                                 // 650
	};                                                                                                           // 651
                                                                                                              // 652
/***/ },                                                                                                      // 653
/* 27 */                                                                                                      // 654
/***/ function(module, exports) {                                                                             // 655
                                                                                                              // 656
	module.exports = false;                                                                                      // 657
                                                                                                              // 658
/***/ },                                                                                                      // 659
/* 28 */                                                                                                      // 660
/***/ function(module, exports, __webpack_require__) {                                                        // 661
                                                                                                              // 662
	// 19.1.3.1 Object.assign(target, source)                                                                    // 663
	var $def = __webpack_require__(8);                                                                           // 664
                                                                                                              // 665
	$def($def.S + $def.F, 'Object', {assign: __webpack_require__(29)});                                          // 666
                                                                                                              // 667
/***/ },                                                                                                      // 668
/* 29 */                                                                                                      // 669
/***/ function(module, exports, __webpack_require__) {                                                        // 670
                                                                                                              // 671
	// 19.1.2.1 Object.assign(target, source, ...)                                                               // 672
	var toObject = __webpack_require__(30)                                                                       // 673
	  , IObject  = __webpack_require__(19)                                                                       // 674
	  , enumKeys = __webpack_require__(23)                                                                       // 675
	  , has      = __webpack_require__(5);                                                                       // 676
                                                                                                              // 677
	// should work with symbols and should have deterministic property order (V8 bug)                            // 678
	module.exports = __webpack_require__(7)(function(){                                                          // 679
	  var a = Object.assign                                                                                      // 680
	    , A = {}                                                                                                 // 681
	    , B = {}                                                                                                 // 682
	    , S = Symbol()                                                                                           // 683
	    , K = 'abcdefghijklmnopqrst';                                                                            // 684
	  A[S] = 7;                                                                                                  // 685
	  K.split('').forEach(function(k){ B[k] = k; });                                                             // 686
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;                                            // 687
	}) ? function assign(target, source){   // eslint-disable-line no-unused-vars                                // 688
	  var T = toObject(target)                                                                                   // 689
	    , l = arguments.length                                                                                   // 690
	    , i = 1;                                                                                                 // 691
	  while(l > i){                                                                                              // 692
	    var S      = IObject(arguments[i++])                                                                     // 693
	      , keys   = enumKeys(S)                                                                                 // 694
	      , length = keys.length                                                                                 // 695
	      , j      = 0                                                                                           // 696
	      , key;                                                                                                 // 697
	    while(length > j)if(has(S, key = keys[j++]))T[key] = S[key];                                             // 698
	  }                                                                                                          // 699
	  return T;                                                                                                  // 700
	} : Object.assign;                                                                                           // 701
                                                                                                              // 702
/***/ },                                                                                                      // 703
/* 30 */                                                                                                      // 704
/***/ function(module, exports, __webpack_require__) {                                                        // 705
                                                                                                              // 706
	// 7.1.13 ToObject(argument)                                                                                 // 707
	var defined = __webpack_require__(21);                                                                       // 708
	module.exports = function(it){                                                                               // 709
	  return Object(defined(it));                                                                                // 710
	};                                                                                                           // 711
                                                                                                              // 712
/***/ },                                                                                                      // 713
/* 31 */                                                                                                      // 714
/***/ function(module, exports, __webpack_require__) {                                                        // 715
                                                                                                              // 716
	// 19.1.3.10 Object.is(value1, value2)                                                                       // 717
	var $def = __webpack_require__(8);                                                                           // 718
	$def($def.S, 'Object', {                                                                                     // 719
	  is: __webpack_require__(32)                                                                                // 720
	});                                                                                                          // 721
                                                                                                              // 722
/***/ },                                                                                                      // 723
/* 32 */                                                                                                      // 724
/***/ function(module, exports) {                                                                             // 725
                                                                                                              // 726
	module.exports = Object.is || function is(x, y){                                                             // 727
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;                                            // 728
	};                                                                                                           // 729
                                                                                                              // 730
/***/ },                                                                                                      // 731
/* 33 */                                                                                                      // 732
/***/ function(module, exports, __webpack_require__) {                                                        // 733
                                                                                                              // 734
	// 19.1.3.19 Object.setPrototypeOf(O, proto)                                                                 // 735
	var $def = __webpack_require__(8);                                                                           // 736
	$def($def.S, 'Object', {setPrototypeOf: __webpack_require__(34).set});                                       // 737
                                                                                                              // 738
/***/ },                                                                                                      // 739
/* 34 */                                                                                                      // 740
/***/ function(module, exports, __webpack_require__) {                                                        // 741
                                                                                                              // 742
	// Works with __proto__ only. Old v8 can't work with null proto objects.                                     // 743
	/* eslint-disable no-proto */                                                                                // 744
	var getDesc  = __webpack_require__(3).getDesc                                                                // 745
	  , isObject = __webpack_require__(25)                                                                       // 746
	  , anObject = __webpack_require__(26);                                                                      // 747
	var check = function(O, proto){                                                                              // 748
	  anObject(O);                                                                                               // 749
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");                // 750
	};                                                                                                           // 751
	module.exports = {                                                                                           // 752
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line no-proto                         // 753
	    function(test, buggy, set){                                                                              // 754
	      try {                                                                                                  // 755
	        set = __webpack_require__(35)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);         // 756
	        set(test, []);                                                                                       // 757
	        buggy = !(test instanceof Array);                                                                    // 758
	      } catch(e){ buggy = true; }                                                                            // 759
	      return function setPrototypeOf(O, proto){                                                              // 760
	        check(O, proto);                                                                                     // 761
	        if(buggy)O.__proto__ = proto;                                                                        // 762
	        else set(O, proto);                                                                                  // 763
	        return O;                                                                                            // 764
	      };                                                                                                     // 765
	    }({}, false) : undefined),                                                                               // 766
	  check: check                                                                                               // 767
	};                                                                                                           // 768
                                                                                                              // 769
/***/ },                                                                                                      // 770
/* 35 */                                                                                                      // 771
/***/ function(module, exports, __webpack_require__) {                                                        // 772
                                                                                                              // 773
	// optional / simple context binding                                                                         // 774
	var aFunction = __webpack_require__(36);                                                                     // 775
	module.exports = function(fn, that, length){                                                                 // 776
	  aFunction(fn);                                                                                             // 777
	  if(that === undefined)return fn;                                                                           // 778
	  switch(length){                                                                                            // 779
	    case 1: return function(a){                                                                              // 780
	      return fn.call(that, a);                                                                               // 781
	    };                                                                                                       // 782
	    case 2: return function(a, b){                                                                           // 783
	      return fn.call(that, a, b);                                                                            // 784
	    };                                                                                                       // 785
	    case 3: return function(a, b, c){                                                                        // 786
	      return fn.call(that, a, b, c);                                                                         // 787
	    };                                                                                                       // 788
	  }                                                                                                          // 789
	  return function(/* ...args */){                                                                            // 790
	    return fn.apply(that, arguments);                                                                        // 791
	  };                                                                                                         // 792
	};                                                                                                           // 793
                                                                                                              // 794
/***/ },                                                                                                      // 795
/* 36 */                                                                                                      // 796
/***/ function(module, exports) {                                                                             // 797
                                                                                                              // 798
	module.exports = function(it){                                                                               // 799
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');                                    // 800
	  return it;                                                                                                 // 801
	};                                                                                                           // 802
                                                                                                              // 803
/***/ },                                                                                                      // 804
/* 37 */                                                                                                      // 805
/***/ function(module, exports, __webpack_require__) {                                                        // 806
                                                                                                              // 807
	'use strict';                                                                                                // 808
	// 19.1.3.6 Object.prototype.toString()                                                                      // 809
	var classof = __webpack_require__(38)                                                                        // 810
	  , test    = {};                                                                                            // 811
	test[__webpack_require__(16)('toStringTag')] = 'z';                                                          // 812
	if(test + '' != '[object z]'){                                                                               // 813
	  __webpack_require__(12)(Object.prototype, 'toString', function toString(){                                 // 814
	    return '[object ' + classof(this) + ']';                                                                 // 815
	  }, true);                                                                                                  // 816
	}                                                                                                            // 817
                                                                                                              // 818
/***/ },                                                                                                      // 819
/* 38 */                                                                                                      // 820
/***/ function(module, exports, __webpack_require__) {                                                        // 821
                                                                                                              // 822
	// getting tag from 19.1.3.6 Object.prototype.toString()                                                     // 823
	var cof = __webpack_require__(20)                                                                            // 824
	  , TAG = __webpack_require__(16)('toStringTag')                                                             // 825
	  // ES3 wrong here                                                                                          // 826
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';                                             // 827
                                                                                                              // 828
	module.exports = function(it){                                                                               // 829
	  var O, T, B;                                                                                               // 830
	  return it === undefined ? 'Undefined' : it === null ? 'Null'                                               // 831
	    // @@toStringTag case                                                                                    // 832
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T                                                     // 833
	    // builtinTag case                                                                                       // 834
	    : ARG ? cof(O)                                                                                           // 835
	    // ES3 arguments fallback                                                                                // 836
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;                           // 837
	};                                                                                                           // 838
                                                                                                              // 839
/***/ },                                                                                                      // 840
/* 39 */                                                                                                      // 841
/***/ function(module, exports, __webpack_require__) {                                                        // 842
                                                                                                              // 843
	// 19.1.2.5 Object.freeze(O)                                                                                 // 844
	var isObject = __webpack_require__(25);                                                                      // 845
                                                                                                              // 846
	__webpack_require__(40)('freeze', function($freeze){                                                         // 847
	  return function freeze(it){                                                                                // 848
	    return $freeze && isObject(it) ? $freeze(it) : it;                                                       // 849
	  };                                                                                                         // 850
	});                                                                                                          // 851
                                                                                                              // 852
/***/ },                                                                                                      // 853
/* 40 */                                                                                                      // 854
/***/ function(module, exports, __webpack_require__) {                                                        // 855
                                                                                                              // 856
	// most Object methods by ES6 should accept primitives                                                       // 857
	module.exports = function(KEY, exec){                                                                        // 858
	  var $def = __webpack_require__(8)                                                                          // 859
	    , fn   = (__webpack_require__(9).Object || {})[KEY] || Object[KEY]                                       // 860
	    , exp  = {};                                                                                             // 861
	  exp[KEY] = exec(fn);                                                                                       // 862
	  $def($def.S + $def.F * __webpack_require__(7)(function(){ fn(1); }), 'Object', exp);                       // 863
	};                                                                                                           // 864
                                                                                                              // 865
/***/ },                                                                                                      // 866
/* 41 */                                                                                                      // 867
/***/ function(module, exports, __webpack_require__) {                                                        // 868
                                                                                                              // 869
	// 19.1.2.17 Object.seal(O)                                                                                  // 870
	var isObject = __webpack_require__(25);                                                                      // 871
                                                                                                              // 872
	__webpack_require__(40)('seal', function($seal){                                                             // 873
	  return function seal(it){                                                                                  // 874
	    return $seal && isObject(it) ? $seal(it) : it;                                                           // 875
	  };                                                                                                         // 876
	});                                                                                                          // 877
                                                                                                              // 878
/***/ },                                                                                                      // 879
/* 42 */                                                                                                      // 880
/***/ function(module, exports, __webpack_require__) {                                                        // 881
                                                                                                              // 882
	// 19.1.2.15 Object.preventExtensions(O)                                                                     // 883
	var isObject = __webpack_require__(25);                                                                      // 884
                                                                                                              // 885
	__webpack_require__(40)('preventExtensions', function($preventExtensions){                                   // 886
	  return function preventExtensions(it){                                                                     // 887
	    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;                                 // 888
	  };                                                                                                         // 889
	});                                                                                                          // 890
                                                                                                              // 891
/***/ },                                                                                                      // 892
/* 43 */                                                                                                      // 893
/***/ function(module, exports, __webpack_require__) {                                                        // 894
                                                                                                              // 895
	// 19.1.2.12 Object.isFrozen(O)                                                                              // 896
	var isObject = __webpack_require__(25);                                                                      // 897
                                                                                                              // 898
	__webpack_require__(40)('isFrozen', function($isFrozen){                                                     // 899
	  return function isFrozen(it){                                                                              // 900
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;                                          // 901
	  };                                                                                                         // 902
	});                                                                                                          // 903
                                                                                                              // 904
/***/ },                                                                                                      // 905
/* 44 */                                                                                                      // 906
/***/ function(module, exports, __webpack_require__) {                                                        // 907
                                                                                                              // 908
	// 19.1.2.13 Object.isSealed(O)                                                                              // 909
	var isObject = __webpack_require__(25);                                                                      // 910
                                                                                                              // 911
	__webpack_require__(40)('isSealed', function($isSealed){                                                     // 912
	  return function isSealed(it){                                                                              // 913
	    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;                                          // 914
	  };                                                                                                         // 915
	});                                                                                                          // 916
                                                                                                              // 917
/***/ },                                                                                                      // 918
/* 45 */                                                                                                      // 919
/***/ function(module, exports, __webpack_require__) {                                                        // 920
                                                                                                              // 921
	// 19.1.2.11 Object.isExtensible(O)                                                                          // 922
	var isObject = __webpack_require__(25);                                                                      // 923
                                                                                                              // 924
	__webpack_require__(40)('isExtensible', function($isExtensible){                                             // 925
	  return function isExtensible(it){                                                                          // 926
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;                                  // 927
	  };                                                                                                         // 928
	});                                                                                                          // 929
                                                                                                              // 930
/***/ },                                                                                                      // 931
/* 46 */                                                                                                      // 932
/***/ function(module, exports, __webpack_require__) {                                                        // 933
                                                                                                              // 934
	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)                                                            // 935
	var toIObject = __webpack_require__(18);                                                                     // 936
                                                                                                              // 937
	__webpack_require__(40)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){                     // 938
	  return function getOwnPropertyDescriptor(it, key){                                                         // 939
	    return $getOwnPropertyDescriptor(toIObject(it), key);                                                    // 940
	  };                                                                                                         // 941
	});                                                                                                          // 942
                                                                                                              // 943
/***/ },                                                                                                      // 944
/* 47 */                                                                                                      // 945
/***/ function(module, exports, __webpack_require__) {                                                        // 946
                                                                                                              // 947
	// 19.1.2.9 Object.getPrototypeOf(O)                                                                         // 948
	var toObject = __webpack_require__(30);                                                                      // 949
                                                                                                              // 950
	__webpack_require__(40)('getPrototypeOf', function($getPrototypeOf){                                         // 951
	  return function getPrototypeOf(it){                                                                        // 952
	    return $getPrototypeOf(toObject(it));                                                                    // 953
	  };                                                                                                         // 954
	});                                                                                                          // 955
                                                                                                              // 956
/***/ },                                                                                                      // 957
/* 48 */                                                                                                      // 958
/***/ function(module, exports, __webpack_require__) {                                                        // 959
                                                                                                              // 960
	// 19.1.2.14 Object.keys(O)                                                                                  // 961
	var toObject = __webpack_require__(30);                                                                      // 962
                                                                                                              // 963
	__webpack_require__(40)('keys', function($keys){                                                             // 964
	  return function keys(it){                                                                                  // 965
	    return $keys(toObject(it));                                                                              // 966
	  };                                                                                                         // 967
	});                                                                                                          // 968
                                                                                                              // 969
/***/ },                                                                                                      // 970
/* 49 */                                                                                                      // 971
/***/ function(module, exports, __webpack_require__) {                                                        // 972
                                                                                                              // 973
	// 19.1.2.7 Object.getOwnPropertyNames(O)                                                                    // 974
	__webpack_require__(40)('getOwnPropertyNames', function(){                                                   // 975
	  return __webpack_require__(22).get;                                                                        // 976
	});                                                                                                          // 977
                                                                                                              // 978
/***/ },                                                                                                      // 979
/* 50 */                                                                                                      // 980
/***/ function(module, exports, __webpack_require__) {                                                        // 981
                                                                                                              // 982
	__webpack_require__(51);                                                                                     // 983
	__webpack_require__(57);                                                                                     // 984
	__webpack_require__(63);                                                                                     // 985
	__webpack_require__(64);                                                                                     // 986
	__webpack_require__(66);                                                                                     // 987
	__webpack_require__(69);                                                                                     // 988
	__webpack_require__(72);                                                                                     // 989
	__webpack_require__(74);                                                                                     // 990
	__webpack_require__(76);                                                                                     // 991
	module.exports = __webpack_require__(9).Array;                                                               // 992
                                                                                                              // 993
/***/ },                                                                                                      // 994
/* 51 */                                                                                                      // 995
/***/ function(module, exports, __webpack_require__) {                                                        // 996
                                                                                                              // 997
	'use strict';                                                                                                // 998
	var $at  = __webpack_require__(52)(true);                                                                    // 999
                                                                                                              // 1000
	// 21.1.3.27 String.prototype[@@iterator]()                                                                  // 1001
	__webpack_require__(54)(String, 'String', function(iterated){                                                // 1002
	  this._t = String(iterated); // target                                                                      // 1003
	  this._i = 0;                // next index                                                                  // 1004
	// 21.1.5.2.1 %StringIteratorPrototype%.next()                                                               // 1005
	}, function(){                                                                                               // 1006
	  var O     = this._t                                                                                        // 1007
	    , index = this._i                                                                                        // 1008
	    , point;                                                                                                 // 1009
	  if(index >= O.length)return {value: undefined, done: true};                                                // 1010
	  point = $at(O, index);                                                                                     // 1011
	  this._i += point.length;                                                                                   // 1012
	  return {value: point, done: false};                                                                        // 1013
	});                                                                                                          // 1014
                                                                                                              // 1015
/***/ },                                                                                                      // 1016
/* 52 */                                                                                                      // 1017
/***/ function(module, exports, __webpack_require__) {                                                        // 1018
                                                                                                              // 1019
	// true  -> String#at                                                                                        // 1020
	// false -> String#codePointAt                                                                               // 1021
	var toInteger = __webpack_require__(53)                                                                      // 1022
	  , defined   = __webpack_require__(21);                                                                     // 1023
	module.exports = function(TO_STRING){                                                                        // 1024
	  return function(that, pos){                                                                                // 1025
	    var s = String(defined(that))                                                                            // 1026
	      , i = toInteger(pos)                                                                                   // 1027
	      , l = s.length                                                                                         // 1028
	      , a, b;                                                                                                // 1029
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;                                                    // 1030
	    a = s.charCodeAt(i);                                                                                     // 1031
	    return a < 0xd800 || a > 0xdbff || i + 1 === l                                                           // 1032
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff                                                    // 1033
	        ? TO_STRING ? s.charAt(i) : a                                                                        // 1034
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;                       // 1035
	  };                                                                                                         // 1036
	};                                                                                                           // 1037
                                                                                                              // 1038
/***/ },                                                                                                      // 1039
/* 53 */                                                                                                      // 1040
/***/ function(module, exports) {                                                                             // 1041
                                                                                                              // 1042
	// 7.1.4 ToInteger                                                                                           // 1043
	var ceil  = Math.ceil                                                                                        // 1044
	  , floor = Math.floor;                                                                                      // 1045
	module.exports = function(it){                                                                               // 1046
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);                                                  // 1047
	};                                                                                                           // 1048
                                                                                                              // 1049
/***/ },                                                                                                      // 1050
/* 54 */                                                                                                      // 1051
/***/ function(module, exports, __webpack_require__) {                                                        // 1052
                                                                                                              // 1053
	'use strict';                                                                                                // 1054
	var LIBRARY         = __webpack_require__(27)                                                                // 1055
	  , $def            = __webpack_require__(8)                                                                 // 1056
	  , $redef          = __webpack_require__(12)                                                                // 1057
	  , hide            = __webpack_require__(10)                                                                // 1058
	  , has             = __webpack_require__(5)                                                                 // 1059
	  , SYMBOL_ITERATOR = __webpack_require__(16)('iterator')                                                    // 1060
	  , Iterators       = __webpack_require__(55)                                                                // 1061
	  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`             // 1062
	  , FF_ITERATOR     = '@@iterator'                                                                           // 1063
	  , KEYS            = 'keys'                                                                                 // 1064
	  , VALUES          = 'values';                                                                              // 1065
	var returnThis = function(){ return this; };                                                                 // 1066
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){                            // 1067
	  __webpack_require__(56)(Constructor, NAME, next);                                                          // 1068
	  var createMethod = function(kind){                                                                         // 1069
	    switch(kind){                                                                                            // 1070
	      case KEYS: return function keys(){ return new Constructor(this, kind); };                              // 1071
	      case VALUES: return function values(){ return new Constructor(this, kind); };                          // 1072
	    } return function entries(){ return new Constructor(this, kind); };                                      // 1073
	  };                                                                                                         // 1074
	  var TAG      = NAME + ' Iterator'                                                                          // 1075
	    , proto    = Base.prototype                                                                              // 1076
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]                   // 1077
	    , _default = _native || createMethod(DEFAULT)                                                            // 1078
	    , methods, key;                                                                                          // 1079
	  // Fix native                                                                                              // 1080
	  if(_native){                                                                                               // 1081
	    var IteratorPrototype = __webpack_require__(3).getProto(_default.call(new Base));                        // 1082
	    // Set @@toStringTag to native iterators                                                                 // 1083
	    __webpack_require__(15)(IteratorPrototype, TAG, true);                                                   // 1084
	    // FF fix                                                                                                // 1085
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);             // 1086
	  }                                                                                                          // 1087
	  // Define iterator                                                                                         // 1088
	  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);                                               // 1089
	  // Plug for library                                                                                        // 1090
	  Iterators[NAME] = _default;                                                                                // 1091
	  Iterators[TAG]  = returnThis;                                                                              // 1092
	  if(DEFAULT){                                                                                               // 1093
	    methods = {                                                                                              // 1094
	      keys:    IS_SET            ? _default : createMethod(KEYS),                                            // 1095
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),                                          // 1096
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')                                        // 1097
	    };                                                                                                       // 1098
	    if(FORCE)for(key in methods){                                                                            // 1099
	      if(!(key in proto))$redef(proto, key, methods[key]);                                                   // 1100
	    } else $def($def.P + $def.F * BUGGY, NAME, methods);                                                     // 1101
	  }                                                                                                          // 1102
	};                                                                                                           // 1103
                                                                                                              // 1104
/***/ },                                                                                                      // 1105
/* 55 */                                                                                                      // 1106
/***/ function(module, exports) {                                                                             // 1107
                                                                                                              // 1108
	module.exports = {};                                                                                         // 1109
                                                                                                              // 1110
/***/ },                                                                                                      // 1111
/* 56 */                                                                                                      // 1112
/***/ function(module, exports, __webpack_require__) {                                                        // 1113
                                                                                                              // 1114
	'use strict';                                                                                                // 1115
	var $ = __webpack_require__(3)                                                                               // 1116
	  , IteratorPrototype = {};                                                                                  // 1117
                                                                                                              // 1118
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()                                                              // 1119
	__webpack_require__(10)(IteratorPrototype, __webpack_require__(16)('iterator'), function(){ return this; });
                                                                                                              // 1121
	module.exports = function(Constructor, NAME, next){                                                          // 1122
	  Constructor.prototype = $.create(IteratorPrototype, {next: __webpack_require__(11)(1,next)});              // 1123
	  __webpack_require__(15)(Constructor, NAME + ' Iterator');                                                  // 1124
	};                                                                                                           // 1125
                                                                                                              // 1126
/***/ },                                                                                                      // 1127
/* 57 */                                                                                                      // 1128
/***/ function(module, exports, __webpack_require__) {                                                        // 1129
                                                                                                              // 1130
	'use strict';                                                                                                // 1131
	var ctx         = __webpack_require__(35)                                                                    // 1132
	  , $def        = __webpack_require__(8)                                                                     // 1133
	  , toObject    = __webpack_require__(30)                                                                    // 1134
	  , call        = __webpack_require__(58)                                                                    // 1135
	  , isArrayIter = __webpack_require__(59)                                                                    // 1136
	  , toLength    = __webpack_require__(60)                                                                    // 1137
	  , getIterFn   = __webpack_require__(61);                                                                   // 1138
	$def($def.S + $def.F * !__webpack_require__(62)(function(iter){ Array.from(iter); }), 'Array', {             // 1139
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)                                  // 1140
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){                                // 1141
	    var O       = toObject(arrayLike)                                                                        // 1142
	      , C       = typeof this == 'function' ? this : Array                                                   // 1143
	      , mapfn   = arguments[1]                                                                               // 1144
	      , mapping = mapfn !== undefined                                                                        // 1145
	      , index   = 0                                                                                          // 1146
	      , iterFn  = getIterFn(O)                                                                               // 1147
	      , length, result, step, iterator;                                                                      // 1148
	    if(mapping)mapfn = ctx(mapfn, arguments[2], 2);                                                          // 1149
	    // if object isn't iterable or it's array with default iterator - use simple case                        // 1150
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){                                         // 1151
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){               // 1152
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;             // 1153
	      }                                                                                                      // 1154
	    } else {                                                                                                 // 1155
	      length = toLength(O.length);                                                                           // 1156
	      for(result = new C(length); length > index; index++){                                                  // 1157
	        result[index] = mapping ? mapfn(O[index], index) : O[index];                                         // 1158
	      }                                                                                                      // 1159
	    }                                                                                                        // 1160
	    result.length = index;                                                                                   // 1161
	    return result;                                                                                           // 1162
	  }                                                                                                          // 1163
	});                                                                                                          // 1164
                                                                                                              // 1165
                                                                                                              // 1166
/***/ },                                                                                                      // 1167
/* 58 */                                                                                                      // 1168
/***/ function(module, exports, __webpack_require__) {                                                        // 1169
                                                                                                              // 1170
	// call something on iterator step with safe closing on error                                                // 1171
	var anObject = __webpack_require__(26);                                                                      // 1172
	module.exports = function(iterator, fn, value, entries){                                                     // 1173
	  try {                                                                                                      // 1174
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);                                           // 1175
	  // 7.4.6 IteratorClose(iterator, completion)                                                               // 1176
	  } catch(e){                                                                                                // 1177
	    var ret = iterator['return'];                                                                            // 1178
	    if(ret !== undefined)anObject(ret.call(iterator));                                                       // 1179
	    throw e;                                                                                                 // 1180
	  }                                                                                                          // 1181
	};                                                                                                           // 1182
                                                                                                              // 1183
/***/ },                                                                                                      // 1184
/* 59 */                                                                                                      // 1185
/***/ function(module, exports, __webpack_require__) {                                                        // 1186
                                                                                                              // 1187
	// check on default Array iterator                                                                           // 1188
	var Iterators = __webpack_require__(55)                                                                      // 1189
	  , ITERATOR  = __webpack_require__(16)('iterator');                                                         // 1190
	module.exports = function(it){                                                                               // 1191
	  return (Iterators.Array || Array.prototype[ITERATOR]) === it;                                              // 1192
	};                                                                                                           // 1193
                                                                                                              // 1194
/***/ },                                                                                                      // 1195
/* 60 */                                                                                                      // 1196
/***/ function(module, exports, __webpack_require__) {                                                        // 1197
                                                                                                              // 1198
	// 7.1.15 ToLength                                                                                           // 1199
	var toInteger = __webpack_require__(53)                                                                      // 1200
	  , min       = Math.min;                                                                                    // 1201
	module.exports = function(it){                                                                               // 1202
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991            // 1203
	};                                                                                                           // 1204
                                                                                                              // 1205
/***/ },                                                                                                      // 1206
/* 61 */                                                                                                      // 1207
/***/ function(module, exports, __webpack_require__) {                                                        // 1208
                                                                                                              // 1209
	var classof   = __webpack_require__(38)                                                                      // 1210
	  , ITERATOR  = __webpack_require__(16)('iterator')                                                          // 1211
	  , Iterators = __webpack_require__(55);                                                                     // 1212
	module.exports = __webpack_require__(9).getIteratorMethod = function(it){                                    // 1213
	  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];                      // 1214
	};                                                                                                           // 1215
                                                                                                              // 1216
/***/ },                                                                                                      // 1217
/* 62 */                                                                                                      // 1218
/***/ function(module, exports, __webpack_require__) {                                                        // 1219
                                                                                                              // 1220
	var SYMBOL_ITERATOR = __webpack_require__(16)('iterator')                                                    // 1221
	  , SAFE_CLOSING    = false;                                                                                 // 1222
	try {                                                                                                        // 1223
	  var riter = [7][SYMBOL_ITERATOR]();                                                                        // 1224
	  riter['return'] = function(){ SAFE_CLOSING = true; };                                                      // 1225
	  Array.from(riter, function(){ throw 2; });                                                                 // 1226
	} catch(e){ /* empty */ }                                                                                    // 1227
	module.exports = function(exec){                                                                             // 1228
	  if(!SAFE_CLOSING)return false;                                                                             // 1229
	  var safe = false;                                                                                          // 1230
	  try {                                                                                                      // 1231
	    var arr  = [7]                                                                                           // 1232
	      , iter = arr[SYMBOL_ITERATOR]();                                                                       // 1233
	    iter.next = function(){ safe = true; };                                                                  // 1234
	    arr[SYMBOL_ITERATOR] = function(){ return iter; };                                                       // 1235
	    exec(arr);                                                                                               // 1236
	  } catch(e){ /* empty */ }                                                                                  // 1237
	  return safe;                                                                                               // 1238
	};                                                                                                           // 1239
                                                                                                              // 1240
/***/ },                                                                                                      // 1241
/* 63 */                                                                                                      // 1242
/***/ function(module, exports, __webpack_require__) {                                                        // 1243
                                                                                                              // 1244
	'use strict';                                                                                                // 1245
	var $def = __webpack_require__(8);                                                                           // 1246
                                                                                                              // 1247
	// WebKit Array.of isn't generic                                                                             // 1248
	$def($def.S + $def.F * __webpack_require__(7)(function(){                                                    // 1249
	  function F(){}                                                                                             // 1250
	  return !(Array.of.call(F) instanceof F);                                                                   // 1251
	}), 'Array', {                                                                                               // 1252
	  // 22.1.2.3 Array.of( ...items)                                                                            // 1253
	  of: function of(/* ...args */){                                                                            // 1254
	    var index  = 0                                                                                           // 1255
	      , length = arguments.length                                                                            // 1256
	      , result = new (typeof this == 'function' ? this : Array)(length);                                     // 1257
	    while(length > index)result[index] = arguments[index++];                                                 // 1258
	    result.length = length;                                                                                  // 1259
	    return result;                                                                                           // 1260
	  }                                                                                                          // 1261
	});                                                                                                          // 1262
                                                                                                              // 1263
/***/ },                                                                                                      // 1264
/* 64 */                                                                                                      // 1265
/***/ function(module, exports, __webpack_require__) {                                                        // 1266
                                                                                                              // 1267
	__webpack_require__(65)(Array);                                                                              // 1268
                                                                                                              // 1269
/***/ },                                                                                                      // 1270
/* 65 */                                                                                                      // 1271
/***/ function(module, exports, __webpack_require__) {                                                        // 1272
                                                                                                              // 1273
	'use strict';                                                                                                // 1274
	var $       = __webpack_require__(3)                                                                         // 1275
	  , SPECIES = __webpack_require__(16)('species');                                                            // 1276
	module.exports = function(C){                                                                                // 1277
	  if(__webpack_require__(6) && !(SPECIES in C))$.setDesc(C, SPECIES, {                                       // 1278
	    configurable: true,                                                                                      // 1279
	    get: function(){ return this; }                                                                          // 1280
	  });                                                                                                        // 1281
	};                                                                                                           // 1282
                                                                                                              // 1283
/***/ },                                                                                                      // 1284
/* 66 */                                                                                                      // 1285
/***/ function(module, exports, __webpack_require__) {                                                        // 1286
                                                                                                              // 1287
	'use strict';                                                                                                // 1288
	var setUnscope = __webpack_require__(67)                                                                     // 1289
	  , step       = __webpack_require__(68)                                                                     // 1290
	  , Iterators  = __webpack_require__(55)                                                                     // 1291
	  , toIObject  = __webpack_require__(18);                                                                    // 1292
                                                                                                              // 1293
	// 22.1.3.4 Array.prototype.entries()                                                                        // 1294
	// 22.1.3.13 Array.prototype.keys()                                                                          // 1295
	// 22.1.3.29 Array.prototype.values()                                                                        // 1296
	// 22.1.3.30 Array.prototype[@@iterator]()                                                                   // 1297
	__webpack_require__(54)(Array, 'Array', function(iterated, kind){                                            // 1298
	  this._t = toIObject(iterated); // target                                                                   // 1299
	  this._i = 0;                   // next index                                                               // 1300
	  this._k = kind;                // kind                                                                     // 1301
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()                                                                // 1302
	}, function(){                                                                                               // 1303
	  var O     = this._t                                                                                        // 1304
	    , kind  = this._k                                                                                        // 1305
	    , index = this._i++;                                                                                     // 1306
	  if(!O || index >= O.length){                                                                               // 1307
	    this._t = undefined;                                                                                     // 1308
	    return step(1);                                                                                          // 1309
	  }                                                                                                          // 1310
	  if(kind == 'keys'  )return step(0, index);                                                                 // 1311
	  if(kind == 'values')return step(0, O[index]);                                                              // 1312
	  return step(0, [index, O[index]]);                                                                         // 1313
	}, 'values');                                                                                                // 1314
                                                                                                              // 1315
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)                                       // 1316
	Iterators.Arguments = Iterators.Array;                                                                       // 1317
                                                                                                              // 1318
	setUnscope('keys');                                                                                          // 1319
	setUnscope('values');                                                                                        // 1320
	setUnscope('entries');                                                                                       // 1321
                                                                                                              // 1322
/***/ },                                                                                                      // 1323
/* 67 */                                                                                                      // 1324
/***/ function(module, exports, __webpack_require__) {                                                        // 1325
                                                                                                              // 1326
	// 22.1.3.31 Array.prototype[@@unscopables]                                                                  // 1327
	var UNSCOPABLES = __webpack_require__(16)('unscopables');                                                    // 1328
	if([][UNSCOPABLES] == undefined)__webpack_require__(10)(Array.prototype, UNSCOPABLES, {});                   // 1329
	module.exports = function(key){                                                                              // 1330
	  [][UNSCOPABLES][key] = true;                                                                               // 1331
	};                                                                                                           // 1332
                                                                                                              // 1333
/***/ },                                                                                                      // 1334
/* 68 */                                                                                                      // 1335
/***/ function(module, exports) {                                                                             // 1336
                                                                                                              // 1337
	module.exports = function(done, value){                                                                      // 1338
	  return {value: value, done: !!done};                                                                       // 1339
	};                                                                                                           // 1340
                                                                                                              // 1341
/***/ },                                                                                                      // 1342
/* 69 */                                                                                                      // 1343
/***/ function(module, exports, __webpack_require__) {                                                        // 1344
                                                                                                              // 1345
	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)                                     // 1346
	'use strict';                                                                                                // 1347
	var $def = __webpack_require__(8);                                                                           // 1348
                                                                                                              // 1349
	$def($def.P, 'Array', {copyWithin: __webpack_require__(70)});                                                // 1350
                                                                                                              // 1351
	__webpack_require__(67)('copyWithin');                                                                       // 1352
                                                                                                              // 1353
/***/ },                                                                                                      // 1354
/* 70 */                                                                                                      // 1355
/***/ function(module, exports, __webpack_require__) {                                                        // 1356
                                                                                                              // 1357
	// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)                                     // 1358
	'use strict';                                                                                                // 1359
	var toObject = __webpack_require__(30)                                                                       // 1360
	  , toIndex  = __webpack_require__(71)                                                                       // 1361
	  , toLength = __webpack_require__(60);                                                                      // 1362
                                                                                                              // 1363
	module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){           // 1364
	  var O     = toObject(this)                                                                                 // 1365
	    , len   = toLength(O.length)                                                                             // 1366
	    , to    = toIndex(target, len)                                                                           // 1367
	    , from  = toIndex(start, len)                                                                            // 1368
	    , end   = arguments[2]                                                                                   // 1369
	    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)                       // 1370
	    , inc   = 1;                                                                                             // 1371
	  if(from < to && to < from + count){                                                                        // 1372
	    inc  = -1;                                                                                               // 1373
	    from += count - 1;                                                                                       // 1374
	    to   += count - 1;                                                                                       // 1375
	  }                                                                                                          // 1376
	  while(count-- > 0){                                                                                        // 1377
	    if(from in O)O[to] = O[from];                                                                            // 1378
	    else delete O[to];                                                                                       // 1379
	    to   += inc;                                                                                             // 1380
	    from += inc;                                                                                             // 1381
	  } return O;                                                                                                // 1382
	};                                                                                                           // 1383
                                                                                                              // 1384
/***/ },                                                                                                      // 1385
/* 71 */                                                                                                      // 1386
/***/ function(module, exports, __webpack_require__) {                                                        // 1387
                                                                                                              // 1388
	var toInteger = __webpack_require__(53)                                                                      // 1389
	  , max       = Math.max                                                                                     // 1390
	  , min       = Math.min;                                                                                    // 1391
	module.exports = function(index, length){                                                                    // 1392
	  index = toInteger(index);                                                                                  // 1393
	  return index < 0 ? max(index + length, 0) : min(index, length);                                            // 1394
	};                                                                                                           // 1395
                                                                                                              // 1396
/***/ },                                                                                                      // 1397
/* 72 */                                                                                                      // 1398
/***/ function(module, exports, __webpack_require__) {                                                        // 1399
                                                                                                              // 1400
	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)                                        // 1401
	var $def = __webpack_require__(8);                                                                           // 1402
                                                                                                              // 1403
	$def($def.P, 'Array', {fill: __webpack_require__(73)});                                                      // 1404
                                                                                                              // 1405
	__webpack_require__(67)('fill');                                                                             // 1406
                                                                                                              // 1407
/***/ },                                                                                                      // 1408
/* 73 */                                                                                                      // 1409
/***/ function(module, exports, __webpack_require__) {                                                        // 1410
                                                                                                              // 1411
	// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)                                        // 1412
	'use strict';                                                                                                // 1413
	var toObject = __webpack_require__(30)                                                                       // 1414
	  , toIndex  = __webpack_require__(71)                                                                       // 1415
	  , toLength = __webpack_require__(60);                                                                      // 1416
	module.exports = [].fill || function fill(value /*, start = 0, end = @length */){                            // 1417
	  var O      = toObject(this, true)                                                                          // 1418
	    , length = toLength(O.length)                                                                            // 1419
	    , index  = toIndex(arguments[1], length)                                                                 // 1420
	    , end    = arguments[2]                                                                                  // 1421
	    , endPos = end === undefined ? length : toIndex(end, length);                                            // 1422
	  while(endPos > index)O[index++] = value;                                                                   // 1423
	  return O;                                                                                                  // 1424
	};                                                                                                           // 1425
                                                                                                              // 1426
/***/ },                                                                                                      // 1427
/* 74 */                                                                                                      // 1428
/***/ function(module, exports, __webpack_require__) {                                                        // 1429
                                                                                                              // 1430
	'use strict';                                                                                                // 1431
	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)                                             // 1432
	var KEY    = 'find'                                                                                          // 1433
	  , $def   = __webpack_require__(8)                                                                          // 1434
	  , forced = true                                                                                            // 1435
	  , $find  = __webpack_require__(75)(5);                                                                     // 1436
	// Shouldn't skip holes                                                                                      // 1437
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });                                                   // 1438
	$def($def.P + $def.F * forced, 'Array', {                                                                    // 1439
	  find: function find(callbackfn/*, that = undefined */){                                                    // 1440
	    return $find(this, callbackfn, arguments[1]);                                                            // 1441
	  }                                                                                                          // 1442
	});                                                                                                          // 1443
	__webpack_require__(67)(KEY);                                                                                // 1444
                                                                                                              // 1445
/***/ },                                                                                                      // 1446
/* 75 */                                                                                                      // 1447
/***/ function(module, exports, __webpack_require__) {                                                        // 1448
                                                                                                              // 1449
	// 0 -> Array#forEach                                                                                        // 1450
	// 1 -> Array#map                                                                                            // 1451
	// 2 -> Array#filter                                                                                         // 1452
	// 3 -> Array#some                                                                                           // 1453
	// 4 -> Array#every                                                                                          // 1454
	// 5 -> Array#find                                                                                           // 1455
	// 6 -> Array#findIndex                                                                                      // 1456
	var ctx      = __webpack_require__(35)                                                                       // 1457
	  , isObject = __webpack_require__(25)                                                                       // 1458
	  , IObject  = __webpack_require__(19)                                                                       // 1459
	  , toObject = __webpack_require__(30)                                                                       // 1460
	  , toLength = __webpack_require__(60)                                                                       // 1461
	  , isArray  = __webpack_require__(24)                                                                       // 1462
	  , SPECIES  = __webpack_require__(16)('species');                                                           // 1463
	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)                                                         // 1464
	var ASC = function(original, length){                                                                        // 1465
	  var C;                                                                                                     // 1466
	  if(isArray(original) && isObject(C = original.constructor)){                                               // 1467
	    C = C[SPECIES];                                                                                          // 1468
	    if(C === null)C = undefined;                                                                             // 1469
	  } return new(C === undefined ? Array : C)(length);                                                         // 1470
	};                                                                                                           // 1471
	module.exports = function(TYPE){                                                                             // 1472
	  var IS_MAP        = TYPE == 1                                                                              // 1473
	    , IS_FILTER     = TYPE == 2                                                                              // 1474
	    , IS_SOME       = TYPE == 3                                                                              // 1475
	    , IS_EVERY      = TYPE == 4                                                                              // 1476
	    , IS_FIND_INDEX = TYPE == 6                                                                              // 1477
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;                                                            // 1478
	  return function($this, callbackfn, that){                                                                  // 1479
	    var O      = toObject($this)                                                                             // 1480
	      , self   = IObject(O)                                                                                  // 1481
	      , f      = ctx(callbackfn, that, 3)                                                                    // 1482
	      , length = toLength(self.length)                                                                       // 1483
	      , index  = 0                                                                                           // 1484
	      , result = IS_MAP ? ASC($this, length) : IS_FILTER ? ASC($this, 0) : undefined                         // 1485
	      , val, res;                                                                                            // 1486
	    for(;length > index; index++)if(NO_HOLES || index in self){                                              // 1487
	      val = self[index];                                                                                     // 1488
	      res = f(val, index, O);                                                                                // 1489
	      if(TYPE){                                                                                              // 1490
	        if(IS_MAP)result[index] = res;            // map                                                     // 1491
	        else if(res)switch(TYPE){                                                                            // 1492
	          case 3: return true;                    // some                                                    // 1493
	          case 5: return val;                     // find                                                    // 1494
	          case 6: return index;                   // findIndex                                               // 1495
	          case 2: result.push(val);               // filter                                                  // 1496
	        } else if(IS_EVERY)return false;          // every                                                   // 1497
	      }                                                                                                      // 1498
	    }                                                                                                        // 1499
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;                                     // 1500
	  };                                                                                                         // 1501
	};                                                                                                           // 1502
                                                                                                              // 1503
/***/ },                                                                                                      // 1504
/* 76 */                                                                                                      // 1505
/***/ function(module, exports, __webpack_require__) {                                                        // 1506
                                                                                                              // 1507
	'use strict';                                                                                                // 1508
	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)                                        // 1509
	var KEY    = 'findIndex'                                                                                     // 1510
	  , $def   = __webpack_require__(8)                                                                          // 1511
	  , forced = true                                                                                            // 1512
	  , $find  = __webpack_require__(75)(6);                                                                     // 1513
	// Shouldn't skip holes                                                                                      // 1514
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });                                                   // 1515
	$def($def.P + $def.F * forced, 'Array', {                                                                    // 1516
	  findIndex: function findIndex(callbackfn/*, that = undefined */){                                          // 1517
	    return $find(this, callbackfn, arguments[1]);                                                            // 1518
	  }                                                                                                          // 1519
	});                                                                                                          // 1520
	__webpack_require__(67)(KEY);                                                                                // 1521
                                                                                                              // 1522
/***/ },                                                                                                      // 1523
/* 77 */                                                                                                      // 1524
/***/ function(module, exports, __webpack_require__) {                                                        // 1525
                                                                                                              // 1526
	__webpack_require__(78);                                                                                     // 1527
	__webpack_require__(79);                                                                                     // 1528
	__webpack_require__(80);                                                                                     // 1529
	__webpack_require__(51);                                                                                     // 1530
	__webpack_require__(82);                                                                                     // 1531
	__webpack_require__(83);                                                                                     // 1532
	__webpack_require__(87);                                                                                     // 1533
	__webpack_require__(88);                                                                                     // 1534
	__webpack_require__(90);                                                                                     // 1535
	__webpack_require__(91);                                                                                     // 1536
	__webpack_require__(93);                                                                                     // 1537
	__webpack_require__(94);                                                                                     // 1538
	__webpack_require__(95);                                                                                     // 1539
	module.exports = __webpack_require__(9).String;                                                              // 1540
                                                                                                              // 1541
/***/ },                                                                                                      // 1542
/* 78 */                                                                                                      // 1543
/***/ function(module, exports, __webpack_require__) {                                                        // 1544
                                                                                                              // 1545
	var $def    = __webpack_require__(8)                                                                         // 1546
	  , toIndex = __webpack_require__(71)                                                                        // 1547
	  , fromCharCode = String.fromCharCode                                                                       // 1548
	  , $fromCodePoint = String.fromCodePoint;                                                                   // 1549
                                                                                                              // 1550
	// length should be 1, old FF problem                                                                        // 1551
	$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {                         // 1552
	  // 21.1.2.2 String.fromCodePoint(...codePoints)                                                            // 1553
	  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars                            // 1554
	    var res = []                                                                                             // 1555
	      , len = arguments.length                                                                               // 1556
	      , i   = 0                                                                                              // 1557
	      , code;                                                                                                // 1558
	    while(len > i){                                                                                          // 1559
	      code = +arguments[i++];                                                                                // 1560
	      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');             // 1561
	      res.push(code < 0x10000                                                                                // 1562
	        ? fromCharCode(code)                                                                                 // 1563
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)                            // 1564
	      );                                                                                                     // 1565
	    } return res.join('');                                                                                   // 1566
	  }                                                                                                          // 1567
	});                                                                                                          // 1568
                                                                                                              // 1569
/***/ },                                                                                                      // 1570
/* 79 */                                                                                                      // 1571
/***/ function(module, exports, __webpack_require__) {                                                        // 1572
                                                                                                              // 1573
	var $def      = __webpack_require__(8)                                                                       // 1574
	  , toIObject = __webpack_require__(18)                                                                      // 1575
	  , toLength  = __webpack_require__(60);                                                                     // 1576
                                                                                                              // 1577
	$def($def.S, 'String', {                                                                                     // 1578
	  // 21.1.2.4 String.raw(callSite, ...substitutions)                                                         // 1579
	  raw: function raw(callSite){                                                                               // 1580
	    var tpl = toIObject(callSite.raw)                                                                        // 1581
	      , len = toLength(tpl.length)                                                                           // 1582
	      , sln = arguments.length                                                                               // 1583
	      , res = []                                                                                             // 1584
	      , i   = 0;                                                                                             // 1585
	    while(len > i){                                                                                          // 1586
	      res.push(String(tpl[i++]));                                                                            // 1587
	      if(i < sln)res.push(String(arguments[i]));                                                             // 1588
	    } return res.join('');                                                                                   // 1589
	  }                                                                                                          // 1590
	});                                                                                                          // 1591
                                                                                                              // 1592
/***/ },                                                                                                      // 1593
/* 80 */                                                                                                      // 1594
/***/ function(module, exports, __webpack_require__) {                                                        // 1595
                                                                                                              // 1596
	'use strict';                                                                                                // 1597
	// 21.1.3.25 String.prototype.trim()                                                                         // 1598
	__webpack_require__(81)('trim', function($trim){                                                             // 1599
	  return function trim(){                                                                                    // 1600
	    return $trim(this, 3);                                                                                   // 1601
	  };                                                                                                         // 1602
	});                                                                                                          // 1603
                                                                                                              // 1604
/***/ },                                                                                                      // 1605
/* 81 */                                                                                                      // 1606
/***/ function(module, exports, __webpack_require__) {                                                        // 1607
                                                                                                              // 1608
	// 1 -> String#trimLeft                                                                                      // 1609
	// 2 -> String#trimRight                                                                                     // 1610
	// 3 -> String#trim                                                                                          // 1611
	var trim = function(string, TYPE){                                                                           // 1612
	  string = String(defined(string));                                                                          // 1613
	  if(TYPE & 1)string = string.replace(ltrim, '');                                                            // 1614
	  if(TYPE & 2)string = string.replace(rtrim, '');                                                            // 1615
	  return string;                                                                                             // 1616
	};                                                                                                           // 1617
                                                                                                              // 1618
	var $def    = __webpack_require__(8)                                                                         // 1619
	  , defined = __webpack_require__(21)                                                                        // 1620
	  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +                           // 1621
	      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'                       // 1622
	  , space   = '[' + spaces + ']'                                                                             // 1623
	  , non     = '\u200b\u0085'                                                                                 // 1624
	  , ltrim   = RegExp('^' + space + space + '*')                                                              // 1625
	  , rtrim   = RegExp(space + space + '*$');                                                                  // 1626
                                                                                                              // 1627
	module.exports = function(KEY, exec){                                                                        // 1628
	  var exp  = {};                                                                                             // 1629
	  exp[KEY] = exec(trim);                                                                                     // 1630
	  $def($def.P + $def.F * __webpack_require__(7)(function(){                                                  // 1631
	    return !!spaces[KEY]() || non[KEY]() != non;                                                             // 1632
	  }), 'String', exp);                                                                                        // 1633
	};                                                                                                           // 1634
                                                                                                              // 1635
/***/ },                                                                                                      // 1636
/* 82 */                                                                                                      // 1637
/***/ function(module, exports, __webpack_require__) {                                                        // 1638
                                                                                                              // 1639
	'use strict';                                                                                                // 1640
	var $def = __webpack_require__(8)                                                                            // 1641
	  , $at  = __webpack_require__(52)(false);                                                                   // 1642
	$def($def.P, 'String', {                                                                                     // 1643
	  // 21.1.3.3 String.prototype.codePointAt(pos)                                                              // 1644
	  codePointAt: function codePointAt(pos){                                                                    // 1645
	    return $at(this, pos);                                                                                   // 1646
	  }                                                                                                          // 1647
	});                                                                                                          // 1648
                                                                                                              // 1649
/***/ },                                                                                                      // 1650
/* 83 */                                                                                                      // 1651
/***/ function(module, exports, __webpack_require__) {                                                        // 1652
                                                                                                              // 1653
	// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])                                          // 1654
	'use strict';                                                                                                // 1655
	var $def      = __webpack_require__(8)                                                                       // 1656
	  , toLength  = __webpack_require__(60)                                                                      // 1657
	  , context   = __webpack_require__(84)                                                                      // 1658
	  , ENDS_WITH = 'endsWith'                                                                                   // 1659
	  , $endsWith = ''[ENDS_WITH];                                                                               // 1660
                                                                                                              // 1661
	$def($def.P + $def.F * __webpack_require__(86)(ENDS_WITH), 'String', {                                       // 1662
	  endsWith: function endsWith(searchString /*, endPosition = @length */){                                    // 1663
	    var that = context(this, searchString, ENDS_WITH)                                                        // 1664
	      , endPosition = arguments[1]                                                                           // 1665
	      , len    = toLength(that.length)                                                                       // 1666
	      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)                      // 1667
	      , search = String(searchString);                                                                       // 1668
	    return $endsWith                                                                                         // 1669
	      ? $endsWith.call(that, search, end)                                                                    // 1670
	      : that.slice(end - search.length, end) === search;                                                     // 1671
	  }                                                                                                          // 1672
	});                                                                                                          // 1673
                                                                                                              // 1674
/***/ },                                                                                                      // 1675
/* 84 */                                                                                                      // 1676
/***/ function(module, exports, __webpack_require__) {                                                        // 1677
                                                                                                              // 1678
	// helper for String#{startsWith, endsWith, includes}                                                        // 1679
	var isRegExp = __webpack_require__(85)                                                                       // 1680
	  , defined  = __webpack_require__(21);                                                                      // 1681
                                                                                                              // 1682
	module.exports = function(that, searchString, NAME){                                                         // 1683
	  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");                    // 1684
	  return String(defined(that));                                                                              // 1685
	};                                                                                                           // 1686
                                                                                                              // 1687
/***/ },                                                                                                      // 1688
/* 85 */                                                                                                      // 1689
/***/ function(module, exports, __webpack_require__) {                                                        // 1690
                                                                                                              // 1691
	// 7.2.8 IsRegExp(argument)                                                                                  // 1692
	var isObject = __webpack_require__(25)                                                                       // 1693
	  , cof      = __webpack_require__(20)                                                                       // 1694
	  , MATCH    = __webpack_require__(16)('match');                                                             // 1695
	module.exports = function(it){                                                                               // 1696
	  var isRegExp;                                                                                              // 1697
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');          // 1698
	};                                                                                                           // 1699
                                                                                                              // 1700
/***/ },                                                                                                      // 1701
/* 86 */                                                                                                      // 1702
/***/ function(module, exports, __webpack_require__) {                                                        // 1703
                                                                                                              // 1704
	module.exports = function(KEY){                                                                              // 1705
	  var re = /./;                                                                                              // 1706
	  try {                                                                                                      // 1707
	    '/./'[KEY](re);                                                                                          // 1708
	  } catch(e){                                                                                                // 1709
	    try {                                                                                                    // 1710
	      re[__webpack_require__(16)('match')] = false;                                                          // 1711
	      return !'/./'[KEY](re);                                                                                // 1712
	    } catch(e){ /* empty */ }                                                                                // 1713
	  } return true;                                                                                             // 1714
	};                                                                                                           // 1715
                                                                                                              // 1716
/***/ },                                                                                                      // 1717
/* 87 */                                                                                                      // 1718
/***/ function(module, exports, __webpack_require__) {                                                        // 1719
                                                                                                              // 1720
	// 21.1.3.7 String.prototype.includes(searchString, position = 0)                                            // 1721
	'use strict';                                                                                                // 1722
	var $def     = __webpack_require__(8)                                                                        // 1723
	  , context  = __webpack_require__(84)                                                                       // 1724
	  , INCLUDES = 'includes';                                                                                   // 1725
                                                                                                              // 1726
	$def($def.P + $def.F * __webpack_require__(86)(INCLUDES), 'String', {                                        // 1727
	  includes: function includes(searchString /*, position = 0 */){                                             // 1728
	    return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments[1]);                     // 1729
	  }                                                                                                          // 1730
	});                                                                                                          // 1731
                                                                                                              // 1732
/***/ },                                                                                                      // 1733
/* 88 */                                                                                                      // 1734
/***/ function(module, exports, __webpack_require__) {                                                        // 1735
                                                                                                              // 1736
	var $def = __webpack_require__(8);                                                                           // 1737
                                                                                                              // 1738
	$def($def.P, 'String', {                                                                                     // 1739
	  // 21.1.3.13 String.prototype.repeat(count)                                                                // 1740
	  repeat: __webpack_require__(89)                                                                            // 1741
	});                                                                                                          // 1742
                                                                                                              // 1743
/***/ },                                                                                                      // 1744
/* 89 */                                                                                                      // 1745
/***/ function(module, exports, __webpack_require__) {                                                        // 1746
                                                                                                              // 1747
	'use strict';                                                                                                // 1748
	var toInteger = __webpack_require__(53)                                                                      // 1749
	  , defined   = __webpack_require__(21);                                                                     // 1750
                                                                                                              // 1751
	module.exports = function repeat(count){                                                                     // 1752
	  var str = String(defined(this))                                                                            // 1753
	    , res = ''                                                                                               // 1754
	    , n   = toInteger(count);                                                                                // 1755
	  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");                                     // 1756
	  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;                                                // 1757
	  return res;                                                                                                // 1758
	};                                                                                                           // 1759
                                                                                                              // 1760
/***/ },                                                                                                      // 1761
/* 90 */                                                                                                      // 1762
/***/ function(module, exports, __webpack_require__) {                                                        // 1763
                                                                                                              // 1764
	// 21.1.3.18 String.prototype.startsWith(searchString [, position ])                                         // 1765
	'use strict';                                                                                                // 1766
	var $def        = __webpack_require__(8)                                                                     // 1767
	  , toLength    = __webpack_require__(60)                                                                    // 1768
	  , context     = __webpack_require__(84)                                                                    // 1769
	  , STARTS_WITH = 'startsWith'                                                                               // 1770
	  , $startsWith = ''[STARTS_WITH];                                                                           // 1771
                                                                                                              // 1772
	$def($def.P + $def.F * __webpack_require__(86)(STARTS_WITH), 'String', {                                     // 1773
	  startsWith: function startsWith(searchString /*, position = 0 */){                                         // 1774
	    var that   = context(this, searchString, STARTS_WITH)                                                    // 1775
	      , index  = toLength(Math.min(arguments[1], that.length))                                               // 1776
	      , search = String(searchString);                                                                       // 1777
	    return $startsWith                                                                                       // 1778
	      ? $startsWith.call(that, search, index)                                                                // 1779
	      : that.slice(index, index + search.length) === search;                                                 // 1780
	  }                                                                                                          // 1781
	});                                                                                                          // 1782
                                                                                                              // 1783
/***/ },                                                                                                      // 1784
/* 91 */                                                                                                      // 1785
/***/ function(module, exports, __webpack_require__) {                                                        // 1786
                                                                                                              // 1787
	// @@match logic                                                                                             // 1788
	__webpack_require__(92)('match', 1, function(defined, MATCH){                                                // 1789
	  // 21.1.3.11 String.prototype.match(regexp)                                                                // 1790
	  return function match(regexp){                                                                             // 1791
	    'use strict';                                                                                            // 1792
	    var O  = defined(this)                                                                                   // 1793
	      , fn = regexp == undefined ? undefined : regexp[MATCH];                                                // 1794
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));                     // 1795
	  };                                                                                                         // 1796
	});                                                                                                          // 1797
                                                                                                              // 1798
/***/ },                                                                                                      // 1799
/* 92 */                                                                                                      // 1800
/***/ function(module, exports, __webpack_require__) {                                                        // 1801
                                                                                                              // 1802
	'use strict';                                                                                                // 1803
	module.exports = function(KEY, length, exec){                                                                // 1804
	  var defined  = __webpack_require__(21)                                                                     // 1805
	    , SYMBOL   = __webpack_require__(16)(KEY)                                                                // 1806
	    , original = ''[KEY];                                                                                    // 1807
	  if(__webpack_require__(7)(function(){                                                                      // 1808
	    var O = {};                                                                                              // 1809
	    O[SYMBOL] = function(){ return 7; };                                                                     // 1810
	    return ''[KEY](O) != 7;                                                                                  // 1811
	  })){                                                                                                       // 1812
	    __webpack_require__(12)(String.prototype, KEY, exec(defined, SYMBOL, original));                         // 1813
	    __webpack_require__(10)(RegExp.prototype, SYMBOL, length == 2                                            // 1814
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)                                          // 1815
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)                                                  // 1816
	      ? function(string, arg){ return original.call(string, this, arg); }                                    // 1817
	      // 21.2.5.6 RegExp.prototype[@@match](string)                                                          // 1818
	      // 21.2.5.9 RegExp.prototype[@@search](string)                                                         // 1819
	      : function(string){ return original.call(string, this); }                                              // 1820
	    );                                                                                                       // 1821
	  }                                                                                                          // 1822
	};                                                                                                           // 1823
                                                                                                              // 1824
/***/ },                                                                                                      // 1825
/* 93 */                                                                                                      // 1826
/***/ function(module, exports, __webpack_require__) {                                                        // 1827
                                                                                                              // 1828
	// @@replace logic                                                                                           // 1829
	__webpack_require__(92)('replace', 2, function(defined, REPLACE, $replace){                                  // 1830
	  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)                                           // 1831
	  return function replace(searchValue, replaceValue){                                                        // 1832
	    'use strict';                                                                                            // 1833
	    var O  = defined(this)                                                                                   // 1834
	      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];                                    // 1835
	    return fn !== undefined                                                                                  // 1836
	      ? fn.call(searchValue, O, replaceValue)                                                                // 1837
	      : $replace.call(String(O), searchValue, replaceValue);                                                 // 1838
	  };                                                                                                         // 1839
	});                                                                                                          // 1840
                                                                                                              // 1841
/***/ },                                                                                                      // 1842
/* 94 */                                                                                                      // 1843
/***/ function(module, exports, __webpack_require__) {                                                        // 1844
                                                                                                              // 1845
	// @@search logic                                                                                            // 1846
	__webpack_require__(92)('search', 1, function(defined, SEARCH){                                              // 1847
	  // 21.1.3.15 String.prototype.search(regexp)                                                               // 1848
	  return function search(regexp){                                                                            // 1849
	    'use strict';                                                                                            // 1850
	    var O  = defined(this)                                                                                   // 1851
	      , fn = regexp == undefined ? undefined : regexp[SEARCH];                                               // 1852
	    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));                    // 1853
	  };                                                                                                         // 1854
	});                                                                                                          // 1855
                                                                                                              // 1856
/***/ },                                                                                                      // 1857
/* 95 */                                                                                                      // 1858
/***/ function(module, exports, __webpack_require__) {                                                        // 1859
                                                                                                              // 1860
	// @@split logic                                                                                             // 1861
	__webpack_require__(92)('split', 2, function(defined, SPLIT, $split){                                        // 1862
	  // 21.1.3.17 String.prototype.split(separator, limit)                                                      // 1863
	  return function split(separator, limit){                                                                   // 1864
	    'use strict';                                                                                            // 1865
	    var O  = defined(this)                                                                                   // 1866
	      , fn = separator == undefined ? undefined : separator[SPLIT];                                          // 1867
	    return fn !== undefined                                                                                  // 1868
	      ? fn.call(separator, O, limit)                                                                         // 1869
	      : $split.call(String(O), separator, limit);                                                            // 1870
	  };                                                                                                         // 1871
	});                                                                                                          // 1872
                                                                                                              // 1873
/***/ },                                                                                                      // 1874
/* 96 */                                                                                                      // 1875
/***/ function(module, exports, __webpack_require__) {                                                        // 1876
                                                                                                              // 1877
	__webpack_require__(97);                                                                                     // 1878
	__webpack_require__(98);                                                                                     // 1879
	module.exports = __webpack_require__(9).Function;                                                            // 1880
                                                                                                              // 1881
/***/ },                                                                                                      // 1882
/* 97 */                                                                                                      // 1883
/***/ function(module, exports, __webpack_require__) {                                                        // 1884
                                                                                                              // 1885
	var setDesc    = __webpack_require__(3).setDesc                                                              // 1886
	  , createDesc = __webpack_require__(11)                                                                     // 1887
	  , has        = __webpack_require__(5)                                                                      // 1888
	  , FProto     = Function.prototype                                                                          // 1889
	  , nameRE     = /^\s*function ([^ (]*)/                                                                     // 1890
	  , NAME       = 'name';                                                                                     // 1891
	// 19.2.4.2 name                                                                                             // 1892
	NAME in FProto || __webpack_require__(6) && setDesc(FProto, NAME, {                                          // 1893
	  configurable: true,                                                                                        // 1894
	  get: function(){                                                                                           // 1895
	    var match = ('' + this).match(nameRE)                                                                    // 1896
	      , name  = match ? match[1] : '';                                                                       // 1897
	    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));                                             // 1898
	    return name;                                                                                             // 1899
	  }                                                                                                          // 1900
	});                                                                                                          // 1901
                                                                                                              // 1902
/***/ },                                                                                                      // 1903
/* 98 */                                                                                                      // 1904
/***/ function(module, exports, __webpack_require__) {                                                        // 1905
                                                                                                              // 1906
	'use strict';                                                                                                // 1907
	var $             = __webpack_require__(3)                                                                   // 1908
	  , isObject      = __webpack_require__(25)                                                                  // 1909
	  , HAS_INSTANCE  = __webpack_require__(16)('hasInstance')                                                   // 1910
	  , FunctionProto = Function.prototype;                                                                      // 1911
	// 19.2.3.6 Function.prototype[@@hasInstance](V)                                                             // 1912
	if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){              // 1913
	  if(typeof this != 'function' || !isObject(O))return false;                                                 // 1914
	  if(!isObject(this.prototype))return O instanceof this;                                                     // 1915
	  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:                     // 1916
	  while(O = $.getProto(O))if(this.prototype === O)return true;                                               // 1917
	  return false;                                                                                              // 1918
	}});                                                                                                         // 1919
                                                                                                              // 1920
/***/ },                                                                                                      // 1921
/* 99 */                                                                                                      // 1922
/***/ function(module, exports, __webpack_require__) {                                                        // 1923
                                                                                                              // 1924
	__webpack_require__(2);                                                                                      // 1925
	module.exports = __webpack_require__(9).Symbol;                                                              // 1926
                                                                                                              // 1927
/***/ },                                                                                                      // 1928
/* 100 */                                                                                                     // 1929
/***/ function(module, exports, __webpack_require__) {                                                        // 1930
                                                                                                              // 1931
	__webpack_require__(37);                                                                                     // 1932
	__webpack_require__(51);                                                                                     // 1933
	__webpack_require__(101);                                                                                    // 1934
	__webpack_require__(102);                                                                                    // 1935
	module.exports = __webpack_require__(9).Map;                                                                 // 1936
                                                                                                              // 1937
/***/ },                                                                                                      // 1938
/* 101 */                                                                                                     // 1939
/***/ function(module, exports, __webpack_require__) {                                                        // 1940
                                                                                                              // 1941
	__webpack_require__(66);                                                                                     // 1942
	var global      = __webpack_require__(4)                                                                     // 1943
	  , hide        = __webpack_require__(10)                                                                    // 1944
	  , Iterators   = __webpack_require__(55)                                                                    // 1945
	  , ITERATOR    = __webpack_require__(16)('iterator')                                                        // 1946
	  , NL          = global.NodeList                                                                            // 1947
	  , HTC         = global.HTMLCollection                                                                      // 1948
	  , NLProto     = NL && NL.prototype                                                                         // 1949
	  , HTCProto    = HTC && HTC.prototype                                                                       // 1950
	  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;                           // 1951
	if(NL && !(ITERATOR in NLProto))hide(NLProto, ITERATOR, ArrayValues);                                        // 1952
	if(HTC && !(ITERATOR in HTCProto))hide(HTCProto, ITERATOR, ArrayValues);                                     // 1953
                                                                                                              // 1954
/***/ },                                                                                                      // 1955
/* 102 */                                                                                                     // 1956
/***/ function(module, exports, __webpack_require__) {                                                        // 1957
                                                                                                              // 1958
	'use strict';                                                                                                // 1959
	var strong = __webpack_require__(103);                                                                       // 1960
                                                                                                              // 1961
	// 23.1 Map Objects                                                                                          // 1962
	__webpack_require__(107)('Map', function(get){                                                               // 1963
	  return function Map(){ return get(this, arguments[0]); };                                                  // 1964
	}, {                                                                                                         // 1965
	  // 23.1.3.6 Map.prototype.get(key)                                                                         // 1966
	  get: function get(key){                                                                                    // 1967
	    var entry = strong.getEntry(this, key);                                                                  // 1968
	    return entry && entry.v;                                                                                 // 1969
	  },                                                                                                         // 1970
	  // 23.1.3.9 Map.prototype.set(key, value)                                                                  // 1971
	  set: function set(key, value){                                                                             // 1972
	    return strong.def(this, key === 0 ? 0 : key, value);                                                     // 1973
	  }                                                                                                          // 1974
	}, strong, true);                                                                                            // 1975
                                                                                                              // 1976
/***/ },                                                                                                      // 1977
/* 103 */                                                                                                     // 1978
/***/ function(module, exports, __webpack_require__) {                                                        // 1979
                                                                                                              // 1980
	'use strict';                                                                                                // 1981
	var $            = __webpack_require__(3)                                                                    // 1982
	  , hide         = __webpack_require__(10)                                                                   // 1983
	  , ctx          = __webpack_require__(35)                                                                   // 1984
	  , species      = __webpack_require__(65)                                                                   // 1985
	  , strictNew    = __webpack_require__(104)                                                                  // 1986
	  , defined      = __webpack_require__(21)                                                                   // 1987
	  , forOf        = __webpack_require__(105)                                                                  // 1988
	  , step         = __webpack_require__(68)                                                                   // 1989
	  , ID           = __webpack_require__(13)('id')                                                             // 1990
	  , $has         = __webpack_require__(5)                                                                    // 1991
	  , isObject     = __webpack_require__(25)                                                                   // 1992
	  , isExtensible = Object.isExtensible || isObject                                                           // 1993
	  , SUPPORT_DESC = __webpack_require__(6)                                                                    // 1994
	  , SIZE         = SUPPORT_DESC ? '_s' : 'size'                                                              // 1995
	  , id           = 0;                                                                                        // 1996
                                                                                                              // 1997
	var fastKey = function(it, create){                                                                          // 1998
	  // return primitive with prefix                                                                            // 1999
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;             // 2000
	  if(!$has(it, ID)){                                                                                         // 2001
	    // can't set id to frozen object                                                                         // 2002
	    if(!isExtensible(it))return 'F';                                                                         // 2003
	    // not necessary to add id                                                                               // 2004
	    if(!create)return 'E';                                                                                   // 2005
	    // add missing object id                                                                                 // 2006
	    hide(it, ID, ++id);                                                                                      // 2007
	  // return object id with prefix                                                                            // 2008
	  } return 'O' + it[ID];                                                                                     // 2009
	};                                                                                                           // 2010
                                                                                                              // 2011
	var getEntry = function(that, key){                                                                          // 2012
	  // fast case                                                                                               // 2013
	  var index = fastKey(key), entry;                                                                           // 2014
	  if(index !== 'F')return that._i[index];                                                                    // 2015
	  // frozen object case                                                                                      // 2016
	  for(entry = that._f; entry; entry = entry.n){                                                              // 2017
	    if(entry.k == key)return entry;                                                                          // 2018
	  }                                                                                                          // 2019
	};                                                                                                           // 2020
                                                                                                              // 2021
	module.exports = {                                                                                           // 2022
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){                                                    // 2023
	    var C = wrapper(function(that, iterable){                                                                // 2024
	      strictNew(that, C, NAME);                                                                              // 2025
	      that._i = $.create(null); // index                                                                     // 2026
	      that._f = undefined;      // first entry                                                               // 2027
	      that._l = undefined;      // last entry                                                                // 2028
	      that[SIZE] = 0;           // size                                                                      // 2029
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);                                   // 2030
	    });                                                                                                      // 2031
	    __webpack_require__(106)(C.prototype, {                                                                  // 2032
	      // 23.1.3.1 Map.prototype.clear()                                                                      // 2033
	      // 23.2.3.2 Set.prototype.clear()                                                                      // 2034
	      clear: function clear(){                                                                               // 2035
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){                       // 2036
	          entry.r = true;                                                                                    // 2037
	          if(entry.p)entry.p = entry.p.n = undefined;                                                        // 2038
	          delete data[entry.i];                                                                              // 2039
	        }                                                                                                    // 2040
	        that._f = that._l = undefined;                                                                       // 2041
	        that[SIZE] = 0;                                                                                      // 2042
	      },                                                                                                     // 2043
	      // 23.1.3.3 Map.prototype.delete(key)                                                                  // 2044
	      // 23.2.3.4 Set.prototype.delete(value)                                                                // 2045
	      'delete': function(key){                                                                               // 2046
	        var that  = this                                                                                     // 2047
	          , entry = getEntry(that, key);                                                                     // 2048
	        if(entry){                                                                                           // 2049
	          var next = entry.n                                                                                 // 2050
	            , prev = entry.p;                                                                                // 2051
	          delete that._i[entry.i];                                                                           // 2052
	          entry.r = true;                                                                                    // 2053
	          if(prev)prev.n = next;                                                                             // 2054
	          if(next)next.p = prev;                                                                             // 2055
	          if(that._f == entry)that._f = next;                                                                // 2056
	          if(that._l == entry)that._l = prev;                                                                // 2057
	          that[SIZE]--;                                                                                      // 2058
	        } return !!entry;                                                                                    // 2059
	      },                                                                                                     // 2060
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)                                     // 2061
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)                                     // 2062
	      forEach: function forEach(callbackfn /*, that = undefined */){                                         // 2063
	        var f = ctx(callbackfn, arguments[1], 3)                                                             // 2064
	          , entry;                                                                                           // 2065
	        while(entry = entry ? entry.n : this._f){                                                            // 2066
	          f(entry.v, entry.k, this);                                                                         // 2067
	          // revert to the last existing entry                                                               // 2068
	          while(entry && entry.r)entry = entry.p;                                                            // 2069
	        }                                                                                                    // 2070
	      },                                                                                                     // 2071
	      // 23.1.3.7 Map.prototype.has(key)                                                                     // 2072
	      // 23.2.3.7 Set.prototype.has(value)                                                                   // 2073
	      has: function has(key){                                                                                // 2074
	        return !!getEntry(this, key);                                                                        // 2075
	      }                                                                                                      // 2076
	    });                                                                                                      // 2077
	    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {                                                         // 2078
	      get: function(){                                                                                       // 2079
	        return defined(this[SIZE]);                                                                          // 2080
	      }                                                                                                      // 2081
	    });                                                                                                      // 2082
	    return C;                                                                                                // 2083
	  },                                                                                                         // 2084
	  def: function(that, key, value){                                                                           // 2085
	    var entry = getEntry(that, key)                                                                          // 2086
	      , prev, index;                                                                                         // 2087
	    // change existing entry                                                                                 // 2088
	    if(entry){                                                                                               // 2089
	      entry.v = value;                                                                                       // 2090
	    // create new entry                                                                                      // 2091
	    } else {                                                                                                 // 2092
	      that._l = entry = {                                                                                    // 2093
	        i: index = fastKey(key, true), // <- index                                                           // 2094
	        k: key,                        // <- key                                                             // 2095
	        v: value,                      // <- value                                                           // 2096
	        p: prev = that._l,             // <- previous entry                                                  // 2097
	        n: undefined,                  // <- next entry                                                      // 2098
	        r: false                       // <- removed                                                         // 2099
	      };                                                                                                     // 2100
	      if(!that._f)that._f = entry;                                                                           // 2101
	      if(prev)prev.n = entry;                                                                                // 2102
	      that[SIZE]++;                                                                                          // 2103
	      // add to index                                                                                        // 2104
	      if(index !== 'F')that._i[index] = entry;                                                               // 2105
	    } return that;                                                                                           // 2106
	  },                                                                                                         // 2107
	  getEntry: getEntry,                                                                                        // 2108
	  setStrong: function(C, NAME, IS_MAP){                                                                      // 2109
	    // add .keys, .values, .entries, [@@iterator]                                                            // 2110
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11                    // 2111
	    __webpack_require__(54)(C, NAME, function(iterated, kind){                                               // 2112
	      this._t = iterated;  // target                                                                         // 2113
	      this._k = kind;      // kind                                                                           // 2114
	      this._l = undefined; // previous                                                                       // 2115
	    }, function(){                                                                                           // 2116
	      var that  = this                                                                                       // 2117
	        , kind  = that._k                                                                                    // 2118
	        , entry = that._l;                                                                                   // 2119
	      // revert to the last existing entry                                                                   // 2120
	      while(entry && entry.r)entry = entry.p;                                                                // 2121
	      // get next entry                                                                                      // 2122
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){                                     // 2123
	        // or finish the iteration                                                                           // 2124
	        that._t = undefined;                                                                                 // 2125
	        return step(1);                                                                                      // 2126
	      }                                                                                                      // 2127
	      // return step by kind                                                                                 // 2128
	      if(kind == 'keys'  )return step(0, entry.k);                                                           // 2129
	      if(kind == 'values')return step(0, entry.v);                                                           // 2130
	      return step(0, [entry.k, entry.v]);                                                                    // 2131
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);                                                       // 2132
                                                                                                              // 2133
	    // add [@@species], 23.1.2.2, 23.2.2.2                                                                   // 2134
	    species(C);                                                                                              // 2135
	    species(__webpack_require__(9)[NAME]); // for wrapper                                                    // 2136
	  }                                                                                                          // 2137
	};                                                                                                           // 2138
                                                                                                              // 2139
/***/ },                                                                                                      // 2140
/* 104 */                                                                                                     // 2141
/***/ function(module, exports) {                                                                             // 2142
                                                                                                              // 2143
	module.exports = function(it, Constructor, name){                                                            // 2144
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");                       // 2145
	  return it;                                                                                                 // 2146
	};                                                                                                           // 2147
                                                                                                              // 2148
/***/ },                                                                                                      // 2149
/* 105 */                                                                                                     // 2150
/***/ function(module, exports, __webpack_require__) {                                                        // 2151
                                                                                                              // 2152
	var ctx         = __webpack_require__(35)                                                                    // 2153
	  , call        = __webpack_require__(58)                                                                    // 2154
	  , isArrayIter = __webpack_require__(59)                                                                    // 2155
	  , anObject    = __webpack_require__(26)                                                                    // 2156
	  , toLength    = __webpack_require__(60)                                                                    // 2157
	  , getIterFn   = __webpack_require__(61);                                                                   // 2158
	module.exports = function(iterable, entries, fn, that){                                                      // 2159
	  var iterFn = getIterFn(iterable)                                                                           // 2160
	    , f      = ctx(fn, that, entries ? 2 : 1)                                                                // 2161
	    , index  = 0                                                                                             // 2162
	    , length, step, iterator;                                                                                // 2163
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');                            // 2164
	  // fast case for arrays with default iterator                                                              // 2165
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){                   // 2166
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);                          // 2167
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){                            // 2168
	    call(iterator, f, step.value, entries);                                                                  // 2169
	  }                                                                                                          // 2170
	};                                                                                                           // 2171
                                                                                                              // 2172
/***/ },                                                                                                      // 2173
/* 106 */                                                                                                     // 2174
/***/ function(module, exports, __webpack_require__) {                                                        // 2175
                                                                                                              // 2176
	var $redef = __webpack_require__(12);                                                                        // 2177
	module.exports = function(target, src){                                                                      // 2178
	  for(var key in src)$redef(target, key, src[key]);                                                          // 2179
	  return target;                                                                                             // 2180
	};                                                                                                           // 2181
                                                                                                              // 2182
/***/ },                                                                                                      // 2183
/* 107 */                                                                                                     // 2184
/***/ function(module, exports, __webpack_require__) {                                                        // 2185
                                                                                                              // 2186
	'use strict';                                                                                                // 2187
	var global     = __webpack_require__(4)                                                                      // 2188
	  , $def       = __webpack_require__(8)                                                                      // 2189
	  , forOf      = __webpack_require__(105)                                                                    // 2190
	  , strictNew  = __webpack_require__(104);                                                                   // 2191
                                                                                                              // 2192
	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){                                  // 2193
	  var Base  = global[NAME]                                                                                   // 2194
	    , C     = Base                                                                                           // 2195
	    , ADDER = IS_MAP ? 'set' : 'add'                                                                         // 2196
	    , proto = C && C.prototype                                                                               // 2197
	    , O     = {};                                                                                            // 2198
	  var fixMethod = function(KEY){                                                                             // 2199
	    var fn = proto[KEY];                                                                                     // 2200
	    __webpack_require__(12)(proto, KEY,                                                                      // 2201
	      KEY == 'delete' ? function(a){ return fn.call(this, a === 0 ? 0 : a); }                                // 2202
	      : KEY == 'has' ? function has(a){ return fn.call(this, a === 0 ? 0 : a); }                             // 2203
	      : KEY == 'get' ? function get(a){ return fn.call(this, a === 0 ? 0 : a); }                             // 2204
	      : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }                       // 2205
	      : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }                                // 2206
	    );                                                                                                       // 2207
	  };                                                                                                         // 2208
	  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !__webpack_require__(7)(function(){             // 2209
	    new C().entries().next();                                                                                // 2210
	  }))){                                                                                                      // 2211
	    // create collection constructor                                                                         // 2212
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);                                                 // 2213
	    __webpack_require__(106)(C.prototype, methods);                                                          // 2214
	  } else {                                                                                                   // 2215
	    var inst  = new C                                                                                        // 2216
	      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)                                                            // 2217
	      , buggyZero;                                                                                           // 2218
	    // wrap for init collections from iterable                                                               // 2219
	    if(!__webpack_require__(62)(function(iter){ new C(iter); })){ // eslint-disable-line no-new              // 2220
	      C = wrapper(function(target, iterable){                                                                // 2221
	        strictNew(target, C, NAME);                                                                          // 2222
	        var that = new Base;                                                                                 // 2223
	        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);                                 // 2224
	        return that;                                                                                         // 2225
	      });                                                                                                    // 2226
	      C.prototype = proto;                                                                                   // 2227
	      proto.constructor = C;                                                                                 // 2228
	    }                                                                                                        // 2229
	    IS_WEAK || inst.forEach(function(val, key){                                                              // 2230
	      buggyZero = 1 / key === -Infinity;                                                                     // 2231
	    });                                                                                                      // 2232
	    // fix converting -0 key to +0                                                                           // 2233
	    if(buggyZero){                                                                                           // 2234
	      fixMethod('delete');                                                                                   // 2235
	      fixMethod('has');                                                                                      // 2236
	      IS_MAP && fixMethod('get');                                                                            // 2237
	    }                                                                                                        // 2238
	    // + fix .add & .set for chaining                                                                        // 2239
	    if(buggyZero || chain !== inst)fixMethod(ADDER);                                                         // 2240
	    // weak collections should not contains .clear method                                                    // 2241
	    if(IS_WEAK && proto.clear)delete proto.clear;                                                            // 2242
	  }                                                                                                          // 2243
                                                                                                              // 2244
	  __webpack_require__(15)(C, NAME);                                                                          // 2245
                                                                                                              // 2246
	  O[NAME] = C;                                                                                               // 2247
	  $def($def.G + $def.W + $def.F * (C != Base), O);                                                           // 2248
                                                                                                              // 2249
	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);                                                             // 2250
                                                                                                              // 2251
	  return C;                                                                                                  // 2252
	};                                                                                                           // 2253
                                                                                                              // 2254
/***/ },                                                                                                      // 2255
/* 108 */                                                                                                     // 2256
/***/ function(module, exports, __webpack_require__) {                                                        // 2257
                                                                                                              // 2258
	__webpack_require__(37);                                                                                     // 2259
	__webpack_require__(51);                                                                                     // 2260
	__webpack_require__(101);                                                                                    // 2261
	__webpack_require__(109);                                                                                    // 2262
	module.exports = __webpack_require__(9).Set;                                                                 // 2263
                                                                                                              // 2264
/***/ },                                                                                                      // 2265
/* 109 */                                                                                                     // 2266
/***/ function(module, exports, __webpack_require__) {                                                        // 2267
                                                                                                              // 2268
	'use strict';                                                                                                // 2269
	var strong = __webpack_require__(103);                                                                       // 2270
                                                                                                              // 2271
	// 23.2 Set Objects                                                                                          // 2272
	__webpack_require__(107)('Set', function(get){                                                               // 2273
	  return function Set(){ return get(this, arguments[0]); };                                                  // 2274
	}, {                                                                                                         // 2275
	  // 23.2.3.1 Set.prototype.add(value)                                                                       // 2276
	  add: function add(value){                                                                                  // 2277
	    return strong.def(this, value = value === 0 ? 0 : value, value);                                         // 2278
	  }                                                                                                          // 2279
	}, strong);                                                                                                  // 2280
                                                                                                              // 2281
/***/ }                                                                                                       // 2282
/******/ ]);                                                                                                  // 2283


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ecmascript-runtime'] = {
  Symbol: Symbol,
  Map: Map,
  Set: Set
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

/* Package-scope variables */
var Promise;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/promise/.npm/package/node_modules/meteor-promise/promise.bundle.js                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/******/ (function(modules) { // webpackBootstrap                                                                    // 1
/******/ 	// The module cache                                                                                        // 2
/******/ 	var installedModules = {};                                                                                 // 3
                                                                                                                     // 4
/******/ 	// The require function                                                                                    // 5
/******/ 	function __webpack_require__(moduleId) {                                                                   // 6
                                                                                                                     // 7
/******/ 		// Check if module is in cache                                                                            // 8
/******/ 		if(installedModules[moduleId])                                                                            // 9
/******/ 			return installedModules[moduleId].exports;                                                               // 10
                                                                                                                     // 11
/******/ 		// Create a new module (and put it into the cache)                                                        // 12
/******/ 		var module = installedModules[moduleId] = {                                                               // 13
/******/ 			exports: {},                                                                                             // 14
/******/ 			id: moduleId,                                                                                            // 15
/******/ 			loaded: false                                                                                            // 16
/******/ 		};                                                                                                        // 17
                                                                                                                     // 18
/******/ 		// Execute the module function                                                                            // 19
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);                      // 20
                                                                                                                     // 21
/******/ 		// Flag the module as loaded                                                                              // 22
/******/ 		module.loaded = true;                                                                                     // 23
                                                                                                                     // 24
/******/ 		// Return the exports of the module                                                                       // 25
/******/ 		return module.exports;                                                                                    // 26
/******/ 	}                                                                                                          // 27
                                                                                                                     // 28
                                                                                                                     // 29
/******/ 	// expose the modules object (__webpack_modules__)                                                         // 30
/******/ 	__webpack_require__.m = modules;                                                                           // 31
                                                                                                                     // 32
/******/ 	// expose the module cache                                                                                 // 33
/******/ 	__webpack_require__.c = installedModules;                                                                  // 34
                                                                                                                     // 35
/******/ 	// __webpack_public_path__                                                                                 // 36
/******/ 	__webpack_require__.p = "";                                                                                // 37
                                                                                                                     // 38
/******/ 	// Load entry module and return exports                                                                    // 39
/******/ 	return __webpack_require__(0);                                                                             // 40
/******/ })                                                                                                          // 41
/************************************************************************/                                           // 42
/******/ ([                                                                                                          // 43
/* 0 */                                                                                                              // 44
/***/ function(module, exports, __webpack_require__) {                                                               // 45
                                                                                                                     // 46
	var MeteorPromise = __webpack_require__(1);                                                                         // 47
                                                                                                                     // 48
	var es6PromiseThen = MeteorPromise.prototype.then;                                                                  // 49
	MeteorPromise.prototype.then = function (onResolved, onRejected) {                                                  // 50
	  if (typeof Meteor === "object" &&                                                                                 // 51
	      typeof Meteor.bindEnvironment === "function") {                                                               // 52
	    return es6PromiseThen.call(                                                                                     // 53
	      this,                                                                                                         // 54
	      onResolved && Meteor.bindEnvironment(onResolved, raise),                                                      // 55
	      onRejected && Meteor.bindEnvironment(onRejected, raise)                                                       // 56
	    );                                                                                                              // 57
	  }                                                                                                                 // 58
	  return es6PromiseThen.call(this, onResolved, onRejected);                                                         // 59
	};                                                                                                                  // 60
                                                                                                                     // 61
	function raise(exception) {                                                                                         // 62
	  throw exception;                                                                                                  // 63
	}                                                                                                                   // 64
                                                                                                                     // 65
	Promise = MeteorPromise;                                                                                            // 66
                                                                                                                     // 67
                                                                                                                     // 68
/***/ },                                                                                                             // 69
/* 1 */                                                                                                              // 70
/***/ function(module, exports, __webpack_require__) {                                                               // 71
                                                                                                                     // 72
	/* WEBPACK VAR INJECTION */(function(global) {var hasOwn = Object.prototype.hasOwnProperty;                         // 73
                                                                                                                     // 74
	var g =                                                                                                             // 75
	  typeof global === "object" ? global :                                                                             // 76
	  typeof window === "object" ? window :                                                                             // 77
	  typeof self === "object" ? self : this;                                                                           // 78
                                                                                                                     // 79
	var GlobalPromise = g.Promise;                                                                                      // 80
	var NpmPromise = __webpack_require__(2);                                                                            // 81
                                                                                                                     // 82
	function copyMethods(target, source) {                                                                              // 83
	  Object.keys(source).forEach(function (key) {                                                                      // 84
	    var value = source[key];                                                                                        // 85
	    if (typeof value === "function" &&                                                                              // 86
	        ! hasOwn.call(target, key)) {                                                                               // 87
	      target[key] = value;                                                                                          // 88
	    }                                                                                                               // 89
	  });                                                                                                               // 90
	}                                                                                                                   // 91
                                                                                                                     // 92
	if (typeof GlobalPromise === "function") {                                                                          // 93
	  copyMethods(GlobalPromise, NpmPromise);                                                                           // 94
	  copyMethods(GlobalPromise.prototype, NpmPromise.prototype);                                                       // 95
	  module.exports = GlobalPromise;                                                                                   // 96
	} else {                                                                                                            // 97
	  module.exports = NpmPromise;                                                                                      // 98
	}                                                                                                                   // 99
                                                                                                                     // 100
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))                                        // 101
                                                                                                                     // 102
/***/ },                                                                                                             // 103
/* 2 */                                                                                                              // 104
/***/ function(module, exports, __webpack_require__) {                                                               // 105
                                                                                                                     // 106
	'use strict';                                                                                                       // 107
                                                                                                                     // 108
	module.exports = __webpack_require__(3)                                                                             // 109
                                                                                                                     // 110
                                                                                                                     // 111
/***/ },                                                                                                             // 112
/* 3 */                                                                                                              // 113
/***/ function(module, exports, __webpack_require__) {                                                               // 114
                                                                                                                     // 115
	'use strict';                                                                                                       // 116
                                                                                                                     // 117
	module.exports = __webpack_require__(4);                                                                            // 118
	__webpack_require__(6);                                                                                             // 119
	__webpack_require__(7);                                                                                             // 120
	__webpack_require__(8);                                                                                             // 121
	__webpack_require__(9);                                                                                             // 122
                                                                                                                     // 123
                                                                                                                     // 124
/***/ },                                                                                                             // 125
/* 4 */                                                                                                              // 126
/***/ function(module, exports, __webpack_require__) {                                                               // 127
                                                                                                                     // 128
	'use strict';                                                                                                       // 129
                                                                                                                     // 130
	var asap = __webpack_require__(5);                                                                                  // 131
                                                                                                                     // 132
	function noop() {}                                                                                                  // 133
                                                                                                                     // 134
	// States:                                                                                                          // 135
	//                                                                                                                  // 136
	// 0 - pending                                                                                                      // 137
	// 1 - fulfilled with _value                                                                                        // 138
	// 2 - rejected with _value                                                                                         // 139
	// 3 - adopted the state of another promise, _value                                                                 // 140
	//                                                                                                                  // 141
	// once the state is no longer pending (0) it is immutable                                                          // 142
                                                                                                                     // 143
	// All `_` prefixed properties will be reduced to `_{random number}`                                                // 144
	// at build time to obfuscate them and discourage their use.                                                        // 145
	// We don't use symbols or Object.defineProperty to fully hide them                                                 // 146
	// because the performance isn't good enough.                                                                       // 147
                                                                                                                     // 148
                                                                                                                     // 149
	// to avoid using try/catch inside critical functions, we                                                           // 150
	// extract them to here.                                                                                            // 151
	var LAST_ERROR = null;                                                                                              // 152
	var IS_ERROR = {};                                                                                                  // 153
	function getThen(obj) {                                                                                             // 154
	  try {                                                                                                             // 155
	    return obj.then;                                                                                                // 156
	  } catch (ex) {                                                                                                    // 157
	    LAST_ERROR = ex;                                                                                                // 158
	    return IS_ERROR;                                                                                                // 159
	  }                                                                                                                 // 160
	}                                                                                                                   // 161
                                                                                                                     // 162
	function tryCallOne(fn, a) {                                                                                        // 163
	  try {                                                                                                             // 164
	    return fn(a);                                                                                                   // 165
	  } catch (ex) {                                                                                                    // 166
	    LAST_ERROR = ex;                                                                                                // 167
	    return IS_ERROR;                                                                                                // 168
	  }                                                                                                                 // 169
	}                                                                                                                   // 170
	function tryCallTwo(fn, a, b) {                                                                                     // 171
	  try {                                                                                                             // 172
	    fn(a, b);                                                                                                       // 173
	  } catch (ex) {                                                                                                    // 174
	    LAST_ERROR = ex;                                                                                                // 175
	    return IS_ERROR;                                                                                                // 176
	  }                                                                                                                 // 177
	}                                                                                                                   // 178
                                                                                                                     // 179
	module.exports = Promise;                                                                                           // 180
                                                                                                                     // 181
	function Promise(fn) {                                                                                              // 182
	  if (typeof this !== 'object') {                                                                                   // 183
	    throw new TypeError('Promises must be constructed via new');                                                    // 184
	  }                                                                                                                 // 185
	  if (typeof fn !== 'function') {                                                                                   // 186
	    throw new TypeError('not a function');                                                                          // 187
	  }                                                                                                                 // 188
	  this._37 = 0;                                                                                                     // 189
	  this._12 = null;                                                                                                  // 190
	  this._59 = [];                                                                                                    // 191
	  if (fn === noop) return;                                                                                          // 192
	  doResolve(fn, this);                                                                                              // 193
	}                                                                                                                   // 194
	Promise._99 = noop;                                                                                                 // 195
                                                                                                                     // 196
	Promise.prototype.then = function(onFulfilled, onRejected) {                                                        // 197
	  if (this.constructor !== Promise) {                                                                               // 198
	    return safeThen(this, onFulfilled, onRejected);                                                                 // 199
	  }                                                                                                                 // 200
	  var res = new Promise(noop);                                                                                      // 201
	  handle(this, new Handler(onFulfilled, onRejected, res));                                                          // 202
	  return res;                                                                                                       // 203
	};                                                                                                                  // 204
                                                                                                                     // 205
	function safeThen(self, onFulfilled, onRejected) {                                                                  // 206
	  return new self.constructor(function (resolve, reject) {                                                          // 207
	    var res = new Promise(noop);                                                                                    // 208
	    res.then(resolve, reject);                                                                                      // 209
	    handle(self, new Handler(onFulfilled, onRejected, res));                                                        // 210
	  });                                                                                                               // 211
	};                                                                                                                  // 212
	function handle(self, deferred) {                                                                                   // 213
	  while (self._37 === 3) {                                                                                          // 214
	    self = self._12;                                                                                                // 215
	  }                                                                                                                 // 216
	  if (self._37 === 0) {                                                                                             // 217
	    self._59.push(deferred);                                                                                        // 218
	    return;                                                                                                         // 219
	  }                                                                                                                 // 220
	  asap(function() {                                                                                                 // 221
	    var cb = self._37 === 1 ? deferred.onFulfilled : deferred.onRejected;                                           // 222
	    if (cb === null) {                                                                                              // 223
	      if (self._37 === 1) {                                                                                         // 224
	        resolve(deferred.promise, self._12);                                                                        // 225
	      } else {                                                                                                      // 226
	        reject(deferred.promise, self._12);                                                                         // 227
	      }                                                                                                             // 228
	      return;                                                                                                       // 229
	    }                                                                                                               // 230
	    var ret = tryCallOne(cb, self._12);                                                                             // 231
	    if (ret === IS_ERROR) {                                                                                         // 232
	      reject(deferred.promise, LAST_ERROR);                                                                         // 233
	    } else {                                                                                                        // 234
	      resolve(deferred.promise, ret);                                                                               // 235
	    }                                                                                                               // 236
	  });                                                                                                               // 237
	}                                                                                                                   // 238
	function resolve(self, newValue) {                                                                                  // 239
	  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	  if (newValue === self) {                                                                                          // 241
	    return reject(                                                                                                  // 242
	      self,                                                                                                         // 243
	      new TypeError('A promise cannot be resolved with itself.')                                                    // 244
	    );                                                                                                              // 245
	  }                                                                                                                 // 246
	  if (                                                                                                              // 247
	    newValue &&                                                                                                     // 248
	    (typeof newValue === 'object' || typeof newValue === 'function')                                                // 249
	  ) {                                                                                                               // 250
	    var then = getThen(newValue);                                                                                   // 251
	    if (then === IS_ERROR) {                                                                                        // 252
	      return reject(self, LAST_ERROR);                                                                              // 253
	    }                                                                                                               // 254
	    if (                                                                                                            // 255
	      then === self.then &&                                                                                         // 256
	      newValue instanceof Promise                                                                                   // 257
	    ) {                                                                                                             // 258
	      self._37 = 3;                                                                                                 // 259
	      self._12 = newValue;                                                                                          // 260
	      finale(self);                                                                                                 // 261
	      return;                                                                                                       // 262
	    } else if (typeof then === 'function') {                                                                        // 263
	      doResolve(then.bind(newValue), self);                                                                         // 264
	      return;                                                                                                       // 265
	    }                                                                                                               // 266
	  }                                                                                                                 // 267
	  self._37 = 1;                                                                                                     // 268
	  self._12 = newValue;                                                                                              // 269
	  finale(self);                                                                                                     // 270
	}                                                                                                                   // 271
                                                                                                                     // 272
	function reject(self, newValue) {                                                                                   // 273
	  self._37 = 2;                                                                                                     // 274
	  self._12 = newValue;                                                                                              // 275
	  finale(self);                                                                                                     // 276
	}                                                                                                                   // 277
	function finale(self) {                                                                                             // 278
	  for (var i = 0; i < self._59.length; i++) {                                                                       // 279
	    handle(self, self._59[i]);                                                                                      // 280
	  }                                                                                                                 // 281
	  self._59 = null;                                                                                                  // 282
	}                                                                                                                   // 283
                                                                                                                     // 284
	function Handler(onFulfilled, onRejected, promise){                                                                 // 285
	  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;                                        // 286
	  this.onRejected = typeof onRejected === 'function' ? onRejected : null;                                           // 287
	  this.promise = promise;                                                                                           // 288
	}                                                                                                                   // 289
                                                                                                                     // 290
	/**                                                                                                                 // 291
	 * Take a potentially misbehaving resolver function and make sure                                                   // 292
	 * onFulfilled and onRejected are only called once.                                                                 // 293
	 *                                                                                                                  // 294
	 * Makes no guarantees about asynchrony.                                                                            // 295
	 */                                                                                                                 // 296
	function doResolve(fn, promise) {                                                                                   // 297
	  var done = false;                                                                                                 // 298
	  var res = tryCallTwo(fn, function (value) {                                                                       // 299
	    if (done) return;                                                                                               // 300
	    done = true;                                                                                                    // 301
	    resolve(promise, value);                                                                                        // 302
	  }, function (reason) {                                                                                            // 303
	    if (done) return;                                                                                               // 304
	    done = true;                                                                                                    // 305
	    reject(promise, reason);                                                                                        // 306
	  })                                                                                                                // 307
	  if (!done && res === IS_ERROR) {                                                                                  // 308
	    done = true;                                                                                                    // 309
	    reject(promise, LAST_ERROR);                                                                                    // 310
	  }                                                                                                                 // 311
	}                                                                                                                   // 312
                                                                                                                     // 313
                                                                                                                     // 314
/***/ },                                                                                                             // 315
/* 5 */                                                                                                              // 316
/***/ function(module, exports) {                                                                                    // 317
                                                                                                                     // 318
	/* WEBPACK VAR INJECTION */(function(global) {"use strict";                                                         // 319
                                                                                                                     // 320
	// Use the fastest means possible to execute a task in its own turn, with                                           // 321
	// priority over other events including IO, animation, reflow, and redraw                                           // 322
	// events in browsers.                                                                                              // 323
	//                                                                                                                  // 324
	// An exception thrown by a task will permanently interrupt the processing of                                       // 325
	// subsequent tasks. The higher level `asap` function ensures that if an                                            // 326
	// exception is thrown by a task, that the task queue will continue flushing as                                     // 327
	// soon as possible, but if you use `rawAsap` directly, you are responsible to                                      // 328
	// either ensure that no exceptions are thrown from your task, or to manually                                       // 329
	// call `rawAsap.requestFlush` if an exception is thrown.                                                           // 330
	module.exports = rawAsap;                                                                                           // 331
	function rawAsap(task) {                                                                                            // 332
	    if (!queue.length) {                                                                                            // 333
	        requestFlush();                                                                                             // 334
	        flushing = true;                                                                                            // 335
	    }                                                                                                               // 336
	    // Equivalent to push, but avoids a function call.                                                              // 337
	    queue[queue.length] = task;                                                                                     // 338
	}                                                                                                                   // 339
                                                                                                                     // 340
	var queue = [];                                                                                                     // 341
	// Once a flush has been requested, no further calls to `requestFlush` are                                          // 342
	// necessary until the next `flush` completes.                                                                      // 343
	var flushing = false;                                                                                               // 344
	// `requestFlush` is an implementation-specific method that attempts to kick                                        // 345
	// off a `flush` event as quickly as possible. `flush` will attempt to exhaust                                      // 346
	// the event queue before yielding to the browser's own event loop.                                                 // 347
	var requestFlush;                                                                                                   // 348
	// The position of the next task to execute in the task queue. This is                                              // 349
	// preserved between calls to `flush` so that it can be resumed if                                                  // 350
	// a task throws an exception.                                                                                      // 351
	var index = 0;                                                                                                      // 352
	// If a task schedules additional tasks recursively, the task queue can grow                                        // 353
	// unbounded. To prevent memory exhaustion, the task queue will periodically                                        // 354
	// truncate already-completed tasks.                                                                                // 355
	var capacity = 1024;                                                                                                // 356
                                                                                                                     // 357
	// The flush function processes all tasks that have been scheduled with                                             // 358
	// `rawAsap` unless and until one of those tasks throws an exception.                                               // 359
	// If a task throws an exception, `flush` ensures that its state will remain                                        // 360
	// consistent and will resume where it left off when called again.                                                  // 361
	// However, `flush` does not make any arrangements to be called again if an                                         // 362
	// exception is thrown.                                                                                             // 363
	function flush() {                                                                                                  // 364
	    while (index < queue.length) {                                                                                  // 365
	        var currentIndex = index;                                                                                   // 366
	        // Advance the index before calling the task. This ensures that we will                                     // 367
	        // begin flushing on the next task the task throws an error.                                                // 368
	        index = index + 1;                                                                                          // 369
	        queue[currentIndex].call();                                                                                 // 370
	        // Prevent leaking memory for long chains of recursive calls to `asap`.                                     // 371
	        // If we call `asap` within tasks scheduled by `asap`, the queue will                                       // 372
	        // grow, but to avoid an O(n) walk for every task we execute, we don't                                      // 373
	        // shift tasks off the queue after they have been executed.                                                 // 374
	        // Instead, we periodically shift 1024 tasks off the queue.                                                 // 375
	        if (index > capacity) {                                                                                     // 376
	            // Manually shift all values starting at the index back to the                                          // 377
	            // beginning of the queue.                                                                              // 378
	            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {                        // 379
	                queue[scan] = queue[scan + index];                                                                  // 380
	            }                                                                                                       // 381
	            queue.length -= index;                                                                                  // 382
	            index = 0;                                                                                              // 383
	        }                                                                                                           // 384
	    }                                                                                                               // 385
	    queue.length = 0;                                                                                               // 386
	    index = 0;                                                                                                      // 387
	    flushing = false;                                                                                               // 388
	}                                                                                                                   // 389
                                                                                                                     // 390
	// `requestFlush` is implemented using a strategy based on data collected from                                      // 391
	// every available SauceLabs Selenium web driver worker at time of writing.                                         // 392
	// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593           // 393
                                                                                                                     // 394
	// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that                                        // 395
	// have WebKitMutationObserver but not un-prefixed MutationObserver.                                                // 396
	// Must use `global` instead of `window` to work in both frames and web                                             // 397
	// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.                                                 // 398
	var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;                             // 399
                                                                                                                     // 400
	// MutationObservers are desirable because they have high priority and work                                         // 401
	// reliably everywhere they are implemented.                                                                        // 402
	// They are implemented in all modern browsers.                                                                     // 403
	//                                                                                                                  // 404
	// - Android 4-4.3                                                                                                  // 405
	// - Chrome 26-34                                                                                                   // 406
	// - Firefox 14-29                                                                                                  // 407
	// - Internet Explorer 11                                                                                           // 408
	// - iPad Safari 6-7.1                                                                                              // 409
	// - iPhone Safari 7-7.1                                                                                            // 410
	// - Safari 6-7                                                                                                     // 411
	if (typeof BrowserMutationObserver === "function") {                                                                // 412
	    requestFlush = makeRequestCallFromMutationObserver(flush);                                                      // 413
                                                                                                                     // 414
	// MessageChannels are desirable because they give direct access to the HTML                                        // 415
	// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera                                     // 416
	// 11-12, and in web workers in many engines.                                                                       // 417
	// Although message channels yield to any queued rendering and IO tasks, they                                       // 418
	// would be better than imposing the 4ms delay of timers.                                                           // 419
	// However, they do not work reliably in Internet Explorer or Safari.                                               // 420
                                                                                                                     // 421
	// Internet Explorer 10 is the only browser that has setImmediate but does                                          // 422
	// not have MutationObservers.                                                                                      // 423
	// Although setImmediate yields to the browser's renderer, it would be                                              // 424
	// preferrable to falling back to setTimeout since it does not have                                                 // 425
	// the minimum 4ms penalty.                                                                                         // 426
	// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and                                      // 427
	// Desktop to a lesser extent) that renders both setImmediate and                                                   // 428
	// MessageChannel useless for the purposes of ASAP.                                                                 // 429
	// https://github.com/kriskowal/q/issues/396                                                                        // 430
                                                                                                                     // 431
	// Timers are implemented universally.                                                                              // 432
	// We fall back to timers in workers in most engines, and in foreground                                             // 433
	// contexts in the following browsers.                                                                              // 434
	// However, note that even this simple case requires nuances to operate in a                                        // 435
	// broad spectrum of browsers.                                                                                      // 436
	//                                                                                                                  // 437
	// - Firefox 3-13                                                                                                   // 438
	// - Internet Explorer 6-9                                                                                          // 439
	// - iPad Safari 4.3                                                                                                // 440
	// - Lynx 2.8.7                                                                                                     // 441
	} else {                                                                                                            // 442
	    requestFlush = makeRequestCallFromTimer(flush);                                                                 // 443
	}                                                                                                                   // 444
                                                                                                                     // 445
	// `requestFlush` requests that the high priority event queue be flushed as                                         // 446
	// soon as possible.                                                                                                // 447
	// This is useful to prevent an error thrown in a task from stalling the event                                      // 448
	// queue if the exception handled by Node.js’s                                                                      // 449
	// `process.on("uncaughtException")` or by a domain.                                                                // 450
	rawAsap.requestFlush = requestFlush;                                                                                // 451
                                                                                                                     // 452
	// To request a high priority event, we induce a mutation observer by toggling                                      // 453
	// the text of a text node between "1" and "-1".                                                                    // 454
	function makeRequestCallFromMutationObserver(callback) {                                                            // 455
	    var toggle = 1;                                                                                                 // 456
	    var observer = new BrowserMutationObserver(callback);                                                           // 457
	    var node = document.createTextNode("");                                                                         // 458
	    observer.observe(node, {characterData: true});                                                                  // 459
	    return function requestCall() {                                                                                 // 460
	        toggle = -toggle;                                                                                           // 461
	        node.data = toggle;                                                                                         // 462
	    };                                                                                                              // 463
	}                                                                                                                   // 464
                                                                                                                     // 465
	// The message channel technique was discovered by Malte Ubl and was the                                            // 466
	// original foundation for this library.                                                                            // 467
	// http://www.nonblocking.io/2011/06/windownexttick.html                                                            // 468
                                                                                                                     // 469
	// Safari 6.0.5 (at least) intermittently fails to create message ports on a                                        // 470
	// page's first load. Thankfully, this version of Safari supports                                                   // 471
	// MutationObservers, so we don't need to fall back in that case.                                                   // 472
                                                                                                                     // 473
	// function makeRequestCallFromMessageChannel(callback) {                                                           // 474
	//     var channel = new MessageChannel();                                                                          // 475
	//     channel.port1.onmessage = callback;                                                                          // 476
	//     return function requestCall() {                                                                              // 477
	//         channel.port2.postMessage(0);                                                                            // 478
	//     };                                                                                                           // 479
	// }                                                                                                                // 480
                                                                                                                     // 481
	// For reasons explained above, we are also unable to use `setImmediate`                                            // 482
	// under any circumstances.                                                                                         // 483
	// Even if we were, there is another bug in Internet Explorer 10.                                                   // 484
	// It is not sufficient to assign `setImmediate` to `requestFlush` because                                          // 485
	// `setImmediate` must be called *by name* and therefore must be wrapped in a                                       // 486
	// closure.                                                                                                         // 487
	// Never forget.                                                                                                    // 488
                                                                                                                     // 489
	// function makeRequestCallFromSetImmediate(callback) {                                                             // 490
	//     return function requestCall() {                                                                              // 491
	//         setImmediate(callback);                                                                                  // 492
	//     };                                                                                                           // 493
	// }                                                                                                                // 494
                                                                                                                     // 495
	// Safari 6.0 has a problem where timers will get lost while the user is                                            // 496
	// scrolling. This problem does not impact ASAP because Safari 6.0 supports                                         // 497
	// mutation observers, so that implementation is used instead.                                                      // 498
	// However, if we ever elect to use timers in Safari, the prevalent work-around                                     // 499
	// is to add a scroll event listener that calls for a flush.                                                        // 500
                                                                                                                     // 501
	// `setTimeout` does not call the passed callback if the delay is less than                                         // 502
	// approximately 7 in web workers in Firefox 8 through 18, and sometimes not                                        // 503
	// even then.                                                                                                       // 504
                                                                                                                     // 505
	function makeRequestCallFromTimer(callback) {                                                                       // 506
	    return function requestCall() {                                                                                 // 507
	        // We dispatch a timeout with a specified delay of 0 for engines that                                       // 508
	        // can reliably accommodate that request. This will usually be snapped                                      // 509
	        // to a 4 milisecond delay, but once we're flushing, there's no delay                                       // 510
	        // between events.                                                                                          // 511
	        var timeoutHandle = setTimeout(handleTimer, 0);                                                             // 512
	        // However, since this timer gets frequently dropped in Firefox                                             // 513
	        // workers, we enlist an interval handle that will try to fire                                              // 514
	        // an event 20 times per second until it succeeds.                                                          // 515
	        var intervalHandle = setInterval(handleTimer, 50);                                                          // 516
                                                                                                                     // 517
	        function handleTimer() {                                                                                    // 518
	            // Whichever timer succeeds will cancel both timers and                                                 // 519
	            // execute the callback.                                                                                // 520
	            clearTimeout(timeoutHandle);                                                                            // 521
	            clearInterval(intervalHandle);                                                                          // 522
	            callback();                                                                                             // 523
	        }                                                                                                           // 524
	    };                                                                                                              // 525
	}                                                                                                                   // 526
                                                                                                                     // 527
	// This is for `asap.js` only.                                                                                      // 528
	// Its name will be periodically randomized to break any code that depends on                                       // 529
	// its existence.                                                                                                   // 530
	rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;                                                        // 531
                                                                                                                     // 532
	// ASAP was originally a nextTick shim included in Q. This was factored out                                         // 533
	// into this ASAP package. It was later adapted to RSVP which made further                                          // 534
	// amendments. These decisions, particularly to marginalize MessageChannel and                                      // 535
	// to capture the MutationObserver implementation in a closure, were integrated                                     // 536
	// back into ASAP proper.                                                                                           // 537
	// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js                // 538
                                                                                                                     // 539
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))                                        // 540
                                                                                                                     // 541
/***/ },                                                                                                             // 542
/* 6 */                                                                                                              // 543
/***/ function(module, exports, __webpack_require__) {                                                               // 544
                                                                                                                     // 545
	'use strict';                                                                                                       // 546
                                                                                                                     // 547
	var Promise = __webpack_require__(4);                                                                               // 548
                                                                                                                     // 549
	module.exports = Promise;                                                                                           // 550
	Promise.prototype.done = function (onFulfilled, onRejected) {                                                       // 551
	  var self = arguments.length ? this.then.apply(this, arguments) : this;                                            // 552
	  self.then(null, function (err) {                                                                                  // 553
	    setTimeout(function () {                                                                                        // 554
	      throw err;                                                                                                    // 555
	    }, 0);                                                                                                          // 556
	  });                                                                                                               // 557
	};                                                                                                                  // 558
                                                                                                                     // 559
                                                                                                                     // 560
/***/ },                                                                                                             // 561
/* 7 */                                                                                                              // 562
/***/ function(module, exports, __webpack_require__) {                                                               // 563
                                                                                                                     // 564
	'use strict';                                                                                                       // 565
                                                                                                                     // 566
	var Promise = __webpack_require__(4);                                                                               // 567
                                                                                                                     // 568
	module.exports = Promise;                                                                                           // 569
	Promise.prototype['finally'] = function (f) {                                                                       // 570
	  return this.then(function (value) {                                                                               // 571
	    return Promise.resolve(f()).then(function () {                                                                  // 572
	      return value;                                                                                                 // 573
	    });                                                                                                             // 574
	  }, function (err) {                                                                                               // 575
	    return Promise.resolve(f()).then(function () {                                                                  // 576
	      throw err;                                                                                                    // 577
	    });                                                                                                             // 578
	  });                                                                                                               // 579
	};                                                                                                                  // 580
                                                                                                                     // 581
                                                                                                                     // 582
/***/ },                                                                                                             // 583
/* 8 */                                                                                                              // 584
/***/ function(module, exports, __webpack_require__) {                                                               // 585
                                                                                                                     // 586
	'use strict';                                                                                                       // 587
                                                                                                                     // 588
	//This file contains the ES6 extensions to the core Promises/A+ API                                                 // 589
                                                                                                                     // 590
	var Promise = __webpack_require__(4);                                                                               // 591
                                                                                                                     // 592
	module.exports = Promise;                                                                                           // 593
                                                                                                                     // 594
	/* Static Functions */                                                                                              // 595
                                                                                                                     // 596
	var TRUE = valuePromise(true);                                                                                      // 597
	var FALSE = valuePromise(false);                                                                                    // 598
	var NULL = valuePromise(null);                                                                                      // 599
	var UNDEFINED = valuePromise(undefined);                                                                            // 600
	var ZERO = valuePromise(0);                                                                                         // 601
	var EMPTYSTRING = valuePromise('');                                                                                 // 602
                                                                                                                     // 603
	function valuePromise(value) {                                                                                      // 604
	  var p = new Promise(Promise._99);                                                                                 // 605
	  p._37 = 1;                                                                                                        // 606
	  p._12 = value;                                                                                                    // 607
	  return p;                                                                                                         // 608
	}                                                                                                                   // 609
	Promise.resolve = function (value) {                                                                                // 610
	  if (value instanceof Promise) return value;                                                                       // 611
                                                                                                                     // 612
	  if (value === null) return NULL;                                                                                  // 613
	  if (value === undefined) return UNDEFINED;                                                                        // 614
	  if (value === true) return TRUE;                                                                                  // 615
	  if (value === false) return FALSE;                                                                                // 616
	  if (value === 0) return ZERO;                                                                                     // 617
	  if (value === '') return EMPTYSTRING;                                                                             // 618
                                                                                                                     // 619
	  if (typeof value === 'object' || typeof value === 'function') {                                                   // 620
	    try {                                                                                                           // 621
	      var then = value.then;                                                                                        // 622
	      if (typeof then === 'function') {                                                                             // 623
	        return new Promise(then.bind(value));                                                                       // 624
	      }                                                                                                             // 625
	    } catch (ex) {                                                                                                  // 626
	      return new Promise(function (resolve, reject) {                                                               // 627
	        reject(ex);                                                                                                 // 628
	      });                                                                                                           // 629
	    }                                                                                                               // 630
	  }                                                                                                                 // 631
	  return valuePromise(value);                                                                                       // 632
	};                                                                                                                  // 633
                                                                                                                     // 634
	Promise.all = function (arr) {                                                                                      // 635
	  var args = Array.prototype.slice.call(arr);                                                                       // 636
                                                                                                                     // 637
	  return new Promise(function (resolve, reject) {                                                                   // 638
	    if (args.length === 0) return resolve([]);                                                                      // 639
	    var remaining = args.length;                                                                                    // 640
	    function res(i, val) {                                                                                          // 641
	      if (val && (typeof val === 'object' || typeof val === 'function')) {                                          // 642
	        if (val instanceof Promise && val.then === Promise.prototype.then) {                                        // 643
	          while (val._37 === 3) {                                                                                   // 644
	            val = val._12;                                                                                          // 645
	          }                                                                                                         // 646
	          if (val._37 === 1) return res(i, val._12);                                                                // 647
	          if (val._37 === 2) reject(val._12);                                                                       // 648
	          val.then(function (val) {                                                                                 // 649
	            res(i, val);                                                                                            // 650
	          }, reject);                                                                                               // 651
	          return;                                                                                                   // 652
	        } else {                                                                                                    // 653
	          var then = val.then;                                                                                      // 654
	          if (typeof then === 'function') {                                                                         // 655
	            var p = new Promise(then.bind(val));                                                                    // 656
	            p.then(function (val) {                                                                                 // 657
	              res(i, val);                                                                                          // 658
	            }, reject);                                                                                             // 659
	            return;                                                                                                 // 660
	          }                                                                                                         // 661
	        }                                                                                                           // 662
	      }                                                                                                             // 663
	      args[i] = val;                                                                                                // 664
	      if (--remaining === 0) {                                                                                      // 665
	        resolve(args);                                                                                              // 666
	      }                                                                                                             // 667
	    }                                                                                                               // 668
	    for (var i = 0; i < args.length; i++) {                                                                         // 669
	      res(i, args[i]);                                                                                              // 670
	    }                                                                                                               // 671
	  });                                                                                                               // 672
	};                                                                                                                  // 673
                                                                                                                     // 674
	Promise.reject = function (value) {                                                                                 // 675
	  return new Promise(function (resolve, reject) {                                                                   // 676
	    reject(value);                                                                                                  // 677
	  });                                                                                                               // 678
	};                                                                                                                  // 679
                                                                                                                     // 680
	Promise.race = function (values) {                                                                                  // 681
	  return new Promise(function (resolve, reject) {                                                                   // 682
	    values.forEach(function(value){                                                                                 // 683
	      Promise.resolve(value).then(resolve, reject);                                                                 // 684
	    });                                                                                                             // 685
	  });                                                                                                               // 686
	};                                                                                                                  // 687
                                                                                                                     // 688
	/* Prototype Methods */                                                                                             // 689
                                                                                                                     // 690
	Promise.prototype['catch'] = function (onRejected) {                                                                // 691
	  return this.then(null, onRejected);                                                                               // 692
	};                                                                                                                  // 693
                                                                                                                     // 694
                                                                                                                     // 695
/***/ },                                                                                                             // 696
/* 9 */                                                                                                              // 697
/***/ function(module, exports, __webpack_require__) {                                                               // 698
                                                                                                                     // 699
	'use strict';                                                                                                       // 700
                                                                                                                     // 701
	// This file contains then/promise specific extensions that are only useful                                         // 702
	// for node.js interop                                                                                              // 703
                                                                                                                     // 704
	var Promise = __webpack_require__(4);                                                                               // 705
	var asap = __webpack_require__(10);                                                                                 // 706
                                                                                                                     // 707
	module.exports = Promise;                                                                                           // 708
                                                                                                                     // 709
	/* Static Functions */                                                                                              // 710
                                                                                                                     // 711
	Promise.denodeify = function (fn, argumentCount) {                                                                  // 712
	  argumentCount = argumentCount || Infinity;                                                                        // 713
	  return function () {                                                                                              // 714
	    var self = this;                                                                                                // 715
	    var args = Array.prototype.slice.call(arguments, 0,                                                             // 716
	        argumentCount > 0 ? argumentCount : 0);                                                                     // 717
	    return new Promise(function (resolve, reject) {                                                                 // 718
	      args.push(function (err, res) {                                                                               // 719
	        if (err) reject(err);                                                                                       // 720
	        else resolve(res);                                                                                          // 721
	      })                                                                                                            // 722
	      var res = fn.apply(self, args);                                                                               // 723
	      if (res &&                                                                                                    // 724
	        (                                                                                                           // 725
	          typeof res === 'object' ||                                                                                // 726
	          typeof res === 'function'                                                                                 // 727
	        ) &&                                                                                                        // 728
	        typeof res.then === 'function'                                                                              // 729
	      ) {                                                                                                           // 730
	        resolve(res);                                                                                               // 731
	      }                                                                                                             // 732
	    })                                                                                                              // 733
	  }                                                                                                                 // 734
	}                                                                                                                   // 735
	Promise.nodeify = function (fn) {                                                                                   // 736
	  return function () {                                                                                              // 737
	    var args = Array.prototype.slice.call(arguments);                                                               // 738
	    var callback =                                                                                                  // 739
	      typeof args[args.length - 1] === 'function' ? args.pop() : null;                                              // 740
	    var ctx = this;                                                                                                 // 741
	    try {                                                                                                           // 742
	      return fn.apply(this, arguments).nodeify(callback, ctx);                                                      // 743
	    } catch (ex) {                                                                                                  // 744
	      if (callback === null || typeof callback == 'undefined') {                                                    // 745
	        return new Promise(function (resolve, reject) {                                                             // 746
	          reject(ex);                                                                                               // 747
	        });                                                                                                         // 748
	      } else {                                                                                                      // 749
	        asap(function () {                                                                                          // 750
	          callback.call(ctx, ex);                                                                                   // 751
	        })                                                                                                          // 752
	      }                                                                                                             // 753
	    }                                                                                                               // 754
	  }                                                                                                                 // 755
	}                                                                                                                   // 756
                                                                                                                     // 757
	Promise.prototype.nodeify = function (callback, ctx) {                                                              // 758
	  if (typeof callback != 'function') return this;                                                                   // 759
                                                                                                                     // 760
	  this.then(function (value) {                                                                                      // 761
	    asap(function () {                                                                                              // 762
	      callback.call(ctx, null, value);                                                                              // 763
	    });                                                                                                             // 764
	  }, function (err) {                                                                                               // 765
	    asap(function () {                                                                                              // 766
	      callback.call(ctx, err);                                                                                      // 767
	    });                                                                                                             // 768
	  });                                                                                                               // 769
	}                                                                                                                   // 770
                                                                                                                     // 771
                                                                                                                     // 772
/***/ },                                                                                                             // 773
/* 10 */                                                                                                             // 774
/***/ function(module, exports, __webpack_require__) {                                                               // 775
                                                                                                                     // 776
	"use strict";                                                                                                       // 777
                                                                                                                     // 778
	// rawAsap provides everything we need except exception management.                                                 // 779
	var rawAsap = __webpack_require__(5);                                                                               // 780
	// RawTasks are recycled to reduce GC churn.                                                                        // 781
	var freeTasks = [];                                                                                                 // 782
	// We queue errors to ensure they are thrown in right order (FIFO).                                                 // 783
	// Array-as-queue is good enough here, since we are just dealing with exceptions.                                   // 784
	var pendingErrors = [];                                                                                             // 785
	var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);                                          // 786
                                                                                                                     // 787
	function throwFirstError() {                                                                                        // 788
	    if (pendingErrors.length) {                                                                                     // 789
	        throw pendingErrors.shift();                                                                                // 790
	    }                                                                                                               // 791
	}                                                                                                                   // 792
                                                                                                                     // 793
	/**                                                                                                                 // 794
	 * Calls a task as soon as possible after returning, in its own event, with priority                                // 795
	 * over other events like animation, reflow, and repaint. An error thrown from an                                   // 796
	 * event will not interrupt, nor even substantially slow down the processing of                                     // 797
	 * other events, but will be rather postponed to a lower priority event.                                            // 798
	 * @param {{call}} task A callable object, typically a function that takes no                                       // 799
	 * arguments.                                                                                                       // 800
	 */                                                                                                                 // 801
	module.exports = asap;                                                                                              // 802
	function asap(task) {                                                                                               // 803
	    var rawTask;                                                                                                    // 804
	    if (freeTasks.length) {                                                                                         // 805
	        rawTask = freeTasks.pop();                                                                                  // 806
	    } else {                                                                                                        // 807
	        rawTask = new RawTask();                                                                                    // 808
	    }                                                                                                               // 809
	    rawTask.task = task;                                                                                            // 810
	    rawAsap(rawTask);                                                                                               // 811
	}                                                                                                                   // 812
                                                                                                                     // 813
	// We wrap tasks with recyclable task objects.  A task object implements                                            // 814
	// `call`, just like a function.                                                                                    // 815
	function RawTask() {                                                                                                // 816
	    this.task = null;                                                                                               // 817
	}                                                                                                                   // 818
                                                                                                                     // 819
	// The sole purpose of wrapping the task is to catch the exception and recycle                                      // 820
	// the task object after its single use.                                                                            // 821
	RawTask.prototype.call = function () {                                                                              // 822
	    try {                                                                                                           // 823
	        this.task.call();                                                                                           // 824
	    } catch (error) {                                                                                               // 825
	        if (asap.onerror) {                                                                                         // 826
	            // This hook exists purely for testing purposes.                                                        // 827
	            // Its name will be periodically randomized to break any code that                                      // 828
	            // depends on its existence.                                                                            // 829
	            asap.onerror(error);                                                                                    // 830
	        } else {                                                                                                    // 831
	            // In a web browser, exceptions are not fatal. However, to avoid                                        // 832
	            // slowing down the queue of pending tasks, we rethrow the error in a                                   // 833
	            // lower priority turn.                                                                                 // 834
	            pendingErrors.push(error);                                                                              // 835
	            requestErrorThrow();                                                                                    // 836
	        }                                                                                                           // 837
	    } finally {                                                                                                     // 838
	        this.task = null;                                                                                           // 839
	        freeTasks[freeTasks.length] = this;                                                                         // 840
	    }                                                                                                               // 841
	};                                                                                                                  // 842
                                                                                                                     // 843
                                                                                                                     // 844
/***/ }                                                                                                              // 845
/******/ ]);                                                                                                         // 846
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.promise = {
  Promise: Promise
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
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var EJSON = Package.ejson.EJSON;
var ECMAScript = Package.ecmascript.ECMAScript;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var ReactiveDict;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactive-dict/reactive-dict.js                                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
// XXX come up with a serialization method which canonicalizes object key                                         //
// order, which would allow us to use objects as values for equals.                                               //
var stringify = function (value) {                                                                                // 3
  if (value === undefined) return 'undefined';                                                                    // 4
  return EJSON.stringify(value);                                                                                  // 6
};                                                                                                                //
var parse = function (serialized) {                                                                               // 8
  if (serialized === undefined || serialized === 'undefined') return undefined;                                   // 9
  return EJSON.parse(serialized);                                                                                 // 11
};                                                                                                                //
                                                                                                                  //
var changed = function (v) {                                                                                      // 14
  v && v.changed();                                                                                               // 15
};                                                                                                                //
                                                                                                                  //
// XXX COMPAT WITH 0.9.1 : accept migrationData instead of dictName                                               //
ReactiveDict = function (dictName) {                                                                              // 19
  // this.keys: key -> value                                                                                      //
  if (dictName) {                                                                                                 // 21
    if (typeof dictName === 'string') {                                                                           // 22
      // the normal case, argument is a string name.                                                              //
      // _registerDictForMigrate will throw an error on duplicate name.                                           //
      ReactiveDict._registerDictForMigrate(dictName, this);                                                       // 25
      this.keys = ReactiveDict._loadMigratedDict(dictName) || {};                                                 // 26
      this.name = dictName;                                                                                       // 27
    } else if (typeof dictName === 'object') {                                                                    //
      // back-compat case: dictName is actually migrationData                                                     //
      this.keys = dictName;                                                                                       // 30
    } else {                                                                                                      //
      throw new Error("Invalid ReactiveDict argument: " + dictName);                                              // 32
    }                                                                                                             //
  } else {                                                                                                        //
    // no name given; no migration will be performed                                                              //
    this.keys = {};                                                                                               // 36
  }                                                                                                               //
                                                                                                                  //
  this.allDeps = new Tracker.Dependency();                                                                        // 39
  this.keyDeps = {}; // key -> Dependency                                                                         // 40
  this.keyValueDeps = {}; // key -> Dependency                                                                    // 41
};                                                                                                                //
                                                                                                                  //
_.extend(ReactiveDict.prototype, {                                                                                // 44
  // set() began as a key/value method, but we are now overloading it                                             //
  // to take an object of key/value pairs, similar to backbone                                                    //
  // http://backbonejs.org/#Model-set                                                                             //
                                                                                                                  //
  set: function (keyOrObject, value) {                                                                            // 49
    var self = this;                                                                                              // 50
                                                                                                                  //
    if (typeof keyOrObject === 'object' && value === undefined) {                                                 // 52
      // Called as `dict.set({...})`                                                                              //
      self._setObject(keyOrObject);                                                                               // 54
      return;                                                                                                     // 55
    }                                                                                                             //
    // the input isn't an object, so it must be a key                                                             //
    // and we resume with the rest of the function                                                                //
    var key = keyOrObject;                                                                                        // 59
                                                                                                                  //
    value = stringify(value);                                                                                     // 61
                                                                                                                  //
    var keyExisted = _.has(self.keys, key);                                                                       // 63
    var oldSerializedValue = keyExisted ? self.keys[key] : 'undefined';                                           // 64
    var isNewValue = value !== oldSerializedValue;                                                                // 65
                                                                                                                  //
    self.keys[key] = value;                                                                                       // 67
                                                                                                                  //
    if (isNewValue || !keyExisted) {                                                                              // 69
      self.allDeps.changed();                                                                                     // 70
    }                                                                                                             //
                                                                                                                  //
    if (isNewValue) {                                                                                             // 73
      changed(self.keyDeps[key]);                                                                                 // 74
      if (self.keyValueDeps[key]) {                                                                               // 75
        changed(self.keyValueDeps[key][oldSerializedValue]);                                                      // 76
        changed(self.keyValueDeps[key][value]);                                                                   // 77
      }                                                                                                           //
    }                                                                                                             //
  },                                                                                                              //
                                                                                                                  //
  setDefault: function (key, value) {                                                                             // 82
    var self = this;                                                                                              // 83
    if (!_.has(self.keys, key)) {                                                                                 // 84
      self.set(key, value);                                                                                       // 85
    }                                                                                                             //
  },                                                                                                              //
                                                                                                                  //
  get: function (key) {                                                                                           // 89
    var self = this;                                                                                              // 90
    self._ensureKey(key);                                                                                         // 91
    self.keyDeps[key].depend();                                                                                   // 92
    return parse(self.keys[key]);                                                                                 // 93
  },                                                                                                              //
                                                                                                                  //
  equals: function (key, value) {                                                                                 // 96
    var self = this;                                                                                              // 97
                                                                                                                  //
    // Mongo.ObjectID is in the 'mongo' package                                                                   //
    var ObjectID = null;                                                                                          // 100
    if (Package.mongo) {                                                                                          // 101
      ObjectID = Package.mongo.Mongo.ObjectID;                                                                    // 102
    }                                                                                                             //
                                                                                                                  //
    // We don't allow objects (or arrays that might include objects) for                                          //
    // .equals, because JSON.stringify doesn't canonicalize object key                                            //
    // order. (We can make equals have the right return value by parsing the                                      //
    // current value and using EJSON.equals, but we won't have a canonical                                        //
    // element of keyValueDeps[key] to store the dependency.) You can still use                                   //
    // "EJSON.equals(reactiveDict.get(key), value)".                                                              //
    //                                                                                                            //
    // XXX we could allow arrays as long as we recursively check that there                                       //
    // are no objects                                                                                             //
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && typeof value !== 'undefined' && !(value instanceof Date) && !(ObjectID && value instanceof ObjectID) && value !== null) {
      throw new Error("ReactiveDict.equals: value must be scalar");                                               // 121
    }                                                                                                             //
    var serializedValue = stringify(value);                                                                       // 123
                                                                                                                  //
    if (Tracker.active) {                                                                                         // 125
      self._ensureKey(key);                                                                                       // 126
                                                                                                                  //
      if (!_.has(self.keyValueDeps[key], serializedValue)) self.keyValueDeps[key][serializedValue] = new Tracker.Dependency();
                                                                                                                  //
      var isNew = self.keyValueDeps[key][serializedValue].depend();                                               // 131
      if (isNew) {                                                                                                // 132
        Tracker.onInvalidate(function () {                                                                        // 133
          // clean up [key][serializedValue] if it's now empty, so we don't                                       //
          // use O(n) memory for n = values seen ever                                                             //
          if (!self.keyValueDeps[key][serializedValue].hasDependents()) delete self.keyValueDeps[key][serializedValue];
        });                                                                                                       //
      }                                                                                                           //
    }                                                                                                             //
                                                                                                                  //
    var oldValue = undefined;                                                                                     // 142
    if (_.has(self.keys, key)) oldValue = parse(self.keys[key]);                                                  // 143
    return EJSON.equals(oldValue, value);                                                                         // 144
  },                                                                                                              //
                                                                                                                  //
  all: function () {                                                                                              // 147
    this.allDeps.depend();                                                                                        // 148
    var ret = {};                                                                                                 // 149
    _.each(this.keys, function (value, key) {                                                                     // 150
      ret[key] = parse(value);                                                                                    // 151
    });                                                                                                           //
    return ret;                                                                                                   // 153
  },                                                                                                              //
                                                                                                                  //
  clear: function () {                                                                                            // 156
    var self = this;                                                                                              // 157
                                                                                                                  //
    var oldKeys = self.keys;                                                                                      // 159
    self.keys = {};                                                                                               // 160
                                                                                                                  //
    self.allDeps.changed();                                                                                       // 162
                                                                                                                  //
    _.each(oldKeys, function (value, key) {                                                                       // 164
      changed(self.keyDeps[key]);                                                                                 // 165
      changed(self.keyValueDeps[key][value]);                                                                     // 166
      changed(self.keyValueDeps[key]['undefined']);                                                               // 167
    });                                                                                                           //
  },                                                                                                              //
                                                                                                                  //
  'delete': function (key) {                                                                                      // 172
    var self = this;                                                                                              // 173
    var didRemove = false;                                                                                        // 174
                                                                                                                  //
    if (_.has(self.keys, key)) {                                                                                  // 176
      var oldValue = self.keys[key];                                                                              // 177
      delete self.keys[key];                                                                                      // 178
      changed(self.keyDeps[key]);                                                                                 // 179
      if (self.keyValueDeps[key]) {                                                                               // 180
        changed(self.keyValueDeps[key][oldValue]);                                                                // 181
        changed(self.keyValueDeps[key]['undefined']);                                                             // 182
      }                                                                                                           //
      self.allDeps.changed();                                                                                     // 184
      didRemove = true;                                                                                           // 185
    }                                                                                                             //
                                                                                                                  //
    return didRemove;                                                                                             // 188
  },                                                                                                              //
                                                                                                                  //
  _setObject: function (object) {                                                                                 // 191
    var self = this;                                                                                              // 192
                                                                                                                  //
    _.each(object, function (value, key) {                                                                        // 194
      self.set(key, value);                                                                                       // 195
    });                                                                                                           //
  },                                                                                                              //
                                                                                                                  //
  _ensureKey: function (key) {                                                                                    // 199
    var self = this;                                                                                              // 200
    if (!(key in self.keyDeps)) {                                                                                 // 201
      self.keyDeps[key] = new Tracker.Dependency();                                                               // 202
      self.keyValueDeps[key] = {};                                                                                // 203
    }                                                                                                             //
  },                                                                                                              //
                                                                                                                  //
  // Get a JSON value that can be passed to the constructor to                                                    //
  // create a new ReactiveDict with the same contents as this one                                                 //
  _getMigrationData: function () {                                                                                // 209
    // XXX sanitize and make sure it's JSONible?                                                                  //
    return this.keys;                                                                                             // 211
  }                                                                                                               //
});                                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactive-dict/migration.js                                                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
ReactiveDict._migratedDictData = {}; // name -> data                                                              // 1
ReactiveDict._dictsToMigrate = {}; // name -> ReactiveDict                                                        // 2
                                                                                                                  //
ReactiveDict._loadMigratedDict = function (dictName) {                                                            // 4
  if (_.has(ReactiveDict._migratedDictData, dictName)) return ReactiveDict._migratedDictData[dictName];           // 5
                                                                                                                  //
  return null;                                                                                                    // 8
};                                                                                                                //
                                                                                                                  //
ReactiveDict._registerDictForMigrate = function (dictName, dict) {                                                // 11
  if (_.has(ReactiveDict._dictsToMigrate, dictName)) throw new Error("Duplicate ReactiveDict name: " + dictName);
                                                                                                                  //
  ReactiveDict._dictsToMigrate[dictName] = dict;                                                                  // 15
};                                                                                                                //
                                                                                                                  //
if (Meteor.isClient && Package.reload) {                                                                          // 18
  // Put old migrated data into ReactiveDict._migratedDictData,                                                   //
  // where it can be accessed by ReactiveDict._loadMigratedDict.                                                  //
  var migrationData = Package.reload.Reload._migrationData('reactive-dict');                                      // 21
  if (migrationData && migrationData.dicts) ReactiveDict._migratedDictData = migrationData.dicts;                 // 22
                                                                                                                  //
  // On migration, assemble the data from all the dicts that have been                                            //
  // registered.                                                                                                  //
  Package.reload.Reload._onMigrate('reactive-dict', function () {                                                 // 27
    var dictsToMigrate = ReactiveDict._dictsToMigrate;                                                            // 28
    var dataToMigrate = {};                                                                                       // 29
                                                                                                                  //
    for (var dictName in babelHelpers.sanitizeForInObject(dictsToMigrate)) dataToMigrate[dictName] = dictsToMigrate[dictName]._getMigrationData();
                                                                                                                  //
    return [true, { dicts: dataToMigrate }];                                                                      // 34
  });                                                                                                             //
}                                                                                                                 //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['reactive-dict'] = {
  ReactiveDict: ReactiveDict
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
var _ = Package.underscore._;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var Session;

(function(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/session/packages/session.js                                              //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
(function(){                                                                         // 1
                                                                                     // 2
/////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                             //    // 4
// packages/session/session.js                                                 //    // 5
//                                                                             //    // 6
/////////////////////////////////////////////////////////////////////////////////    // 7
                                                                               //    // 8
Session = new ReactiveDict('session');                                         // 1  // 9
                                                                               // 2  // 10
// Documentation here is really awkward because the methods are defined        // 3  // 11
// elsewhere                                                                   // 4  // 12
                                                                               // 5  // 13
/**                                                                            // 6  // 14
 * @memberOf Session                                                           // 7  // 15
 * @method set                                                                 // 8  // 16
 * @summary Set a variable in the session. Notify any listeners that the value       // 17
 * has changed (eg: redraw templates, and rerun any                            // 10
 * [`Tracker.autorun`](#tracker_autorun) computations, that called             // 11
 * [`Session.get`](#session_get) on this `key`.)                               // 12
 * @locus Client                                                               // 13
 * @param {String} key The key to set, eg, `selectedItem`                      // 14
 * @param {EJSONable | undefined} value The new value for `key`                // 15
 */                                                                            // 16
                                                                               // 17
/**                                                                            // 18
 * @memberOf Session                                                           // 19
 * @method setDefault                                                          // 20
 * @summary Set a variable in the session if it hasn't been set before.        // 21
 * Otherwise works exactly the same as [`Session.set`](#session_set).          // 22
 * @locus Client                                                               // 23
 * @param {String} key The key to set, eg, `selectedItem`                      // 24
 * @param {EJSONable | undefined} value The new value for `key`                // 25
 */                                                                            // 26
                                                                               // 27
/**                                                                            // 28
 * @memberOf Session                                                           // 29
 * @method get                                                                 // 30
 * @summary Get the value of a session variable. If inside a [reactive         // 31
 * computation](#reactivity), invalidate the computation the next time the     // 32
 * value of the variable is changed by [`Session.set`](#session_set). This     // 33
 * returns a clone of the session value, so if it's an object or an array,     // 34
 * mutating the returned value has no effect on the value stored in the        // 35
 * session.                                                                    // 36
 * @locus Client                                                               // 37
 * @param {String} key The name of the session variable to return              // 38
 */                                                                            // 39
                                                                               // 40
/**                                                                            // 41
 * @memberOf Session                                                           // 42
 * @method equals                                                              // 43
 * @summary Test if a session variable is equal to a value. If inside a        // 44
 * [reactive computation](#reactivity), invalidate the computation the next    // 45
 * time the variable changes to or from the value.                             // 46
 * @locus Client                                                               // 47
 * @param {String} key The name of the session variable to test                // 48
 * @param {String | Number | Boolean | null | undefined} value The value to    // 49
 * test against                                                                // 50
 */                                                                            // 51
                                                                               // 52
/////////////////////////////////////////////////////////////////////////////////    // 61
                                                                                     // 62
}).call(this);                                                                       // 63
                                                                                     // 64
///////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.session = {
  Session: Session
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
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Session = Package.session.Session;
var Mongo = Package.mongo.Mongo;
var EJSON = Package.ejson.EJSON;
var check = Package.check.check;
var Match = Package.check.Match;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var ObserveSequence = Package['observe-sequence'].ObserveSequence;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular-meteor-data/lib/diff-array.js                                                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var module = angular.module('diffArray', ['getUpdates']);                                                     // 3
                                                                                                              // 4
module.factory('diffArray', ['getUpdates',                                                                    // 5
  function(getUpdates) {                                                                                      // 6
    var LocalCollection = Package['minimongo'].LocalCollection;                                               // 7
    var idStringify = LocalCollection._idStringify || Package['mongo-id'].MongoID.idStringify;                // 8
    var idParse = LocalCollection._idParse || Package['mongo-id'].MongoID.idParse;                            // 9
                                                                                                              // 10
    // Calculates the differences between `lastSeqArray` and                                                  // 11
    // `seqArray` and calls appropriate functions from `callbacks`.                                           // 12
    // Reuses Minimongo's diff algorithm implementation.                                                      // 13
    // XXX Should be replaced with the original diffArray function here:                                      // 14
    // https://github.com/meteor/meteor/blob/devel/packages/observe-sequence/observe_sequence.js#L152         // 15
    // When it will become nested as well, tracking here: https://github.com/meteor/meteor/issues/3764        // 16
    function diffArray(lastSeqArray, seqArray, callbacks, preventNestedDiff) {                                // 17
      preventNestedDiff = !!preventNestedDiff;                                                                // 18
                                                                                                              // 19
      var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges ||                              // 20
        Package['diff-sequence'].DiffSequence.diffQueryOrderedChanges;                                        // 21
                                                                                                              // 22
      var oldObjIds = [];                                                                                     // 23
      var newObjIds = [];                                                                                     // 24
      var posOld = {}; // maps from idStringify'd ids                                                         // 25
      var posNew = {}; // ditto                                                                               // 26
      var posCur = {};                                                                                        // 27
      var lengthCur = lastSeqArray.length;                                                                    // 28
                                                                                                              // 29
      _.each(seqArray, function (doc, i) {                                                                    // 30
        newObjIds.push({_id: doc._id});                                                                       // 31
        posNew[idStringify(doc._id)] = i;                                                                     // 32
      });                                                                                                     // 33
                                                                                                              // 34
      _.each(lastSeqArray, function (doc, i) {                                                                // 35
        oldObjIds.push({_id: doc._id});                                                                       // 36
        posOld[idStringify(doc._id)] = i;                                                                     // 37
        posCur[idStringify(doc._id)] = i;                                                                     // 38
      });                                                                                                     // 39
                                                                                                              // 40
      // Arrays can contain arbitrary objects. We don't diff the                                              // 41
      // objects. Instead we always fire 'changedAt' callback on every                                        // 42
      // object. The consumer of `observe-sequence` should deal with                                          // 43
      // it appropriately.                                                                                    // 44
      diffFn(oldObjIds, newObjIds, {                                                                          // 45
        addedBefore: function (id, doc, before) {                                                             // 46
          var position = before ? posCur[idStringify(before)] : lengthCur;                                    // 47
                                                                                                              // 48
          _.each(posCur, function (pos, id) {                                                                 // 49
            if (pos >= position) posCur[id]++;                                                                // 50
          });                                                                                                 // 51
                                                                                                              // 52
          lengthCur++;                                                                                        // 53
          posCur[idStringify(id)] = position;                                                                 // 54
                                                                                                              // 55
          callbacks.addedAt(                                                                                  // 56
            id,                                                                                               // 57
            seqArray[posNew[idStringify(id)]],                                                                // 58
            position,                                                                                         // 59
            before                                                                                            // 60
          );                                                                                                  // 61
        },                                                                                                    // 62
                                                                                                              // 63
        movedBefore: function (id, before) {                                                                  // 64
          var prevPosition = posCur[idStringify(id)];                                                         // 65
          var position = before ? posCur[idStringify(before)] : lengthCur - 1;                                // 66
                                                                                                              // 67
          _.each(posCur, function (pos, id) {                                                                 // 68
            if (pos >= prevPosition && pos <= position)                                                       // 69
              posCur[id]--;                                                                                   // 70
            else if (pos <= prevPosition && pos >= position)                                                  // 71
              posCur[id]++;                                                                                   // 72
          });                                                                                                 // 73
                                                                                                              // 74
          posCur[idStringify(id)] = position;                                                                 // 75
                                                                                                              // 76
          callbacks.movedTo(                                                                                  // 77
            id,                                                                                               // 78
            seqArray[posNew[idStringify(id)]],                                                                // 79
            prevPosition,                                                                                     // 80
            position,                                                                                         // 81
            before                                                                                            // 82
          );                                                                                                  // 83
        },                                                                                                    // 84
        removed: function (id) {                                                                              // 85
          var prevPosition = posCur[idStringify(id)];                                                         // 86
                                                                                                              // 87
          _.each(posCur, function (pos, id) {                                                                 // 88
            if (pos >= prevPosition) posCur[id]--;                                                            // 89
          });                                                                                                 // 90
                                                                                                              // 91
          delete posCur[idStringify(id)];                                                                     // 92
          lengthCur--;                                                                                        // 93
                                                                                                              // 94
          callbacks.removedAt(                                                                                // 95
            id,                                                                                               // 96
            lastSeqArray[posOld[idStringify(id)]],                                                            // 97
            prevPosition                                                                                      // 98
          );                                                                                                  // 99
        }                                                                                                     // 100
      });                                                                                                     // 101
                                                                                                              // 102
      _.each(posNew, function (pos, idString) {                                                               // 103
        if (!_.has(posOld, idString)) return;                                                                 // 104
                                                                                                              // 105
        var id = idParse(idString);                                                                           // 106
        var newItem = seqArray[pos] || {};                                                                    // 107
        var oldItem = lastSeqArray[posOld[idString]];                                                         // 108
        var updates = getUpdates(oldItem, newItem, preventNestedDiff);                                        // 109
                                                                                                              // 110
        if (!_.isEmpty(updates))                                                                              // 111
          callbacks.changedAt(id, updates, pos, oldItem);                                                     // 112
      });                                                                                                     // 113
    }                                                                                                         // 114
                                                                                                              // 115
    diffArray.deepCopyChanges = function (oldItem, newItem) {                                                 // 116
      var setDiff = getUpdates(oldItem, newItem).$set;                                                        // 117
                                                                                                              // 118
      _.each(setDiff, function(v, deepKey) {                                                                  // 119
        setDeep(oldItem, deepKey, v);                                                                         // 120
      });                                                                                                     // 121
    };                                                                                                        // 122
                                                                                                              // 123
    diffArray.deepCopyRemovals = function (oldItem, newItem) {                                                // 124
      var unsetDiff = getUpdates(oldItem, newItem).$unset;                                                    // 125
                                                                                                              // 126
      _.each(unsetDiff, function(v, deepKey) {                                                                // 127
        unsetDeep(oldItem, deepKey);                                                                          // 128
      });                                                                                                     // 129
    };                                                                                                        // 130
                                                                                                              // 131
    var setDeep = function(obj, deepKey, v) {                                                                 // 132
      var split = deepKey.split('.');                                                                         // 133
      var initialKeys = _.initial(split);                                                                     // 134
      var lastKey = _.last(split);                                                                            // 135
                                                                                                              // 136
      initialKeys.reduce(function(subObj, k, i) {                                                             // 137
        var nextKey = split[i + 1];                                                                           // 138
                                                                                                              // 139
        if (isNumStr(nextKey)) {                                                                              // 140
          if (subObj[k] == null) subObj[k] = [];                                                              // 141
          if (subObj[k].length == parseInt(nextKey)) subObj[k].push(null);                                    // 142
        }                                                                                                     // 143
                                                                                                              // 144
        else if (subObj[k] == null || !isHash(subObj[k])) {                                                   // 145
          subObj[k] = {};                                                                                     // 146
        }                                                                                                     // 147
                                                                                                              // 148
        return subObj[k];                                                                                     // 149
      }, obj);                                                                                                // 150
                                                                                                              // 151
      var deepObj = getDeep(obj, initialKeys);                                                                // 152
      deepObj[lastKey] = v;                                                                                   // 153
      return v;                                                                                               // 154
    };                                                                                                        // 155
                                                                                                              // 156
    var unsetDeep = function(obj, deepKey) {                                                                  // 157
      var split = deepKey.split('.');                                                                         // 158
      var initialKeys = _.initial(split);                                                                     // 159
      var lastKey = _.last(split);                                                                            // 160
      var deepObj = getDeep(obj, initialKeys);                                                                // 161
                                                                                                              // 162
      if (_.isArray(deepObj) && isNumStr(lastKey))                                                            // 163
        return !!deepObj.splice(lastKey, 1);                                                                  // 164
      else                                                                                                    // 165
        return delete deepObj[lastKey];                                                                       // 166
    };                                                                                                        // 167
                                                                                                              // 168
    var getDeep = function(obj, keys) {                                                                       // 169
      return keys.reduce(function(subObj, k) {                                                                // 170
        return subObj[k];                                                                                     // 171
      }, obj);                                                                                                // 172
    };                                                                                                        // 173
                                                                                                              // 174
    var isHash = function(obj) {                                                                              // 175
      return _.isObject(obj) &&                                                                               // 176
             Object.getPrototypeOf(obj) === Object.prototype;                                                 // 177
    };                                                                                                        // 178
                                                                                                              // 179
    var isNumStr = function(str) {                                                                            // 180
      return str.match(/^\d+$/);                                                                              // 181
    };                                                                                                        // 182
                                                                                                              // 183
    return diffArray;                                                                                         // 184
}]);                                                                                                          // 185
                                                                                                              // 186
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular-meteor-data/lib/get-updates.js                                                            //
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
// packages/angular-meteor-data/modules/angular-meteor-subscribe.js                                           //
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
// packages/angular-meteor-data/modules/angular-meteor-stopper.js                                             //
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
// packages/angular-meteor-data/modules/angular-meteor-collection.js                                          //
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
                                                                                                              // 86
      // delete $$hashkey                                                                                     // 87
      doc = $meteorUtils.stripDollarPrefixedKeys(doc);                                                        // 88
      var docId = doc._id;                                                                                    // 89
      var isExist = collection.findOne(docId);                                                                // 90
                                                                                                              // 91
      // update                                                                                               // 92
      if (isExist) {                                                                                          // 93
        // Deletes _id property (from the copy) so that                                                       // 94
        // it can be $set using update.                                                                       // 95
        delete doc._id;                                                                                       // 96
        var modifier = useUnsetModifier ? {$unset: doc} : {$set: doc};                                        // 97
        // NOTE: do not use #upsert() method, since it does not exist in some collections                     // 98
        collection.update(docId, modifier, createFulfill(function() {                                         // 99
          return {_id: docId, action: 'updated'};                                                             // 100
        }));                                                                                                  // 101
      }                                                                                                       // 102
      // insert                                                                                               // 103
      else {                                                                                                  // 104
        collection.insert(doc, createFulfill(function(id) {                                                   // 105
          return {_id: id, action: 'inserted'};                                                               // 106
        }));                                                                                                  // 107
      }                                                                                                       // 108
                                                                                                              // 109
      return deferred.promise;                                                                                // 110
    };                                                                                                        // 111
                                                                                                              // 112
    // performs each update operation induvidualy to prevent conflics like                                    // 113
    AngularMeteorCollection._updateParallel = function(selector, modifier, callback) {                        // 114
      var self = this;                                                                                        // 115
      var operationsNames = _.keys(modifier);                                                                 // 116
      callback = callback || angular.noop;                                                                    // 117
                                                                                                              // 118
      var done = _.after(operationsNames.length, callback);                                                   // 119
                                                                                                              // 120
      var next = function(err, affectedDocsNum) {                                                             // 121
        if (err) return callback(err);                                                                        // 122
        done(null, affectedDocsNum);                                                                          // 123
      };                                                                                                      // 124
                                                                                                              // 125
      operationsNames.forEach(function(operationName) {                                                       // 126
        var contractedModifier = _.pick(modifier, operationName);                                             // 127
        self.$$collection.update(selector, contractedModifier, next);                                         // 128
      });                                                                                                     // 129
    };                                                                                                        // 130
                                                                                                              // 131
    AngularMeteorCollection.remove = function(keyOrDocs) {                                                    // 132
      var keys;                                                                                               // 133
      // remove whole collection                                                                              // 134
      if (!keyOrDocs) {                                                                                       // 135
        keys = _.pluck(this, '_id');                                                                          // 136
      } else {                                                                                                // 137
        // remove docs                                                                                        // 138
        keys = _.map([].concat(keyOrDocs), function(keyOrDoc) {                                               // 139
          return keyOrDoc._id || keyOrDoc;                                                                    // 140
        });                                                                                                   // 141
      }                                                                                                       // 142
      // Checks if all keys are correct.                                                                      // 143
      check(keys, [Match.OneOf(String, Mongo.ObjectID)]);                                                     // 144
                                                                                                              // 145
      var promises = keys.map(function(key) {                                                                 // 146
        return this._removeDoc(key);                                                                          // 147
      }, this);                                                                                               // 148
                                                                                                              // 149
      var allPromise = $q.all(promises);                                                                      // 150
                                                                                                              // 151
      allPromise.finally(function() {                                                                         // 152
        $timeout(angular.noop);                                                                               // 153
      });                                                                                                     // 154
                                                                                                              // 155
      return allPromise;                                                                                      // 156
    };                                                                                                        // 157
                                                                                                              // 158
    AngularMeteorCollection._removeDoc = function(id) {                                                       // 159
      var deferred = $q.defer();                                                                              // 160
      var collection = this.$$collection;                                                                     // 161
      var fulfill = $meteorUtils.fulfill(deferred, null, { _id: id, action: 'removed' });                     // 162
      collection.remove(id, fulfill);                                                                         // 163
      return deferred.promise;                                                                                // 164
    };                                                                                                        // 165
                                                                                                              // 166
    AngularMeteorCollection._updateCursor = function(cursor, autoClientSave) {                                // 167
      var self = this;                                                                                        // 168
                                                                                                              // 169
      // XXX - consider adding an option for a non-orderd result                                              // 170
      // for faster performance.                                                                              // 171
      if (self._hObserve) {                                                                                   // 172
        self._hObserve.stop();                                                                                // 173
        self._hDataAutorun.stop();                                                                            // 174
      }                                                                                                       // 175
                                                                                                              // 176
      var serverMode = false;                                                                                 // 177
      function setServerUpdateMode(name) {                                                                    // 178
        serverMode = true;                                                                                    // 179
        // To simplify server update logic, we don't follow                                                   // 180
        // updates from the client at the same time.                                                          // 181
        self._unsetAutoClientSave();                                                                          // 182
      }                                                                                                       // 183
                                                                                                              // 184
      var hUnsetTimeout = null;                                                                               // 185
      // Here we use $timeout to combine multiple updates that go                                             // 186
      // each one after another.                                                                              // 187
      function unsetServerUpdateMode() {                                                                      // 188
        if (hUnsetTimeout) {                                                                                  // 189
          $timeout.cancel(hUnsetTimeout);                                                                     // 190
          hUnsetTimeout = null;                                                                               // 191
        }                                                                                                     // 192
        hUnsetTimeout = $timeout(function() {                                                                 // 193
          serverMode = false;                                                                                 // 194
          // Finds updates that was potentially done from the client side                                     // 195
          // and saves them.                                                                                  // 196
          var changes = collectionUtils.diff(self, self._serverBackup,                                        // 197
            self._diffArrayFunc);                                                                             // 198
          self._saveChanges(changes);                                                                         // 199
          // After, continues following client updates.                                                       // 200
          if (autoClientSave) {                                                                               // 201
            self._setAutoClientSave();                                                                        // 202
          }                                                                                                   // 203
        }, 0);                                                                                                // 204
      }                                                                                                       // 205
                                                                                                              // 206
      this._hObserve = cursor.observe({                                                                       // 207
        addedAt: function(doc, atIndex) {                                                                     // 208
          self.splice(atIndex, 0, doc);                                                                       // 209
          self._serverBackup.splice(atIndex, 0, doc);                                                         // 210
          setServerUpdateMode();                                                                              // 211
        },                                                                                                    // 212
                                                                                                              // 213
        changedAt: function(doc, oldDoc, atIndex) {                                                           // 214
          diffArray.deepCopyChanges(self[atIndex], doc);                                                      // 215
          diffArray.deepCopyRemovals(self[atIndex], doc);                                                     // 216
          self._serverBackup[atIndex] = self[atIndex];                                                        // 217
          setServerUpdateMode();                                                                              // 218
        },                                                                                                    // 219
                                                                                                              // 220
        movedTo: function(doc, fromIndex, toIndex) {                                                          // 221
          self.splice(fromIndex, 1);                                                                          // 222
          self.splice(toIndex, 0, doc);                                                                       // 223
          self._serverBackup.splice(fromIndex, 1);                                                            // 224
          self._serverBackup.splice(toIndex, 0, doc);                                                         // 225
          setServerUpdateMode();                                                                              // 226
        },                                                                                                    // 227
                                                                                                              // 228
        removedAt: function(oldDoc) {                                                                         // 229
          var removedIndex = collectionUtils.findIndexById(self, oldDoc);                                     // 230
                                                                                                              // 231
          if (removedIndex != -1) {                                                                           // 232
            self.splice(removedIndex, 1);                                                                     // 233
            self._serverBackup.splice(removedIndex, 1);                                                       // 234
            setServerUpdateMode();                                                                            // 235
          } else {                                                                                            // 236
            // If it's been removed on client then it's already not in collection                             // 237
            // itself but still is in the _serverBackup.                                                      // 238
            removedIndex = collectionUtils.findIndexById(self._serverBackup, oldDoc);                         // 239
                                                                                                              // 240
            if (removedIndex != -1) {                                                                         // 241
              self._serverBackup.splice(removedIndex, 1);                                                     // 242
            }                                                                                                 // 243
          }                                                                                                   // 244
        }                                                                                                     // 245
      });                                                                                                     // 246
                                                                                                              // 247
      this._hDataAutorun = Tracker.autorun(function() {                                                       // 248
        cursor.fetch();                                                                                       // 249
        if (serverMode) {                                                                                     // 250
          unsetServerUpdateMode();                                                                            // 251
        }                                                                                                     // 252
      });                                                                                                     // 253
    };                                                                                                        // 254
                                                                                                              // 255
    AngularMeteorCollection.stop = function() {                                                               // 256
      this._stopCursor();                                                                                     // 257
      this._hNewCurAutorun.stop();                                                                            // 258
    };                                                                                                        // 259
                                                                                                              // 260
    AngularMeteorCollection._stopCursor = function() {                                                        // 261
      this._unsetAutoClientSave();                                                                            // 262
                                                                                                              // 263
      if (this._hObserve) {                                                                                   // 264
        this._hObserve.stop();                                                                                // 265
        this._hDataAutorun.stop();                                                                            // 266
      }                                                                                                       // 267
                                                                                                              // 268
      this.splice(0);                                                                                         // 269
      this._serverBackup.splice(0);                                                                           // 270
    };                                                                                                        // 271
                                                                                                              // 272
    AngularMeteorCollection._unsetAutoClientSave = function(name) {                                           // 273
      if (this._hRegAutoBind) {                                                                               // 274
        this._hRegAutoBind();                                                                                 // 275
        this._hRegAutoBind = null;                                                                            // 276
      }                                                                                                       // 277
    };                                                                                                        // 278
                                                                                                              // 279
    AngularMeteorCollection._setAutoClientSave = function() {                                                 // 280
      var self = this;                                                                                        // 281
                                                                                                              // 282
      // Always unsets auto save to keep only one $watch handler.                                             // 283
      self._unsetAutoClientSave();                                                                            // 284
                                                                                                              // 285
      self._hRegAutoBind = $rootScope.$watch(function() {                                                     // 286
        return self;                                                                                          // 287
      }, function(nItems, oItems) {                                                                           // 288
        if (nItems === oItems) return;                                                                        // 289
                                                                                                              // 290
        self._unsetAutoClientSave();                                                                          // 291
        var changes = collectionUtils.diff(self, oItems,                                                      // 292
          self._diffArrayFunc);                                                                               // 293
        self._saveChanges(changes);                                                                           // 294
        self._setAutoClientSave();                                                                            // 295
      }, true);                                                                                               // 296
    };                                                                                                        // 297
                                                                                                              // 298
    AngularMeteorCollection._saveChanges = function(changes) {                                                // 299
      var self = this;                                                                                        // 300
                                                                                                              // 301
      // Saves added documents                                                                                // 302
      // Using reversed iteration to prevent indexes from changing during splice                              // 303
      var addedDocs = changes.added.reverse().map(function(descriptor) {                                      // 304
        self.splice(descriptor.index, 1);                                                                     // 305
        return descriptor.item;                                                                               // 306
      });                                                                                                     // 307
      if (addedDocs.length) self.save(addedDocs);                                                             // 308
                                                                                                              // 309
      // Removes deleted documents                                                                            // 310
      var removedDocs = changes.removed.map(function(descriptor) {                                            // 311
        return descriptor.item;                                                                               // 312
      });                                                                                                     // 313
      if (removedDocs.length) self.remove(removedDocs);                                                       // 314
                                                                                                              // 315
      // Updates changed documents                                                                            // 316
      changes.changed.forEach(function(descriptor) {                                                          // 317
        self._updateParallel(descriptor.selector, descriptor.modifier);                                       // 318
      });                                                                                                     // 319
    };                                                                                                        // 320
                                                                                                              // 321
    return AngularMeteorCollection;                                                                           // 322
}]);                                                                                                          // 323
                                                                                                              // 324
angularMeteorCollection.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray',                     // 325
  function($meteorCollection, diffArray) {                                                                    // 326
    function $meteorCollectionFS(reactiveFunc, autoClientSave, collection) {                                  // 327
      return new $meteorCollection(reactiveFunc, autoClientSave, collection, noNestedDiffArray);              // 328
    }                                                                                                         // 329
                                                                                                              // 330
    var noNestedDiffArray = function(lastSeqArray, seqArray, callbacks) {                                     // 331
      return diffArray(lastSeqArray, seqArray, callbacks, true);                                              // 332
    };                                                                                                        // 333
                                                                                                              // 334
    return $meteorCollectionFS;                                                                               // 335
}]);                                                                                                          // 336
                                                                                                              // 337
angularMeteorCollection.factory('$meteorCollection', [                                                        // 338
  'AngularMeteorCollection', '$rootScope', 'diffArray',                                                       // 339
  function(AngularMeteorCollection, $rootScope, diffArray) {                                                  // 340
    function $meteorCollection(reactiveFunc, autoClientSave, collection, diffArrayFunc) {                     // 341
      // Validate parameters                                                                                  // 342
      if (!reactiveFunc) {                                                                                    // 343
        throw new TypeError('The first argument of $meteorCollection is undefined.');                         // 344
      }                                                                                                       // 345
                                                                                                              // 346
      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {                     // 347
        throw new TypeError(                                                                                  // 348
          'The first argument of $meteorCollection must be a function or\
            a have a find function property.');                                                               // 350
      }                                                                                                       // 351
                                                                                                              // 352
      if (!angular.isFunction(reactiveFunc)) {                                                                // 353
        collection = angular.isDefined(collection) ? collection : reactiveFunc;                               // 354
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);                                               // 355
      }                                                                                                       // 356
                                                                                                              // 357
      // By default auto save - true.                                                                         // 358
      autoClientSave = angular.isDefined(autoClientSave) ? autoClientSave : true;                             // 359
      var ngCollection = new AngularMeteorCollection(reactiveFunc, collection,                                // 360
        diffArrayFunc || diffArray, autoClientSave);                                                          // 361
                                                                                                              // 362
      return ngCollection;                                                                                    // 363
    }                                                                                                         // 364
                                                                                                              // 365
    return $meteorCollection;                                                                                 // 366
 }]);                                                                                                         // 367
                                                                                                              // 368
angularMeteorCollection.run([                                                                                 // 369
  '$rootScope', '$meteorCollection', '$meteorCollectionFS', '$meteorStopper',                                 // 370
  function($rootScope, $meteorCollection, $meteorCollectionFS, $meteorStopper) {                              // 371
    var scopeProto = Object.getPrototypeOf($rootScope);                                                       // 372
    scopeProto.$meteorCollection = $meteorStopper($meteorCollection);                                         // 373
    scopeProto.$meteorCollectionFS = $meteorStopper($meteorCollectionFS);                                     // 374
 }]);                                                                                                         // 375
                                                                                                              // 376
                                                                                                              // 377
// Local utilities                                                                                            // 378
var collectionUtils = {                                                                                       // 379
                                                                                                              // 380
  findIndexById: function(collection, doc) {                                                                  // 381
    var foundDoc = _.find(collection, function(colDoc) {                                                      // 382
      // EJSON.equals used to compare Mongo.ObjectIDs and Strings.                                            // 383
      return EJSON.equals(colDoc._id, doc._id);                                                               // 384
    });                                                                                                       // 385
    return _.indexOf(collection, foundDoc);                                                                   // 386
  },                                                                                                          // 387
                                                                                                              // 388
  // Finds changes between two collections and saves differences.                                             // 389
  diff: function(newCollection, oldCollection, diffMethod) {                                                  // 390
    var changes = {added: [], removed: [], changed: []};                                                      // 391
                                                                                                              // 392
    diffMethod(oldCollection, newCollection, {                                                                // 393
      addedAt: function(id, item, index) {                                                                    // 394
        changes.added.push({item: item, index: index});                                                       // 395
      },                                                                                                      // 396
                                                                                                              // 397
      removedAt: function(id, item, index) {                                                                  // 398
        changes.removed.push({item: item, index: index});                                                     // 399
      },                                                                                                      // 400
                                                                                                              // 401
      changedAt: function(id, updates, index, oldItem) {                                                      // 402
        changes.changed.push({selector: id, modifier: updates});                                              // 403
      },                                                                                                      // 404
                                                                                                              // 405
      movedTo: function(id, item, fromIndex, toIndex) {                                                       // 406
        // XXX do we need this?                                                                               // 407
      }                                                                                                       // 408
    });                                                                                                       // 409
                                                                                                              // 410
    return changes;                                                                                           // 411
  }                                                                                                           // 412
};                                                                                                            // 413
                                                                                                              // 414
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular-meteor-data/modules/angular-meteor-object.js                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
'use strict';                                                                                                 // 1
                                                                                                              // 2
var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe', 'angular-meteor.collection', 'getUpdates', 'diffArray']);
                                                                                                              // 4
angularMeteorObject.factory('AngularMeteorObject', [                                                          // 5
  '$q', '$meteorSubscribe', '$meteorUtils', 'diffArray', 'getUpdates', 'AngularMeteorCollection',             // 6
  function($q, $meteorSubscribe, $meteorUtils, diffArray, getUpdates, AngularMeteorCollection) {              // 7
    // A list of internals properties to not watch for, nor pass to the Document on update and etc.           // 8
    AngularMeteorObject.$$internalProps = [                                                                   // 9
      '$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', '$$scope',                         // 10
      'save', 'reset', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject',
      '_auto', '_setAutos', '_eventEmitter', '_serverBackup', '_updateParallel'                               // 12
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
        // NOTE: do not use #upsert() method, since it does not exist in some collections                     // 59
        return this._updateParallel(mods, createFulfill({ action: 'updated' }));                              // 60
      }                                                                                                       // 61
      // insert                                                                                               // 62
      else {                                                                                                  // 63
        if (custom)                                                                                           // 64
          mods = _.clone(custom);                                                                             // 65
        else                                                                                                  // 66
          mods = this.getRawObject();                                                                         // 67
                                                                                                              // 68
        mods._id = this.$$id;                                                                                 // 69
        collection.insert(mods, createFulfill({ action: 'inserted' }));                                       // 70
      }                                                                                                       // 71
                                                                                                              // 72
      return deferred.promise;                                                                                // 73
    };                                                                                                        // 74
                                                                                                              // 75
    AngularMeteorObject._updateParallel = function(modifier, callback) {                                      // 76
      var selector = this.$$id;                                                                               // 77
      AngularMeteorCollection._updateParallel.call(this, selector, modifier, callback);                       // 78
    };                                                                                                        // 79
                                                                                                              // 80
    AngularMeteorObject.reset = function(keepClientProps) {                                                   // 81
      var self = this;                                                                                        // 82
      var options = this.$$options;                                                                           // 83
      var id = this.$$id;                                                                                     // 84
      var doc = this.$$collection.findOne(id, options);                                                       // 85
                                                                                                              // 86
      if (doc) {                                                                                              // 87
        // extend SubObject                                                                                   // 88
        var docKeys = _.keys(doc);                                                                            // 89
        var docExtension = _.pick(doc, docKeys);                                                              // 90
        var clientProps;                                                                                      // 91
                                                                                                              // 92
        angular.extend(Object.getPrototypeOf(self), Object.getPrototypeOf(doc));                              // 93
        _.extend(self, docExtension);                                                                         // 94
        _.extend(self._serverBackup, docExtension);                                                           // 95
                                                                                                              // 96
        if (keepClientProps) {                                                                                // 97
          clientProps = _.intersection(_.keys(self), _.keys(self._serverBackup));                             // 98
        } else {                                                                                              // 99
          clientProps = _.keys(self);                                                                         // 100
        }                                                                                                     // 101
                                                                                                              // 102
        var serverProps = _.keys(doc);                                                                        // 103
        var removedKeys = _.difference(clientProps, serverProps, self.$$internalProps);                       // 104
                                                                                                              // 105
        removedKeys.forEach(function (prop) {                                                                 // 106
          delete self[prop];                                                                                  // 107
          delete self._serverBackup[prop];                                                                    // 108
        });                                                                                                   // 109
      }                                                                                                       // 110
                                                                                                              // 111
      else {                                                                                                  // 112
        _.keys(this.getRawObject()).forEach(function(prop) {                                                  // 113
          delete self[prop];                                                                                  // 114
        });                                                                                                   // 115
                                                                                                              // 116
        self._serverBackup = {};                                                                              // 117
      }                                                                                                       // 118
    };                                                                                                        // 119
                                                                                                              // 120
    AngularMeteorObject.stop = function () {                                                                  // 121
      if (this.unregisterAutoDestroy)                                                                         // 122
        this.unregisterAutoDestroy();                                                                         // 123
                                                                                                              // 124
      if (this.unregisterAutoBind)                                                                            // 125
        this.unregisterAutoBind();                                                                            // 126
                                                                                                              // 127
      if (this.autorunComputation && this.autorunComputation.stop)                                            // 128
        this.autorunComputation.stop();                                                                       // 129
    };                                                                                                        // 130
                                                                                                              // 131
    return AngularMeteorObject;                                                                               // 132
}]);                                                                                                          // 133
                                                                                                              // 134
                                                                                                              // 135
angularMeteorObject.factory('$meteorObject', [                                                                // 136
  '$rootScope', '$meteorUtils', 'getUpdates', 'AngularMeteorObject',                                          // 137
  function($rootScope, $meteorUtils, getUpdates, AngularMeteorObject) {                                       // 138
    function $meteorObject(collection, id, auto, options) {                                                   // 139
      // Validate parameters                                                                                  // 140
      if (!collection) {                                                                                      // 141
        throw new TypeError("The first argument of $meteorObject is undefined.");                             // 142
      }                                                                                                       // 143
                                                                                                              // 144
      if (!angular.isFunction(collection.findOne)) {                                                          // 145
        throw new TypeError("The first argument of $meteorObject must be a function or a have a findOne function property.");
      }                                                                                                       // 147
                                                                                                              // 148
      var data = new AngularMeteorObject(collection, id, options);                                            // 149
      data._auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570  // 150
      angular.extend(data, $meteorObject);                                                                    // 151
      data._setAutos();                                                                                       // 152
      return data;                                                                                            // 153
    }                                                                                                         // 154
                                                                                                              // 155
    $meteorObject._setAutos = function() {                                                                    // 156
      var self = this;                                                                                        // 157
                                                                                                              // 158
      this.autorunComputation = $meteorUtils.autorun($rootScope, function() {                                 // 159
        self.reset(true);                                                                                     // 160
      });                                                                                                     // 161
                                                                                                              // 162
      // Deep watches the model and performs autobind                                                         // 163
      this.unregisterAutoBind = this._auto && $rootScope.$watch(function(){                                   // 164
        return self.getRawObject();                                                                           // 165
      }, function (item, oldItem) {                                                                           // 166
        if (item === oldItem) {                                                                               // 167
          self.$$collection.update({_id: item._id}, self.getRawObject());                                     // 168
          return;                                                                                             // 169
        }                                                                                                     // 170
                                                                                                              // 171
        var id = item._id;                                                                                    // 172
        delete item._id;                                                                                      // 173
        delete oldItem._id;                                                                                   // 174
                                                                                                              // 175
        var updates = getUpdates(oldItem, item);                                                              // 176
        if (_.isEmpty(updates)) return;                                                                       // 177
        var pullUpdate;                                                                                       // 178
                                                                                                              // 179
        if (updates.$pull) {                                                                                  // 180
          pullUpdate = { $pull : updates.$pull };                                                             // 181
          delete updates.$pull;                                                                               // 182
        }                                                                                                     // 183
        self.$$collection.update({_id: id}, updates);                                                         // 184
                                                                                                              // 185
        if (pullUpdate) {                                                                                     // 186
          self.$$collection.update({ _id : id}, pullUpdate);                                                  // 187
        }                                                                                                     // 188
      }, true);                                                                                               // 189
                                                                                                              // 190
      this.unregisterAutoDestroy = $rootScope.$on('$destroy', function() {                                    // 191
        if (self && self.stop) {                                                                              // 192
          self.stop();                                                                                        // 193
        }                                                                                                     // 194
      });                                                                                                     // 195
    };                                                                                                        // 196
                                                                                                              // 197
    return $meteorObject;                                                                                     // 198
}]);                                                                                                          // 199
                                                                                                              // 200
angularMeteorObject.run([                                                                                     // 201
  '$rootScope', '$meteorObject', '$meteorStopper',                                                            // 202
  function ($rootScope, $meteorObject, $meteorStopper) {                                                      // 203
    var scopeProto = Object.getPrototypeOf($rootScope);                                                       // 204
    scopeProto.$meteorObject = $meteorStopper($meteorObject);                                                 // 205
}]);                                                                                                          // 206
                                                                                                              // 207
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular-meteor-data/modules/angular-meteor-user.js                                                //
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
// packages/angular-meteor-data/modules/angular-meteor-methods.js                                             //
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
// packages/angular-meteor-data/modules/angular-meteor-session.js                                             //
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
// packages/angular-meteor-data/modules/angular-meteor-reactive-scope.js                                      //
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
// packages/angular-meteor-data/modules/angular-meteor-utils.js                                               //
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
        EJSON.toJSONValue(data).$type === 'oid' ||                                                            // 32
        (typeof FS === 'object' && data instanceof FS.File)) {                                                // 33
        return data;                                                                                          // 34
      }                                                                                                       // 35
      var out = angular.isArray(data)? [] : {};                                                               // 36
      angular.forEach(data, function(v,k) {                                                                   // 37
        if(typeof k !== 'string' || k.charAt(0) !== '$') {                                                    // 38
          out[k] = self.stripDollarPrefixedKeys(v);                                                           // 39
        }                                                                                                     // 40
      });                                                                                                     // 41
      return out;                                                                                             // 42
    };                                                                                                        // 43
    // Returns a callback which fulfills promise                                                              // 44
    this.fulfill = function(deferred, boundError, boundResult) {                                              // 45
      return function(err, result) {                                                                          // 46
        if (err)                                                                                              // 47
          deferred.reject(boundError == null ? err : boundError);                                             // 48
        else if (typeof boundResult == "function")                                                            // 49
          deferred.resolve(boundResult == null ? result : boundResult(result));                               // 50
        else                                                                                                  // 51
          deferred.resolve(boundResult == null ? result : boundResult);                                       // 52
      };                                                                                                      // 53
    };                                                                                                        // 54
    // creates a function which invokes method with the given arguments and returns a promise                 // 55
    this.promissor = function(obj, method) {                                                                  // 56
      return function() {                                                                                     // 57
        var deferred = $q.defer();                                                                            // 58
        var fulfill = self.fulfill(deferred);                                                                 // 59
        var args = _.toArray(arguments).concat(fulfill);                                                      // 60
        obj[method].apply(obj, args);                                                                         // 61
        return deferred.promise;                                                                              // 62
      };                                                                                                      // 63
    };                                                                                                        // 64
  }                                                                                                           // 65
]);                                                                                                           // 66
                                                                                                              // 67
angularMeteorUtils.run(['$rootScope', '$meteorUtils',                                                         // 68
  function($rootScope, $meteorUtils) {                                                                        // 69
    Object.getPrototypeOf($rootScope).$meteorAutorun = function(fn) {                                         // 70
      return $meteorUtils.autorun(this, fn);                                                                  // 71
    };                                                                                                        // 72
}]);                                                                                                          // 73
                                                                                                              // 74
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/angular-meteor-data/modules/angular-meteor-camera.js                                              //
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
// packages/angular-meteor-data/angular-meteor.js                                                             //
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
Package['angular-meteor-data'] = {};

})();
