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

}).call(this);






(function(){

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

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/mongo-id/id.js                                                                            //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
MongoID = {};                                                                                         // 1
                                                                                                      // 2
MongoID._looksLikeObjectID = function (str) {                                                         // 3
  return str.length === 24 && str.match(/^[0-9a-f]*$/);                                               // 4
};                                                                                                    // 5
                                                                                                      // 6
MongoID.ObjectID = function (hexString) {                                                             // 7
  //random-based impl of Mongo ObjectID                                                               // 8
  var self = this;                                                                                    // 9
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
               id.substr(0, 1) === '{') { // escape object-form strings, for maybe implementing later
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
////////////////////////////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/diff-sequence/diff.js                                                  //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
DiffSequence = {};                                                                 // 1
                                                                                   // 2
// ordered: bool.                                                                  // 3
// old_results and new_results: collections of documents.                          // 4
//    if ordered, they are arrays.                                                 // 5
//    if unordered, they are IdMaps                                                // 6
DiffSequence.diffQueryChanges = function (ordered, oldResults, newResults,         // 7
                                              observer, options) {                 // 8
  if (ordered)                                                                     // 9
    DiffSequence.diffQueryOrderedChanges(                                          // 10
      oldResults, newResults, observer, options);                                  // 11
  else                                                                             // 12
    DiffSequence.diffQueryUnorderedChanges(                                        // 13
      oldResults, newResults, observer, options);                                  // 14
};                                                                                 // 15
                                                                                   // 16
DiffSequence.diffQueryUnorderedChanges = function (oldResults, newResults,         // 17
                                                       observer, options) {        // 18
  options = options || {};                                                         // 19
  var projectionFn = options.projectionFn || EJSON.clone;                          // 20
                                                                                   // 21
  if (observer.movedBefore) {                                                      // 22
    throw new Error("_diffQueryUnordered called with a movedBefore observer!");    // 23
  }                                                                                // 24
                                                                                   // 25
  newResults.forEach(function (newDoc, id) {                                       // 26
    var oldDoc = oldResults.get(id);                                               // 27
    if (oldDoc) {                                                                  // 28
      if (observer.changed && !EJSON.equals(oldDoc, newDoc)) {                     // 29
        var projectedNew = projectionFn(newDoc);                                   // 30
        var projectedOld = projectionFn(oldDoc);                                   // 31
        var changedFields =                                                        // 32
              DiffSequence.makeChangedFields(projectedNew, projectedOld);          // 33
        if (! _.isEmpty(changedFields)) {                                          // 34
          observer.changed(id, changedFields);                                     // 35
        }                                                                          // 36
      }                                                                            // 37
    } else if (observer.added) {                                                   // 38
      var fields = projectionFn(newDoc);                                           // 39
      delete fields._id;                                                           // 40
      observer.added(newDoc._id, fields);                                          // 41
    }                                                                              // 42
  });                                                                              // 43
                                                                                   // 44
  if (observer.removed) {                                                          // 45
    oldResults.forEach(function (oldDoc, id) {                                     // 46
      if (!newResults.has(id))                                                     // 47
        observer.removed(id);                                                      // 48
    });                                                                            // 49
  }                                                                                // 50
};                                                                                 // 51
                                                                                   // 52
                                                                                   // 53
DiffSequence.diffQueryOrderedChanges = function (old_results, new_results,         // 54
                                                     observer, options) {          // 55
  options = options || {};                                                         // 56
  var projectionFn = options.projectionFn || EJSON.clone;                          // 57
                                                                                   // 58
  var new_presence_of_id = {};                                                     // 59
  _.each(new_results, function (doc) {                                             // 60
    if (new_presence_of_id[doc._id])                                               // 61
      Meteor._debug("Duplicate _id in new_results");                               // 62
    new_presence_of_id[doc._id] = true;                                            // 63
  });                                                                              // 64
                                                                                   // 65
  var old_index_of_id = {};                                                        // 66
  _.each(old_results, function (doc, i) {                                          // 67
    if (doc._id in old_index_of_id)                                                // 68
      Meteor._debug("Duplicate _id in old_results");                               // 69
    old_index_of_id[doc._id] = i;                                                  // 70
  });                                                                              // 71
                                                                                   // 72
  // ALGORITHM:                                                                    // 73
  //                                                                               // 74
  // To determine which docs should be considered "moved" (and which               // 75
  // merely change position because of other docs moving) we run                   // 76
  // a "longest common subsequence" (LCS) algorithm.  The LCS of the               // 77
  // old doc IDs and the new doc IDs gives the docs that should NOT be             // 78
  // considered moved.                                                             // 79
                                                                                   // 80
  // To actually call the appropriate callbacks to get from the old state to the   // 81
  // new state:                                                                    // 82
                                                                                   // 83
  // First, we call removed() on all the items that only appear in the old         // 84
  // state.                                                                        // 85
                                                                                   // 86
  // Then, once we have the items that should not move, we walk through the new    // 87
  // results array group-by-group, where a "group" is a set of items that have     // 88
  // moved, anchored on the end by an item that should not move.  One by one, we   // 89
  // move each of those elements into place "before" the anchoring end-of-group    // 90
  // item, and fire changed events on them if necessary.  Then we fire a changed   // 91
  // event on the anchor, and move on to the next group.  There is always at       // 92
  // least one group; the last group is anchored by a virtual "null" id at the     // 93
  // end.                                                                          // 94
                                                                                   // 95
  // Asymptotically: O(N k) where k is number of ops, or potentially               // 96
  // O(N log N) if inner loop of LCS were made to be binary search.                // 97
                                                                                   // 98
                                                                                   // 99
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
        observer.addedBefore && observer.addedBefore(newDoc._id, fields, groupId);
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
/////////////////////////////////////////////////////////////////////////////////////

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
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var ReactiveDict;

(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/reactive-dict/reactive-dict.js                                      //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// XXX come up with a serialization method which canonicalizes object key       // 1
// order, which would allow us to use objects as values for equals.             // 2
var stringify = function (value) {                                              // 3
  if (value === undefined)                                                      // 4
    return 'undefined';                                                         // 5
  return EJSON.stringify(value);                                                // 6
};                                                                              // 7
var parse = function (serialized) {                                             // 8
  if (serialized === undefined || serialized === 'undefined')                   // 9
    return undefined;                                                           // 10
  return EJSON.parse(serialized);                                               // 11
};                                                                              // 12
                                                                                // 13
var changed = function (v) {                                                    // 14
  v && v.changed();                                                             // 15
};                                                                              // 16
                                                                                // 17
// XXX COMPAT WITH 0.9.1 : accept migrationData instead of dictName             // 18
ReactiveDict = function (dictName) {                                            // 19
  // this.keys: key -> value                                                    // 20
  if (dictName) {                                                               // 21
    if (typeof dictName === 'string') {                                         // 22
      // the normal case, argument is a string name.                            // 23
      // _registerDictForMigrate will throw an error on duplicate name.         // 24
      ReactiveDict._registerDictForMigrate(dictName, this);                     // 25
      this.keys = ReactiveDict._loadMigratedDict(dictName) || {};               // 26
      this.name = dictName;                                                     // 27
    } else if (typeof dictName === 'object') {                                  // 28
      // back-compat case: dictName is actually migrationData                   // 29
      this.keys = dictName;                                                     // 30
    } else {                                                                    // 31
      throw new Error("Invalid ReactiveDict argument: " + dictName);            // 32
    }                                                                           // 33
  } else {                                                                      // 34
    // no name given; no migration will be performed                            // 35
    this.keys = {};                                                             // 36
  }                                                                             // 37
                                                                                // 38
  this.allDeps = new Tracker.Dependency;                                        // 39
  this.keyDeps = {}; // key -> Dependency                                       // 40
  this.keyValueDeps = {}; // key -> Dependency                                  // 41
};                                                                              // 42
                                                                                // 43
_.extend(ReactiveDict.prototype, {                                              // 44
  // set() began as a key/value method, but we are now overloading it           // 45
  // to take an object of key/value pairs, similar to backbone                  // 46
  // http://backbonejs.org/#Model-set                                           // 47
                                                                                // 48
  set: function (keyOrObject, value) {                                          // 49
    var self = this;                                                            // 50
                                                                                // 51
    if ((typeof keyOrObject === 'object') && (value === undefined)) {           // 52
      // Called as `dict.set({...})`                                            // 53
      self._setObject(keyOrObject);                                             // 54
      return;                                                                   // 55
    }                                                                           // 56
    // the input isn't an object, so it must be a key                           // 57
    // and we resume with the rest of the function                              // 58
    var key = keyOrObject;                                                      // 59
                                                                                // 60
    value = stringify(value);                                                   // 61
                                                                                // 62
    var keyExisted = _.has(self.keys, key);                                     // 63
    var oldSerializedValue = keyExisted ? self.keys[key] : 'undefined';         // 64
    var isNewValue = (value !== oldSerializedValue);                            // 65
                                                                                // 66
    self.keys[key] = value;                                                     // 67
                                                                                // 68
    if (isNewValue || !keyExisted) {                                            // 69
      self.allDeps.changed();                                                   // 70
    }                                                                           // 71
                                                                                // 72
    if (isNewValue) {                                                           // 73
      changed(self.keyDeps[key]);                                               // 74
      if (self.keyValueDeps[key]) {                                             // 75
        changed(self.keyValueDeps[key][oldSerializedValue]);                    // 76
        changed(self.keyValueDeps[key][value]);                                 // 77
      }                                                                         // 78
    }                                                                           // 79
  },                                                                            // 80
                                                                                // 81
  setDefault: function (key, value) {                                           // 82
    var self = this;                                                            // 83
    if (! _.has(self.keys, key)) {                                              // 84
      self.set(key, value);                                                     // 85
    }                                                                           // 86
  },                                                                            // 87
                                                                                // 88
  get: function (key) {                                                         // 89
    var self = this;                                                            // 90
    self._ensureKey(key);                                                       // 91
    self.keyDeps[key].depend();                                                 // 92
    return parse(self.keys[key]);                                               // 93
  },                                                                            // 94
                                                                                // 95
  equals: function (key, value) {                                               // 96
    var self = this;                                                            // 97
                                                                                // 98
    // Mongo.ObjectID is in the 'mongo' package                                 // 99
    var ObjectID = null;                                                        // 100
    if (Package.mongo) {                                                        // 101
      ObjectID = Package.mongo.Mongo.ObjectID;                                  // 102
    }                                                                           // 103
                                                                                // 104
    // We don't allow objects (or arrays that might include objects) for        // 105
    // .equals, because JSON.stringify doesn't canonicalize object key          // 106
    // order. (We can make equals have the right return value by parsing the    // 107
    // current value and using EJSON.equals, but we won't have a canonical      // 108
    // element of keyValueDeps[key] to store the dependency.) You can still use
    // "EJSON.equals(reactiveDict.get(key), value)".                            // 110
    //                                                                          // 111
    // XXX we could allow arrays as long as we recursively check that there     // 112
    // are no objects                                                           // 113
    if (typeof value !== 'string' &&                                            // 114
        typeof value !== 'number' &&                                            // 115
        typeof value !== 'boolean' &&                                           // 116
        typeof value !== 'undefined' &&                                         // 117
        !(value instanceof Date) &&                                             // 118
        !(ObjectID && value instanceof ObjectID) &&                             // 119
        value !== null) {                                                       // 120
      throw new Error("ReactiveDict.equals: value must be scalar");             // 121
    }                                                                           // 122
    var serializedValue = stringify(value);                                     // 123
                                                                                // 124
    if (Tracker.active) {                                                       // 125
      self._ensureKey(key);                                                     // 126
                                                                                // 127
      if (! _.has(self.keyValueDeps[key], serializedValue))                     // 128
        self.keyValueDeps[key][serializedValue] = new Tracker.Dependency;       // 129
                                                                                // 130
      var isNew = self.keyValueDeps[key][serializedValue].depend();             // 131
      if (isNew) {                                                              // 132
        Tracker.onInvalidate(function () {                                      // 133
          // clean up [key][serializedValue] if it's now empty, so we don't     // 134
          // use O(n) memory for n = values seen ever                           // 135
          if (! self.keyValueDeps[key][serializedValue].hasDependents())        // 136
            delete self.keyValueDeps[key][serializedValue];                     // 137
        });                                                                     // 138
      }                                                                         // 139
    }                                                                           // 140
                                                                                // 141
    var oldValue = undefined;                                                   // 142
    if (_.has(self.keys, key)) oldValue = parse(self.keys[key]);                // 143
    return EJSON.equals(oldValue, value);                                       // 144
  },                                                                            // 145
                                                                                // 146
  all: function() {                                                             // 147
    this.allDeps.depend();                                                      // 148
    var ret = {};                                                               // 149
    _.each(this.keys, function(value, key) {                                    // 150
      ret[key] = parse(value);                                                  // 151
    });                                                                         // 152
    return ret;                                                                 // 153
  },                                                                            // 154
                                                                                // 155
  clear: function() {                                                           // 156
    var self = this;                                                            // 157
                                                                                // 158
    var oldKeys = self.keys;                                                    // 159
    self.keys = {};                                                             // 160
                                                                                // 161
    self.allDeps.changed();                                                     // 162
                                                                                // 163
    _.each(oldKeys, function(value, key) {                                      // 164
      changed(self.keyDeps[key]);                                               // 165
      changed(self.keyValueDeps[key][value]);                                   // 166
      changed(self.keyValueDeps[key]['undefined']);                             // 167
    });                                                                         // 168
                                                                                // 169
  },                                                                            // 170
                                                                                // 171
  delete: function(key) {                                                       // 172
    var self = this;                                                            // 173
    var didRemove = false;                                                      // 174
                                                                                // 175
    if (_.has(self.keys, key)) {                                                // 176
      var oldValue = self.keys[key];                                            // 177
      delete self.keys[key];                                                    // 178
      changed(self.keyDeps[key]);                                               // 179
      if (self.keyValueDeps[key]) {                                             // 180
        changed(self.keyValueDeps[key][oldValue]);                              // 181
        changed(self.keyValueDeps[key]['undefined']);                           // 182
      }                                                                         // 183
      self.allDeps.changed();                                                   // 184
      didRemove = true;                                                         // 185
    }                                                                           // 186
                                                                                // 187
    return didRemove;                                                           // 188
  },                                                                            // 189
                                                                                // 190
  _setObject: function (object) {                                               // 191
    var self = this;                                                            // 192
                                                                                // 193
    _.each(object, function (value, key){                                       // 194
      self.set(key, value);                                                     // 195
    });                                                                         // 196
  },                                                                            // 197
                                                                                // 198
  _ensureKey: function (key) {                                                  // 199
    var self = this;                                                            // 200
    if (!(key in self.keyDeps)) {                                               // 201
      self.keyDeps[key] = new Tracker.Dependency;                               // 202
      self.keyValueDeps[key] = {};                                              // 203
    }                                                                           // 204
  },                                                                            // 205
                                                                                // 206
  // Get a JSON value that can be passed to the constructor to                  // 207
  // create a new ReactiveDict with the same contents as this one               // 208
  _getMigrationData: function () {                                              // 209
    // XXX sanitize and make sure it's JSONible?                                // 210
    return this.keys;                                                           // 211
  }                                                                             // 212
});                                                                             // 213
                                                                                // 214
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/reactive-dict/migration.js                                          //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
ReactiveDict._migratedDictData = {}; // name -> data                            // 1
ReactiveDict._dictsToMigrate = {}; // name -> ReactiveDict                      // 2
                                                                                // 3
ReactiveDict._loadMigratedDict = function (dictName) {                          // 4
  if (_.has(ReactiveDict._migratedDictData, dictName))                          // 5
    return ReactiveDict._migratedDictData[dictName];                            // 6
                                                                                // 7
  return null;                                                                  // 8
};                                                                              // 9
                                                                                // 10
ReactiveDict._registerDictForMigrate = function (dictName, dict) {              // 11
  if (_.has(ReactiveDict._dictsToMigrate, dictName))                            // 12
    throw new Error("Duplicate ReactiveDict name: " + dictName);                // 13
                                                                                // 14
  ReactiveDict._dictsToMigrate[dictName] = dict;                                // 15
};                                                                              // 16
                                                                                // 17
if (Meteor.isClient && Package.reload) {                                        // 18
  // Put old migrated data into ReactiveDict._migratedDictData,                 // 19
  // where it can be accessed by ReactiveDict._loadMigratedDict.                // 20
  var migrationData = Package.reload.Reload._migrationData('reactive-dict');    // 21
  if (migrationData && migrationData.dicts)                                     // 22
    ReactiveDict._migratedDictData = migrationData.dicts;                       // 23
                                                                                // 24
  // On migration, assemble the data from all the dicts that have been          // 25
  // registered.                                                                // 26
  Package.reload.Reload._onMigrate('reactive-dict', function () {               // 27
    var dictsToMigrate = ReactiveDict._dictsToMigrate;                          // 28
    var dataToMigrate = {};                                                     // 29
                                                                                // 30
    for (var dictName in dictsToMigrate)                                        // 31
      dataToMigrate[dictName] = dictsToMigrate[dictName]._getMigrationData();   // 32
                                                                                // 33
    return [true, {dicts: dataToMigrate}];                                      // 34
  });                                                                           // 35
}                                                                               // 36
                                                                                // 37
//////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
// packages/session/session.js                                                 //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
                                                                               //
Session = new ReactiveDict('session');                                         // 1
                                                                               // 2
// Documentation here is really awkward because the methods are defined        // 3
// elsewhere                                                                   // 4
                                                                               // 5
/**                                                                            // 6
 * @memberOf Session                                                           // 7
 * @method set                                                                 // 8
 * @summary Set a variable in the session. Notify any listeners that the value
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
/////////////////////////////////////////////////////////////////////////////////

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
