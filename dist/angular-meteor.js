/*! angular-meteor v1.3.12 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("jsondiffpatch"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "jsondiffpatch"], factory);
	else if(typeof exports === 'object')
		exports["angularMeteor"] = factory(require("underscore"), require("jsondiffpatch"));
	else
		root["angularMeteor"] = factory(root["_"], root["jsondiffpatch"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_22__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(1);

	__webpack_require__(4);

	__webpack_require__(5);

	__webpack_require__(6);

	__webpack_require__(7);

	__webpack_require__(8);

	__webpack_require__(9);

	__webpack_require__(10);

	__webpack_require__(11);

	__webpack_require__(12);

	__webpack_require__(13);

	__webpack_require__(14);

	__webpack_require__(15);

	var _utils = __webpack_require__(16);

	var _mixer = __webpack_require__(17);

	var _scope = __webpack_require__(18);

	var _core = __webpack_require__(19);

	var _viewModel = __webpack_require__(20);

	var _reactive = __webpack_require__(21);

	var _templates = __webpack_require__(23);

	// legacy
	// lib
	var name = 'angular-meteor';

	// new
	exports.default = name;


	angular.module(name, [
	// new
	_utils.name, _mixer.name, _scope.name, _core.name, _viewModel.name, _reactive.name, _templates.name,

	// legacy
	'angular-meteor.ironrouter', 'angular-meteor.utils', 'angular-meteor.subscribe', 'angular-meteor.collection', 'angular-meteor.object', 'angular-meteor.user', 'angular-meteor.methods', 'angular-meteor.session', 'angular-meteor.camera']).run([_mixer.Mixer, _core.Core, _viewModel.ViewModel, _reactive.Reactive, function ($Mixer, $$Core, $$ViewModel, $$Reactive) {
	  // Load all mixins
	  $Mixer.mixin($$Core).mixin($$ViewModel).mixin($$Reactive);
	}])

	// legacy
	// Putting all services under $meteor service for syntactic sugar
	.service('$meteor', ['$meteorCollection', '$meteorCollectionFS', '$meteorObject', '$meteorMethods', '$meteorSession', '$meteorSubscribe', '$meteorUtils', '$meteorCamera', '$meteorUser', function ($meteorCollection, $meteorCollectionFS, $meteorObject, $meteorMethods, $meteorSession, $meteorSubscribe, $meteorUtils, $meteorCamera, $meteorUser) {
	  var _this = this;

	  this.collection = $meteorCollection;
	  this.collectionFS = $meteorCollectionFS;
	  this.object = $meteorObject;
	  this.subscribe = $meteorSubscribe.subscribe;
	  this.call = $meteorMethods.call;
	  this.session = $meteorSession;
	  this.autorun = $meteorUtils.autorun;
	  this.getCollectionByName = $meteorUtils.getCollectionByName;
	  this.getPicture = $meteorCamera.getPicture;

	  // $meteorUser
	  ['loginWithPassword', 'requireUser', 'requireValidUser', 'waitForUser', 'createUser', 'changePassword', 'forgotPassword', 'resetPassword', 'verifyEmail', 'loginWithMeteorDeveloperAccount', 'loginWithFacebook', 'loginWithGithub', 'loginWithGoogle', 'loginWithMeetup', 'loginWithTwitter', 'loginWithWeibo', 'logout', 'logoutOtherClients'].forEach(function (method) {
	    _this[method] = $meteorUser[method];
	  });
	}]);
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict';

	// https://github.com/DAB0mB/get-updates
	/*global
	 angular, _
	 */

	(function () {
	  var module = angular.module('getUpdates', []);

	  var utils = function () {
	    var rip = function rip(obj, level) {
	      if (level < 1) return {};

	      return _underscore2.default.reduce(obj, function (clone, v, k) {
	        v = _underscore2.default.isObject(v) ? rip(v, --level) : v;
	        clone[k] = v;
	        return clone;
	      }, {});
	    };

	    var toPaths = function toPaths(obj) {
	      var keys = getKeyPaths(obj);
	      var values = getDeepValues(obj);
	      return _underscore2.default.object(keys, values);
	    };

	    var getKeyPaths = function getKeyPaths(obj) {
	      var keys = _underscore2.default.keys(obj).map(function (k) {
	        var v = obj[k];
	        if (!_underscore2.default.isObject(v) || _underscore2.default.isEmpty(v) || _underscore2.default.isArray(v)) return k;

	        return getKeyPaths(v).map(function (subKey) {
	          return k + '.' + subKey;
	        });
	      });

	      return _underscore2.default.flatten(keys);
	    };

	    var getDeepValues = function getDeepValues(obj, arr) {
	      arr = arr || [];

	      _underscore2.default.values(obj).forEach(function (v) {
	        if (!_underscore2.default.isObject(v) || _underscore2.default.isEmpty(v) || _underscore2.default.isArray(v)) arr.push(v);else getDeepValues(v, arr);
	      });

	      return arr;
	    };

	    var flatten = function flatten(arr) {
	      return arr.reduce(function (flattened, v, i) {
	        if (_underscore2.default.isArray(v) && !_underscore2.default.isEmpty(v)) flattened.push.apply(flattened, flatten(v));else flattened.push(v);

	        return flattened;
	      }, []);
	    };

	    var setFilled = function setFilled(obj, k, v) {
	      if (!_underscore2.default.isEmpty(v)) obj[k] = v;
	    };

	    var assert = function assert(result, msg) {
	      if (!result) throwErr(msg);
	    };

	    var throwErr = function throwErr(msg) {
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
	  }();

	  var getDifference = function () {
	    var getDifference = function getDifference(src, dst, isShallow) {
	      var level;

	      if (isShallow > 1) level = isShallow;else if (isShallow) level = 1;

	      if (level) {
	        src = utils.rip(src, level);
	        dst = utils.rip(dst, level);
	      }

	      return compare(src, dst);
	    };

	    var compare = function compare(src, dst) {
	      var srcKeys = _underscore2.default.keys(src);
	      var dstKeys = _underscore2.default.keys(dst);

	      var keys = _underscore2.default.chain([]).concat(srcKeys).concat(dstKeys).uniq().without('$$hashKey').value();

	      return keys.reduce(function (diff, k) {
	        var srcValue = src[k];
	        var dstValue = dst[k];

	        if (_underscore2.default.isDate(srcValue) && _underscore2.default.isDate(dstValue)) {
	          if (srcValue.getTime() != dstValue.getTime()) diff[k] = dstValue;
	        }

	        if (_underscore2.default.isObject(srcValue) && _underscore2.default.isObject(dstValue)) {
	          var valueDiff = getDifference(srcValue, dstValue);
	          utils.setFilled(diff, k, valueDiff);
	        } else if (srcValue !== dstValue) {
	          diff[k] = dstValue;
	        }

	        return diff;
	      }, {});
	    };

	    return getDifference;
	  }();

	  var getUpdates = function () {
	    var getUpdates = function getUpdates(src, dst, isShallow) {
	      utils.assert(_underscore2.default.isObject(src), 'first argument must be an object');
	      utils.assert(_underscore2.default.isObject(dst), 'second argument must be an object');

	      var diff = getDifference(src, dst, isShallow);
	      var paths = utils.toPaths(diff);

	      var set = createSet(paths);
	      var unset = createUnset(paths);
	      var pull = createPull(unset);

	      var updates = {};
	      utils.setFilled(updates, '$set', set);
	      utils.setFilled(updates, '$unset', unset);
	      utils.setFilled(updates, '$pull', pull);

	      return updates;
	    };

	    var createSet = function createSet(paths) {
	      var undefinedKeys = getUndefinedKeys(paths);
	      return _underscore2.default.omit(paths, undefinedKeys);
	    };

	    var createUnset = function createUnset(paths) {
	      var undefinedKeys = getUndefinedKeys(paths);
	      var unset = _underscore2.default.pick(paths, undefinedKeys);

	      return _underscore2.default.reduce(unset, function (result, v, k) {
	        result[k] = true;
	        return result;
	      }, {});
	    };

	    var createPull = function createPull(unset) {
	      var arrKeyPaths = _underscore2.default.keys(unset).map(function (k) {
	        var split = k.match(/(.*)\.\d+$/);
	        return split && split[1];
	      });

	      return _underscore2.default.compact(arrKeyPaths).reduce(function (pull, k) {
	        pull[k] = null;
	        return pull;
	      }, {});
	    };

	    var getUndefinedKeys = function getUndefinedKeys(obj) {
	      return _underscore2.default.keys(obj).filter(function (k) {
	        var v = obj[k];
	        return _underscore2.default.isUndefined(v);
	      });
	    };

	    return getUpdates;
	  }();

	  module.value('getUpdates', getUpdates);
	})();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _underscore = __webpack_require__(3);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if (typeof _underscore2.default === 'undefined') {
	  if (typeof Package.underscore === 'undefined') {
	    throw new Error('underscore is missing');
	  }
	}

	exports.default = _underscore2.default || Package.underscore._;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /*global
	               angular, _, Package
	               */

	var _module = angular.module('diffArray', ['getUpdates']);

	_module.factory('diffArray', ['getUpdates', function (getUpdates) {
	  var LocalCollection = Package.minimongo.LocalCollection;
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

	    var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges || Package['diff-sequence'].DiffSequence.diffQueryOrderedChanges;

	    var oldObjIds = [];
	    var newObjIds = [];
	    var posOld = {}; // maps from idStringify'd ids
	    var posNew = {}; // ditto
	    var posCur = {};
	    var lengthCur = lastSeqArray.length;

	    _underscore2.default.each(seqArray, function (doc, i) {
	      newObjIds.push({ _id: doc._id });
	      posNew[idStringify(doc._id)] = i;
	    });

	    _underscore2.default.each(lastSeqArray, function (doc, i) {
	      oldObjIds.push({ _id: doc._id });
	      posOld[idStringify(doc._id)] = i;
	      posCur[idStringify(doc._id)] = i;
	    });

	    // Arrays can contain arbitrary objects. We don't diff the
	    // objects. Instead we always fire 'changedAt' callback on every
	    // object. The consumer of `observe-sequence` should deal with
	    // it appropriately.
	    diffFn(oldObjIds, newObjIds, {
	      addedBefore: function addedBefore(id, doc, before) {
	        var position = before ? posCur[idStringify(before)] : lengthCur;

	        _underscore2.default.each(posCur, function (pos, id) {
	          if (pos >= position) posCur[id]++;
	        });

	        lengthCur++;
	        posCur[idStringify(id)] = position;

	        callbacks.addedAt(id, seqArray[posNew[idStringify(id)]], position, before);
	      },

	      movedBefore: function movedBefore(id, before) {
	        var prevPosition = posCur[idStringify(id)];
	        var position = before ? posCur[idStringify(before)] : lengthCur - 1;

	        _underscore2.default.each(posCur, function (pos, id) {
	          if (pos >= prevPosition && pos <= position) posCur[id]--;else if (pos <= prevPosition && pos >= position) posCur[id]++;
	        });

	        posCur[idStringify(id)] = position;

	        callbacks.movedTo(id, seqArray[posNew[idStringify(id)]], prevPosition, position, before);
	      },
	      removed: function removed(id) {
	        var prevPosition = posCur[idStringify(id)];

	        _underscore2.default.each(posCur, function (pos, id) {
	          if (pos >= prevPosition) posCur[id]--;
	        });

	        delete posCur[idStringify(id)];
	        lengthCur--;

	        callbacks.removedAt(id, lastSeqArray[posOld[idStringify(id)]], prevPosition);
	      }
	    });

	    _underscore2.default.each(posNew, function (pos, idString) {
	      if (!_underscore2.default.has(posOld, idString)) return;

	      var id = idParse(idString);
	      var newItem = seqArray[pos] || {};
	      var oldItem = lastSeqArray[posOld[idString]];
	      var updates = getUpdates(oldItem, newItem, preventNestedDiff);

	      if (!_underscore2.default.isEmpty(updates)) callbacks.changedAt(id, updates, pos, oldItem);
	    });
	  }

	  diffArray.shallow = function (lastSeqArray, seqArray, callbacks) {
	    return diffArray(lastSeqArray, seqArray, callbacks, true);
	  };

	  diffArray.deepCopyChanges = function (oldItem, newItem) {
	    var setDiff = getUpdates(oldItem, newItem).$set;

	    _underscore2.default.each(setDiff, function (v, deepKey) {
	      setDeep(oldItem, deepKey, v);
	    });
	  };

	  diffArray.deepCopyRemovals = function (oldItem, newItem) {
	    var unsetDiff = getUpdates(oldItem, newItem).$unset;

	    _underscore2.default.each(unsetDiff, function (v, deepKey) {
	      unsetDeep(oldItem, deepKey);
	    });
	  };

	  // Finds changes between two collections
	  diffArray.getChanges = function (newCollection, oldCollection, diffMethod) {
	    var changes = { added: [], removed: [], changed: [] };

	    diffMethod(oldCollection, newCollection, {
	      addedAt: function addedAt(id, item, index) {
	        changes.added.push({ item: item, index: index });
	      },

	      removedAt: function removedAt(id, item, index) {
	        changes.removed.push({ item: item, index: index });
	      },

	      changedAt: function changedAt(id, updates, index, oldItem) {
	        changes.changed.push({ selector: id, modifier: updates });
	      },

	      movedTo: function movedTo(id, item, fromIndex, toIndex) {
	        // XXX do we need this?
	      }
	    });

	    return changes;
	  };

	  var setDeep = function setDeep(obj, deepKey, v) {
	    var split = deepKey.split('.');
	    var initialKeys = _underscore2.default.initial(split);
	    var lastKey = _underscore2.default.last(split);

	    initialKeys.reduce(function (subObj, k, i) {
	      var nextKey = split[i + 1];

	      if (isNumStr(nextKey)) {
	        if (subObj[k] === null) subObj[k] = [];
	        if (subObj[k].length == parseInt(nextKey)) subObj[k].push(null);
	      } else if (subObj[k] === null || !isHash(subObj[k])) {
	        subObj[k] = {};
	      }

	      return subObj[k];
	    }, obj);

	    var deepObj = getDeep(obj, initialKeys);
	    deepObj[lastKey] = v;
	    return v;
	  };

	  var unsetDeep = function unsetDeep(obj, deepKey) {
	    var split = deepKey.split('.');
	    var initialKeys = _underscore2.default.initial(split);
	    var lastKey = _underscore2.default.last(split);
	    var deepObj = getDeep(obj, initialKeys);

	    if (_underscore2.default.isArray(deepObj) && isNumStr(lastKey)) return !!deepObj.splice(lastKey, 1);else return delete deepObj[lastKey];
	  };

	  var getDeep = function getDeep(obj, keys) {
	    return keys.reduce(function (subObj, k) {
	      return subObj[k];
	    }, obj);
	  };

	  var isHash = function isHash(obj) {
	    return _underscore2.default.isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	  };

	  var isNumStr = function isNumStr(str) {
	    return str.match(/^\d+$/);
	  };

	  return diffArray;
	}]);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	angular.module('angular-meteor.settings', []).constant('$angularMeteorSettings', {
	  suppressWarnings: true
	});

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	angular.module('angular-meteor.ironrouter', []).run(['$compile', '$document', '$rootScope', function ($compile, $document, $rootScope) {
	  var Router = (Package['iron:router'] || {}).Router;
	  if (!Router) return;

	  var isLoaded = false;

	  // Recompile after iron:router builds page
	  Router.onAfterAction(function (req, res, next) {
	    Tracker.afterFlush(function () {
	      if (isLoaded) return;
	      $compile($document)($rootScope);
	      if (!$rootScope.$$phase) $rootScope.$apply();
	      isLoaded = true;
	    });
	  });
	}]);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*global
	                                                                                                                                                                                                                                                                               angular, _, Tracker, EJSON, FS, Mongo
	                                                                                                                                                                                                                                                                               */

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict';

	var angularMeteorUtils = angular.module('angular-meteor.utils', ['angular-meteor.settings']);

	angularMeteorUtils.service('$meteorUtils', ['$q', '$timeout', '$angularMeteorSettings', function ($q, $timeout, $angularMeteorSettings) {

	  var self = this;

	  this.autorun = function (scope, fn) {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.utils.autorun] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.6/autorun. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	    // wrapping around Deps.autorun
	    var comp = Tracker.autorun(function (c) {
	      fn(c);
	      // this is run immediately for the first call
	      // but after that, we need to $apply to start Angular digest
	      if (!c.firstRun) $timeout(angular.noop, 0);
	    });

	    // stop autorun when scope is destroyed
	    scope.$on('$destroy', function () {
	      comp.stop();
	    });

	    // return autorun object so that it can be stopped manually
	    return comp;
	  };

	  // Borrowed from angularFire
	  // https://github.com/firebase/angularfire/blob/master/src/utils.js#L445-L454
	  this.stripDollarPrefixedKeys = function (data) {
	    if (!_underscore2.default.isObject(data) || data instanceof Date || data instanceof File || EJSON.toJSONValue(data).$type === 'oid' || (typeof FS === 'undefined' ? 'undefined' : _typeof(FS)) === 'object' && data instanceof FS.File) return data;

	    var out = _underscore2.default.isArray(data) ? [] : {};

	    _underscore2.default.each(data, function (v, k) {
	      if (typeof k !== 'string' || k.charAt(0) !== '$') out[k] = self.stripDollarPrefixedKeys(v);
	    });

	    return out;
	  };

	  // Returns a callback which fulfills promise
	  this.fulfill = function (deferred, boundError, boundResult) {
	    return function (err, result) {
	      if (err) deferred.reject(boundError == null ? err : boundError);else if (typeof boundResult == "function") deferred.resolve(boundResult == null ? result : boundResult(result));else deferred.resolve(boundResult == null ? result : boundResult);
	    };
	  };

	  // creates a function which invokes method with the given arguments and returns a promise
	  this.promissor = function (obj, method) {
	    return function () {
	      var deferred = $q.defer();
	      var fulfill = self.fulfill(deferred);
	      var args = _underscore2.default.toArray(arguments).concat(fulfill);
	      obj[method].apply(obj, args);
	      return deferred.promise;
	    };
	  };

	  // creates a $q.all() promise and call digestion loop on fulfillment
	  this.promiseAll = function (promises) {
	    var allPromise = $q.all(promises);

	    allPromise.finally(function () {
	      // calls digestion loop with no conflicts
	      $timeout(angular.noop);
	    });

	    return allPromise;
	  };

	  this.getCollectionByName = function (string) {
	    return Mongo.Collection.get(string);
	  };

	  this.findIndexById = function (collection, doc) {
	    var foundDoc = _underscore2.default.find(collection, function (colDoc) {
	      // EJSON.equals used to compare Mongo.ObjectIDs and Strings.
	      return EJSON.equals(colDoc._id, doc._id);
	    });

	    return _underscore2.default.indexOf(collection, foundDoc);
	  };
	}]);

	angularMeteorUtils.run(['$rootScope', '$meteorUtils', function ($rootScope, $meteorUtils) {
	  Object.getPrototypeOf($rootScope).$meteorAutorun = function (fn) {
	    return $meteorUtils.autorun(this, fn);
	  };
	}]);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/*global
	 angular, Meteor
	 */

	'use strict';

	var angularMeteorSubscribe = angular.module('angular-meteor.subscribe', ['angular-meteor.settings']);

	angularMeteorSubscribe.service('$meteorSubscribe', ['$q', '$angularMeteorSettings', function ($q, $angularMeteorSettings) {

	  var self = this;

	  this._subscribe = function (scope, deferred, args) {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.subscribe] Please note that this module is deprecated since 1.3.0 and will be removed in 1.4.0! Replace it with the new syntax described here: http://www.angular-meteor.com/api/1.3.6/subscribe. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	    var subscription = null;
	    var lastArg = args[args.length - 1];

	    // User supplied onStop callback
	    // save it for later use and remove
	    // from subscription arguments
	    if (angular.isObject(lastArg) && angular.isFunction(lastArg.onStop)) {
	      var _onStop = lastArg.onStop;

	      args.pop();
	    }

	    args.push({
	      onReady: function onReady() {
	        deferred.resolve(subscription);
	      },
	      onStop: function onStop(err) {
	        if (!deferred.promise.$$state.status) {
	          if (err) deferred.reject(err);else deferred.reject(new Meteor.Error("Subscription Stopped", "Subscription stopped by a call to stop method. Either by the client or by the server."));
	        } else if (_onStop)
	          // After promise was resolved or rejected
	          // call user supplied onStop callback.
	          _onStop.apply(this, Array.prototype.slice.call(arguments));
	      }
	    });

	    subscription = Meteor.subscribe.apply(scope, args);

	    return subscription;
	  };

	  this.subscribe = function () {
	    var deferred = $q.defer();
	    var args = Array.prototype.slice.call(arguments);
	    var subscription = null;

	    self._subscribe(this, deferred, args);

	    return deferred.promise;
	  };
	}]);

	angularMeteorSubscribe.run(['$rootScope', '$q', '$meteorSubscribe', function ($rootScope, $q, $meteorSubscribe) {
	  Object.getPrototypeOf($rootScope).$meteorSubscribe = function () {
	    var deferred = $q.defer();
	    var args = Array.prototype.slice.call(arguments);

	    var subscription = $meteorSubscribe._subscribe(this, deferred, args);

	    this.$on('$destroy', function () {
	      subscription.stop();
	    });

	    return deferred.promise;
	  };
	}]);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /*global
	               angular, _, Tracker, check, Match, Mongo
	               */

	var angularMeteorCollection = angular.module('angular-meteor.collection', ['angular-meteor.stopper', 'angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray', 'angular-meteor.settings']);

	// The reason angular meteor collection is a factory function and not something
	// that inherit from array comes from here:
	// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
	// We went with the direct extensions approach.
	angularMeteorCollection.factory('AngularMeteorCollection', ['$q', '$meteorSubscribe', '$meteorUtils', '$rootScope', '$timeout', 'diffArray', '$angularMeteorSettings', function ($q, $meteorSubscribe, $meteorUtils, $rootScope, $timeout, diffArray, $angularMeteorSettings) {

	  function AngularMeteorCollection(curDefFunc, collection, diffArrayFunc, autoClientSave) {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.$meteorCollection] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/meteorCollection. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	    var data = [];
	    // Server backup data to evaluate what changes come from client
	    // after each server update.
	    data._serverBackup = [];
	    // Array differ function.
	    data._diffArrayFunc = diffArrayFunc;
	    // Handler of the cursor observer.
	    data._hObserve = null;
	    // On new cursor autorun handler
	    // (autorun for reactive variables).
	    data._hNewCurAutorun = null;
	    // On new data autorun handler
	    // (autorun for cursor.fetch).
	    data._hDataAutorun = null;

	    if (angular.isDefined(collection)) {
	      data.$$collection = collection;
	    } else {
	      var cursor = curDefFunc();
	      data.$$collection = $meteorUtils.getCollectionByName(cursor.collection.name);
	    }

	    _underscore2.default.extend(data, AngularMeteorCollection);
	    data._startCurAutorun(curDefFunc, autoClientSave);

	    return data;
	  }

	  AngularMeteorCollection._startCurAutorun = function (curDefFunc, autoClientSave) {
	    var self = this;

	    self._hNewCurAutorun = Tracker.autorun(function () {
	      // When the reactive func gets recomputated we need to stop any previous
	      // observeChanges.
	      Tracker.onInvalidate(function () {
	        self._stopCursor();
	      });

	      if (autoClientSave) self._setAutoClientSave();
	      self._updateCursor(curDefFunc(), autoClientSave);
	    });
	  };

	  AngularMeteorCollection.subscribe = function () {
	    $meteorSubscribe.subscribe.apply(this, arguments);
	    return this;
	  };

	  AngularMeteorCollection.save = function (docs, useUnsetModifier) {
	    // save whole collection
	    if (!docs) docs = this;
	    // save single doc
	    docs = [].concat(docs);

	    var promises = docs.map(function (doc) {
	      return this._upsertDoc(doc, useUnsetModifier);
	    }, this);

	    return $meteorUtils.promiseAll(promises);
	  };

	  AngularMeteorCollection._upsertDoc = function (doc, useUnsetModifier) {
	    var deferred = $q.defer();
	    var collection = this.$$collection;
	    var createFulfill = _underscore2.default.partial($meteorUtils.fulfill, deferred, null);

	    // delete $$hashkey
	    doc = $meteorUtils.stripDollarPrefixedKeys(doc);
	    var docId = doc._id;
	    var isExist = collection.findOne(docId);

	    // update
	    if (isExist) {
	      // Deletes _id property (from the copy) so that
	      // it can be $set using update.
	      delete doc._id;
	      var modifier = useUnsetModifier ? { $unset: doc } : { $set: doc };
	      // NOTE: do not use #upsert() method, since it does not exist in some collections
	      collection.update(docId, modifier, createFulfill(function () {
	        return { _id: docId, action: 'updated' };
	      }));
	    }
	    // insert
	    else {
	        collection.insert(doc, createFulfill(function (id) {
	          return { _id: id, action: 'inserted' };
	        }));
	      }

	    return deferred.promise;
	  };

	  // performs $pull operations parallely.
	  // used for handling splice operations returned from getUpdates() to prevent conflicts.
	  // see issue: https://github.com/Urigo/angular-meteor/issues/793
	  AngularMeteorCollection._updateDiff = function (selector, update, callback) {
	    callback = callback || angular.noop;
	    var setters = _underscore2.default.omit(update, '$pull');
	    var updates = [setters];

	    _underscore2.default.each(update.$pull, function (pull, prop) {
	      var puller = {};
	      puller[prop] = pull;
	      updates.push({ $pull: puller });
	    });

	    this._updateParallel(selector, updates, callback);
	  };

	  // performs each update operation parallely
	  AngularMeteorCollection._updateParallel = function (selector, updates, callback) {
	    var self = this;
	    var done = _underscore2.default.after(updates.length, callback);

	    var next = function next(err, affectedDocsNum) {
	      if (err) return callback(err);
	      done(null, affectedDocsNum);
	    };

	    _underscore2.default.each(updates, function (update) {
	      self.$$collection.update(selector, update, next);
	    });
	  };

	  AngularMeteorCollection.remove = function (keyOrDocs) {
	    var keys;

	    // remove whole collection
	    if (!keyOrDocs) {
	      keys = _underscore2.default.pluck(this, '_id');
	    }
	    // remove docs
	    else {
	        keyOrDocs = [].concat(keyOrDocs);

	        keys = _underscore2.default.map(keyOrDocs, function (keyOrDoc) {
	          return keyOrDoc._id || keyOrDoc;
	        });
	      }

	    // Checks if all keys are correct.
	    check(keys, [Match.OneOf(String, Mongo.ObjectID)]);

	    var promises = keys.map(function (key) {
	      return this._removeDoc(key);
	    }, this);

	    return $meteorUtils.promiseAll(promises);
	  };

	  AngularMeteorCollection._removeDoc = function (id) {
	    var deferred = $q.defer();
	    var collection = this.$$collection;
	    var fulfill = $meteorUtils.fulfill(deferred, null, { _id: id, action: 'removed' });
	    collection.remove(id, fulfill);
	    return deferred.promise;
	  };

	  AngularMeteorCollection._updateCursor = function (cursor, autoClientSave) {
	    var self = this;
	    // XXX - consider adding an option for a non-orderd result for faster performance
	    if (self._hObserve) self._stopObserving();

	    self._hObserve = cursor.observe({
	      addedAt: function addedAt(doc, atIndex) {
	        self.splice(atIndex, 0, doc);
	        self._serverBackup.splice(atIndex, 0, doc);
	        self._setServerUpdateMode();
	      },

	      changedAt: function changedAt(doc, oldDoc, atIndex) {
	        diffArray.deepCopyChanges(self[atIndex], doc);
	        diffArray.deepCopyRemovals(self[atIndex], doc);
	        self._serverBackup[atIndex] = self[atIndex];
	        self._setServerUpdateMode();
	      },

	      movedTo: function movedTo(doc, fromIndex, toIndex) {
	        self.splice(fromIndex, 1);
	        self.splice(toIndex, 0, doc);
	        self._serverBackup.splice(fromIndex, 1);
	        self._serverBackup.splice(toIndex, 0, doc);
	        self._setServerUpdateMode();
	      },

	      removedAt: function removedAt(oldDoc) {
	        var removedIndex = $meteorUtils.findIndexById(self, oldDoc);

	        if (removedIndex != -1) {
	          self.splice(removedIndex, 1);
	          self._serverBackup.splice(removedIndex, 1);
	          self._setServerUpdateMode();
	        } else {
	          // If it's been removed on client then it's already not in collection
	          // itself but still is in the _serverBackup.
	          removedIndex = $meteorUtils.findIndexById(self._serverBackup, oldDoc);

	          if (removedIndex != -1) {
	            self._serverBackup.splice(removedIndex, 1);
	          }
	        }
	      }
	    });

	    self._hDataAutorun = Tracker.autorun(function () {
	      cursor.fetch();
	      if (self._serverMode) self._unsetServerUpdateMode(autoClientSave);
	    });
	  };

	  AngularMeteorCollection._stopObserving = function () {
	    this._hObserve.stop();
	    this._hDataAutorun.stop();
	    delete this._serverMode;
	    delete this._hUnsetTimeout;
	  };

	  AngularMeteorCollection._setServerUpdateMode = function (name) {
	    this._serverMode = true;
	    // To simplify server update logic, we don't follow
	    // updates from the client at the same time.
	    this._unsetAutoClientSave();
	  };

	  // Here we use $timeout to combine multiple updates that go
	  // each one after another.
	  AngularMeteorCollection._unsetServerUpdateMode = function (autoClientSave) {
	    var self = this;

	    if (self._hUnsetTimeout) {
	      $timeout.cancel(self._hUnsetTimeout);
	      self._hUnsetTimeout = null;
	    }

	    self._hUnsetTimeout = $timeout(function () {
	      self._serverMode = false;
	      // Finds updates that was potentially done from the client side
	      // and saves them.
	      var changes = diffArray.getChanges(self, self._serverBackup, self._diffArrayFunc);
	      self._saveChanges(changes);
	      // After, continues following client updates.
	      if (autoClientSave) self._setAutoClientSave();
	    }, 0);
	  };

	  AngularMeteorCollection.stop = function () {
	    this._stopCursor();
	    this._hNewCurAutorun.stop();
	  };

	  AngularMeteorCollection._stopCursor = function () {
	    this._unsetAutoClientSave();

	    if (this._hObserve) {
	      this._hObserve.stop();
	      this._hDataAutorun.stop();
	    }

	    this.splice(0);
	    this._serverBackup.splice(0);
	  };

	  AngularMeteorCollection._unsetAutoClientSave = function (name) {
	    if (this._hRegAutoBind) {
	      this._hRegAutoBind();
	      this._hRegAutoBind = null;
	    }
	  };

	  AngularMeteorCollection._setAutoClientSave = function () {
	    var self = this;

	    // Always unsets auto save to keep only one $watch handler.
	    self._unsetAutoClientSave();

	    self._hRegAutoBind = $rootScope.$watch(function () {
	      return self;
	    }, function (nItems, oItems) {
	      if (nItems === oItems) return;

	      var changes = diffArray.getChanges(self, oItems, self._diffArrayFunc);
	      self._unsetAutoClientSave();
	      self._saveChanges(changes);
	      self._setAutoClientSave();
	    }, true);
	  };

	  AngularMeteorCollection._saveChanges = function (changes) {
	    var self = this;

	    // Saves added documents
	    // Using reversed iteration to prevent indexes from changing during splice
	    var addedDocs = changes.added.reverse().map(function (descriptor) {
	      self.splice(descriptor.index, 1);
	      return descriptor.item;
	    });

	    if (addedDocs.length) self.save(addedDocs);

	    // Removes deleted documents
	    var removedDocs = changes.removed.map(function (descriptor) {
	      return descriptor.item;
	    });

	    if (removedDocs.length) self.remove(removedDocs);

	    // Updates changed documents
	    changes.changed.forEach(function (descriptor) {
	      self._updateDiff(descriptor.selector, descriptor.modifier);
	    });
	  };

	  return AngularMeteorCollection;
	}]);

	angularMeteorCollection.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray', '$angularMeteorSettings', function ($meteorCollection, diffArray, $angularMeteorSettings) {
	  function $meteorCollectionFS(reactiveFunc, autoClientSave, collection) {

	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.$meteorCollectionFS] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/files. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');
	    return new $meteorCollection(reactiveFunc, autoClientSave, collection, diffArray.shallow);
	  }

	  return $meteorCollectionFS;
	}]);

	angularMeteorCollection.factory('$meteorCollection', ['AngularMeteorCollection', '$rootScope', 'diffArray', function (AngularMeteorCollection, $rootScope, diffArray) {
	  function $meteorCollection(reactiveFunc, autoClientSave, collection, diffFn) {
	    // Validate parameters
	    if (!reactiveFunc) {
	      throw new TypeError('The first argument of $meteorCollection is undefined.');
	    }

	    if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {
	      throw new TypeError('The first argument of $meteorCollection must be a function or ' + 'a have a find function property.');
	    }

	    if (!angular.isFunction(reactiveFunc)) {
	      collection = angular.isDefined(collection) ? collection : reactiveFunc;
	      reactiveFunc = _underscore2.default.bind(reactiveFunc.find, reactiveFunc);
	    }

	    // By default auto save - true.
	    autoClientSave = angular.isDefined(autoClientSave) ? autoClientSave : true;
	    diffFn = diffFn || diffArray;
	    return new AngularMeteorCollection(reactiveFunc, collection, diffFn, autoClientSave);
	  }

	  return $meteorCollection;
	}]);

	angularMeteorCollection.run(['$rootScope', '$meteorCollection', '$meteorCollectionFS', '$meteorStopper', function ($rootScope, $meteorCollection, $meteorCollectionFS, $meteorStopper) {
	  var scopeProto = Object.getPrototypeOf($rootScope);
	  scopeProto.$meteorCollection = $meteorStopper($meteorCollection);
	  scopeProto.$meteorCollectionFS = $meteorStopper($meteorCollectionFS);
	}]);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /*global
	                angular, _, Mongo
	              */

	var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe', 'angular-meteor.collection', 'getUpdates', 'diffArray', 'angular-meteor.settings']);

	angularMeteorObject.factory('AngularMeteorObject', ['$q', '$meteorSubscribe', '$meteorUtils', 'diffArray', 'getUpdates', 'AngularMeteorCollection', '$angularMeteorSettings', function ($q, $meteorSubscribe, $meteorUtils, diffArray, getUpdates, AngularMeteorCollection, $angularMeteorSettings) {

	  // A list of internals properties to not watch for, nor pass to the Document on update and etc.
	  AngularMeteorObject.$$internalProps = ['$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', '$$scope', 'bind', 'save', 'reset', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject', '_auto', '_setAutos', '_eventEmitter', '_serverBackup', '_updateDiff', '_updateParallel', '_getId'];

	  function AngularMeteorObject(collection, selector, options) {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.$meteorObject] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/meteorObject. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');
	    // Make data not be an object so we can extend it to preserve
	    // Collection Helpers and the like
	    var helpers = collection._helpers;
	    var data = _underscore2.default.isFunction(helpers) ? Object.create(helpers.prototype) : {};
	    var doc = collection.findOne(selector, options);
	    var collectionExtension = _underscore2.default.pick(AngularMeteorCollection, '_updateParallel');
	    _underscore2.default.extend(data, doc);
	    _underscore2.default.extend(data, AngularMeteorObject);
	    _underscore2.default.extend(data, collectionExtension);

	    // Omit options that may spoil document finding
	    data.$$options = _underscore2.default.omit(options, 'skip', 'limit');
	    data.$$collection = collection;
	    data.$$id = data._getId(selector);
	    data._serverBackup = doc || {};

	    return data;
	  }

	  AngularMeteorObject.getRawObject = function () {
	    return angular.copy(_underscore2.default.omit(this, this.$$internalProps));
	  };

	  AngularMeteorObject.subscribe = function () {
	    $meteorSubscribe.subscribe.apply(this, arguments);
	    return this;
	  };

	  AngularMeteorObject.save = function (custom) {
	    var deferred = $q.defer();
	    var collection = this.$$collection;
	    var createFulfill = _underscore2.default.partial($meteorUtils.fulfill, deferred, null);
	    var oldDoc = collection.findOne(this.$$id);
	    var mods;

	    // update
	    if (oldDoc) {
	      if (custom) mods = { $set: custom };else {
	        mods = getUpdates(oldDoc, this.getRawObject());
	        // If there are no updates, there is nothing to do here, returning
	        if (_underscore2.default.isEmpty(mods)) {
	          return $q.when({ action: 'updated' });
	        }
	      }

	      // NOTE: do not use #upsert() method, since it does not exist in some collections
	      this._updateDiff(mods, createFulfill({ action: 'updated' }));
	    }
	    // insert
	    else {
	        if (custom) mods = _underscore2.default.clone(custom);else mods = this.getRawObject();

	        mods._id = mods._id || this.$$id;
	        collection.insert(mods, createFulfill({ action: 'inserted' }));
	      }

	    return deferred.promise;
	  };

	  AngularMeteorObject._updateDiff = function (update, callback) {
	    var selector = this.$$id;
	    AngularMeteorCollection._updateDiff.call(this, selector, update, callback);
	  };

	  AngularMeteorObject.reset = function (keepClientProps) {
	    var self = this;
	    var options = this.$$options;
	    var id = this.$$id;
	    var doc = this.$$collection.findOne(id, options);

	    if (doc) {
	      // extend SubObject
	      var docKeys = _underscore2.default.keys(doc);
	      var docExtension = _underscore2.default.pick(doc, docKeys);
	      var clientProps;

	      _underscore2.default.extend(self, docExtension);
	      _underscore2.default.extend(self._serverBackup, docExtension);

	      if (keepClientProps) {
	        clientProps = _underscore2.default.intersection(_underscore2.default.keys(self), _underscore2.default.keys(self._serverBackup));
	      } else {
	        clientProps = _underscore2.default.keys(self);
	      }

	      var serverProps = _underscore2.default.keys(doc);
	      var removedKeys = _underscore2.default.difference(clientProps, serverProps, self.$$internalProps);

	      removedKeys.forEach(function (prop) {
	        delete self[prop];
	        delete self._serverBackup[prop];
	      });
	    } else {
	      _underscore2.default.keys(this.getRawObject()).forEach(function (prop) {
	        delete self[prop];
	      });

	      self._serverBackup = {};
	    }
	  };

	  AngularMeteorObject.stop = function () {
	    if (this.unregisterAutoDestroy) this.unregisterAutoDestroy();

	    if (this.unregisterAutoBind) this.unregisterAutoBind();

	    if (this.autorunComputation && this.autorunComputation.stop) this.autorunComputation.stop();
	  };

	  AngularMeteorObject._getId = function (selector) {
	    var options = _underscore2.default.extend({}, this.$$options, {
	      fields: { _id: 1 },
	      reactive: false,
	      transform: null
	    });

	    var doc = this.$$collection.findOne(selector, options);

	    if (doc) return doc._id;
	    if (selector instanceof Mongo.ObjectID) return selector;
	    if (_underscore2.default.isString(selector)) return selector;
	    return new Mongo.ObjectID();
	  };

	  return AngularMeteorObject;
	}]);

	angularMeteorObject.factory('$meteorObject', ['$rootScope', '$meteorUtils', 'getUpdates', 'AngularMeteorObject', function ($rootScope, $meteorUtils, getUpdates, AngularMeteorObject) {
	  function $meteorObject(collection, id, auto, options) {
	    // Validate parameters
	    if (!collection) {
	      throw new TypeError("The first argument of $meteorObject is undefined.");
	    }

	    if (!angular.isFunction(collection.findOne)) {
	      throw new TypeError("The first argument of $meteorObject must be a function or a have a findOne function property.");
	    }

	    var data = new AngularMeteorObject(collection, id, options);
	    // Making auto default true - http://stackoverflow.com/a/15464208/1426570
	    data._auto = auto !== false;
	    _underscore2.default.extend(data, $meteorObject);
	    data._setAutos();
	    return data;
	  }

	  $meteorObject._setAutos = function () {
	    var self = this;

	    this.autorunComputation = $meteorUtils.autorun($rootScope, function () {
	      self.reset(true);
	    });

	    // Deep watches the model and performs autobind
	    this.unregisterAutoBind = this._auto && $rootScope.$watch(function () {
	      return self.getRawObject();
	    }, function (item, oldItem) {
	      if (item !== oldItem) self.save();
	    }, true);

	    this.unregisterAutoDestroy = $rootScope.$on('$destroy', function () {
	      if (self && self.stop) self.stop();
	    });
	  };

	  return $meteorObject;
	}]);

	angularMeteorObject.run(['$rootScope', '$meteorObject', '$meteorStopper', function ($rootScope, $meteorObject, $meteorStopper) {
	  var scopeProto = Object.getPrototypeOf($rootScope);
	  scopeProto.$meteorObject = $meteorStopper($meteorObject);
	}]);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /*global
	               angular, _, Package, Meteor
	               */

	var angularMeteorUser = angular.module('angular-meteor.user', ['angular-meteor.utils', 'angular-meteor.core', 'angular-meteor.settings']);

	// requires package 'accounts-password'
	angularMeteorUser.service('$meteorUser', ['$rootScope', '$meteorUtils', '$q', '$angularMeteorSettings', function ($rootScope, $meteorUtils, $q, $angularMeteorSettings) {

	  var pack = Package['accounts-base'];
	  if (!pack) return;

	  var self = this;
	  var Accounts = pack.Accounts;

	  this.waitForUser = function () {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.waitForUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	    var deferred = $q.defer();

	    $meteorUtils.autorun($rootScope, function () {
	      if (!Meteor.loggingIn()) deferred.resolve(Meteor.user());
	    }, true);

	    return deferred.promise;
	  };

	  this.requireUser = function () {
	    if (!$angularMeteorSettings.suppressWarnings) {
	      console.warn('[angular-meteor.requireUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');
	    }

	    var deferred = $q.defer();

	    $meteorUtils.autorun($rootScope, function () {
	      if (!Meteor.loggingIn()) {
	        if (Meteor.user() === null) deferred.reject("AUTH_REQUIRED");else deferred.resolve(Meteor.user());
	      }
	    }, true);

	    return deferred.promise;
	  };

	  this.requireValidUser = function (validatorFn) {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.requireValidUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	    return self.requireUser(true).then(function (user) {
	      var valid = validatorFn(user);

	      if (valid === true) return user;else if (typeof valid === "string") return $q.reject(valid);else return $q.reject("FORBIDDEN");
	    });
	  };

	  this.loginWithPassword = $meteorUtils.promissor(Meteor, 'loginWithPassword');
	  this.createUser = $meteorUtils.promissor(Accounts, 'createUser');
	  this.changePassword = $meteorUtils.promissor(Accounts, 'changePassword');
	  this.forgotPassword = $meteorUtils.promissor(Accounts, 'forgotPassword');
	  this.resetPassword = $meteorUtils.promissor(Accounts, 'resetPassword');
	  this.verifyEmail = $meteorUtils.promissor(Accounts, 'verifyEmail');
	  this.logout = $meteorUtils.promissor(Meteor, 'logout');
	  this.logoutOtherClients = $meteorUtils.promissor(Meteor, 'logoutOtherClients');
	  this.loginWithFacebook = $meteorUtils.promissor(Meteor, 'loginWithFacebook');
	  this.loginWithTwitter = $meteorUtils.promissor(Meteor, 'loginWithTwitter');
	  this.loginWithGoogle = $meteorUtils.promissor(Meteor, 'loginWithGoogle');
	  this.loginWithGithub = $meteorUtils.promissor(Meteor, 'loginWithGithub');
	  this.loginWithMeteorDeveloperAccount = $meteorUtils.promissor(Meteor, 'loginWithMeteorDeveloperAccount');
	  this.loginWithMeetup = $meteorUtils.promissor(Meteor, 'loginWithMeetup');
	  this.loginWithWeibo = $meteorUtils.promissor(Meteor, 'loginWithWeibo');
	}]);

	angularMeteorUser.run(['$rootScope', '$angularMeteorSettings', '$$Core', function ($rootScope, $angularMeteorSettings, $$Core) {

	  var ScopeProto = Object.getPrototypeOf($rootScope);
	  _underscore2.default.extend(ScopeProto, $$Core);

	  $rootScope.autorun(function () {
	    if (!Meteor.user) return;
	    $rootScope.currentUser = Meteor.user();
	    $rootScope.loggingIn = Meteor.loggingIn();
	  });
	}]);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /*global
	               angular, _, Meteor
	               */

	var angularMeteorMethods = angular.module('angular-meteor.methods', ['angular-meteor.utils', 'angular-meteor.settings']);

	angularMeteorMethods.service('$meteorMethods', ['$q', '$meteorUtils', '$angularMeteorSettings', function ($q, $meteorUtils, $angularMeteorSettings) {
	  this.call = function () {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.$meteor.call] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/methods. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	    var deferred = $q.defer();
	    var fulfill = $meteorUtils.fulfill(deferred);
	    var args = _underscore2.default.toArray(arguments).concat(fulfill);
	    Meteor.call.apply(this, args);
	    return deferred.promise;
	  };
	}]);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	/*global
	 angular, Session
	 */

	'use strict';

	var angularMeteorSession = angular.module('angular-meteor.session', ['angular-meteor.utils', 'angular-meteor.settings']);

	angularMeteorSession.factory('$meteorSession', ['$meteorUtils', '$parse', '$angularMeteorSettings', function ($meteorUtils, $parse, $angularMeteorSettings) {
	  return function (session) {

	    return {

	      bind: function bind(scope, model) {
	        if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.session.bind] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://www.angular-meteor.com/api/1.3.0/session. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	        var getter = $parse(model);
	        var setter = getter.assign;
	        $meteorUtils.autorun(scope, function () {
	          setter(scope, Session.get(session));
	        });

	        scope.$watch(model, function (newItem, oldItem) {
	          Session.set(session, getter(scope));
	        }, true);
	      }
	    };
	  };
	}]);

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/*global
	 angular, Package
	 */

	'use strict';

	var angularMeteorCamera = angular.module('angular-meteor.camera', ['angular-meteor.utils', 'angular-meteor.settings']);

	// requires package 'mdg:camera'
	angularMeteorCamera.service('$meteorCamera', ['$q', '$meteorUtils', '$angularMeteorSettings', function ($q, $meteorUtils, $angularMeteorSettings) {
	  if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.camera] Please note that this module has moved to a separate package and is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/camera. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');
	  var pack = Package['mdg:camera'];
	  if (!pack) return;

	  var MeteorCamera = pack.MeteorCamera;

	  this.getPicture = function (options) {
	    if (!$angularMeteorSettings.suppressWarnings) console.warn('[angular-meteor.camera] Please note that this module has moved to a separate package and is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/camera. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

	    options = options || {};
	    var deferred = $q.defer();
	    MeteorCamera.getPicture(options, $meteorUtils.fulfill(deferred));
	    return deferred.promise;
	  };
	}]);

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	/*global
	 angular
	 */

	'use strict';

	var angularMeteorStopper = angular.module('angular-meteor.stopper', ['angular-meteor.subscribe']);

	angularMeteorStopper.factory('$meteorStopper', ['$q', '$meteorSubscribe', function ($q, $meteorSubscribe) {
	  function $meteorStopper($meteorEntity) {
	    return function () {
	      var args = Array.prototype.slice.call(arguments);
	      var meteorEntity = $meteorEntity.apply(this, args);

	      angular.extend(meteorEntity, $meteorStopper);
	      meteorEntity.$$scope = this;

	      this.$on('$destroy', function () {
	        meteorEntity.stop();
	        if (meteorEntity.subscription) meteorEntity.subscription.stop();
	      });

	      return meteorEntity;
	    };
	  }

	  $meteorStopper.subscribe = function () {
	    var args = Array.prototype.slice.call(arguments);
	    this.subscription = $meteorSubscribe._subscribe(this.$$scope, $q.defer(), args);
	    return this;
	  };

	  return $meteorStopper;
	}]);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.utils = exports.name = undefined;

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var name = exports.name = 'angular-meteor.utilities';
	var utils = exports.utils = '$$utils';

	angular.module(name, [])

	/*
	  A utility service which is provided with general utility functions
	 */
	.service(utils, ['$rootScope', function ($rootScope) {
	  var self = this;

	  // Checks if an object is a cursor
	  this.isCursor = function (obj) {
	    return obj instanceof Meteor.Collection.Cursor;
	  };

	  // Cheecks if an object is a scope
	  this.isScope = function (obj) {
	    return obj instanceof $rootScope.constructor;
	  };

	  // Checks if an object is a view model
	  this.isViewModel = function (obj) {
	    return _underscore2.default.isObject(obj) && obj.$$dependencies;
	  };

	  // Checks if two objects are siblings
	  this.areSiblings = function (obj1, obj2) {
	    return _underscore2.default.isObject(obj1) && _underscore2.default.isObject(obj2) && Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2);
	  };

	  // Binds function into a scpecified context. If an object is provided, will bind every
	  // value in the object which is a function. If a tap function is provided, it will be
	  // called right after the function has been invoked.
	  this.bind = function (fn, context, tap) {
	    tap = _underscore2.default.isFunction(tap) ? tap : angular.noop;
	    if (_underscore2.default.isFunction(fn)) return bindFn(fn, context, tap);
	    if (_underscore2.default.isObject(fn)) return bindObj(fn, context, tap);
	    return fn;
	  };

	  function bindFn(fn, context, tap) {
	    return function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var result = fn.apply(context, args);
	      tap.call(context, {
	        result: result,
	        args: args
	      });
	      return result;
	    };
	  }

	  function bindObj(obj, context, tap) {
	    return _underscore2.default.keys(obj).reduce(function (bound, k) {
	      bound[k] = self.bind(obj[k], context, tap);
	      return bound;
	    }, {});
	  }
	}]);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Mixer = exports.name = undefined;

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var name = exports.name = 'angular-meteor.mixer';
	var Mixer = exports.Mixer = '$Mixer';

	angular.module(name, [])

	/*
	  A service which lets us apply mixins into Scope.prototype.
	  The flow is simple. Once we define a mixin, it will be stored in the `$Mixer`,
	  and any time a `ChildScope` prototype is created
	  it will be extended by the `$Mixer`.
	  This concept is good because it keeps our code
	  clean and simple, and easy to extend.
	  So any time we would like to define a new behaviour to our scope,
	  we will just use the `$Mixer` service.
	 */
	.service(Mixer, function () {
	  var _this = this;

	  // Used to store method's caller
	  var caller = void 0;

	  this._mixins = [];
	  // Apply mixins automatically on specified contexts
	  this._autoExtend = [];
	  this._autoConstruct = [];

	  // Adds a new mixin
	  this.mixin = function (mixin) {
	    if (!_underscore2.default.isObject(mixin)) {
	      throw Error('argument 1 must be an object');
	    }

	    _this._mixins = _underscore2.default.union(_this._mixins, [mixin]);
	    // Apply mixins to stored contexts
	    _this._autoExtend.forEach(function (context) {
	      return _this._extend(context);
	    });
	    _this._autoConstruct.forEach(function (context) {
	      return _this._construct(context);
	    });
	    return _this;
	  };

	  // Removes a mixin. Useful mainly for test purposes
	  this._mixout = function (mixin) {
	    _this._mixins = _underscore2.default.without(_this._mixins, mixin);
	    return _this;
	  };

	  // Invoke function mixins with the provided context and arguments
	  this._construct = function (context) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    _this._mixins.filter(_underscore2.default.isFunction).forEach(function (mixin) {
	      mixin.call.apply(mixin, [context].concat(args));
	    });

	    return context;
	  };

	  // Extend prototype with the defined mixins
	  this._extend = function (obj, options) {
	    var _$defaults = _underscore2.default.defaults({}, options, {
	      pattern: /.*/ }),
	        pattern = _$defaults.pattern,
	        context = _$defaults.context;

	    var mixins = _this._mixins.map(function (mixin) {
	      // Filtering the keys by the specified pattern
	      var keys = _underscore2.default.keys(mixin).filter(function (k) {
	        return k.match(pattern);
	      }).filter(function (k) {
	        return _underscore2.default.isFunction(mixin[k]);
	      });

	      return keys.reduce(function (boundMixin, methodName) {
	        var methodHandler = mixin[methodName];

	        // Note that this is not an arrow function so we can conserve the conetxt
	        boundMixin[methodName] = function () {
	          // Storing original caller so we will know who actually called the
	          // method event though it is bound to another context
	          var methodContext = context || this;
	          var recentCaller = caller;
	          caller = this;

	          try {
	            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	              args[_key2] = arguments[_key2];
	            }

	            return methodHandler.apply(methodContext, args);
	          } finally {
	            // No matter what happens, restore variable to the previous one
	            caller = recentCaller;
	          }
	        };

	        return boundMixin;
	      }, {});
	    });

	    return _underscore2.default.extend.apply(_underscore2.default, [obj].concat(_toConsumableArray(mixins)));
	  };

	  // Caller property can not be set
	  Object.defineProperty(this, 'caller', {
	    configurable: true,
	    enumerable: true,

	    get: function get() {
	      return caller;
	    }
	  });
	});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.name = undefined;

	var _mixer = __webpack_require__(17);

	var name = exports.name = 'angular-meteor.scope';

	angular.module(name, [_mixer.name]).run(['$rootScope', _mixer.Mixer, function ($rootScope, $Mixer) {
	  var Scope = $rootScope.constructor;
	  var $new = $rootScope.$new;

	  // Apply extensions whether a mixin in defined.
	  // Note that this way mixins which are initialized later
	  // can be applied on rootScope.
	  $Mixer._autoExtend.push(Scope.prototype);
	  $Mixer._autoConstruct.push($rootScope);

	  Scope.prototype.$new = function () {
	    var scope = $new.apply(this, arguments);
	    // Apply constructors to newly created scopes
	    return $Mixer._construct(scope);
	  };
	}]);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Core = exports.name = undefined;

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _utils = __webpack_require__(16);

	var _mixer = __webpack_require__(17);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var name = exports.name = 'angular-meteor.core';
	var Core = exports.Core = '$$Core';

	angular.module(name, [_utils.name, _mixer.name])

	/*
	  A mixin which provides us with core Meteor functions.
	 */
	.factory(Core, ['$q', _utils.utils, _mixer.Mixer, function ($q, $$utils, $Mixer) {
	  function $$Core() {}

	  // Calls Meteor.autorun() which will be digested after each run and automatically destroyed
	  $$Core.autorun = function (fn) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    fn = this.$bindToContext($Mixer.caller, fn);

	    if (!_underscore2.default.isFunction(fn)) {
	      throw Error('argument 1 must be a function');
	    }
	    if (!_underscore2.default.isObject(options)) {
	      throw Error('argument 2 must be an object');
	    }

	    var computation = Tracker.autorun(fn, options);
	    // Reset to a function that will also stop the listener we just added
	    computation.stop = this.$$autoStop(computation);
	    return computation;
	  };

	  // Calls Meteor.subscribe() which will be digested after each invokation
	  // and automatically destroyed
	  $$Core.subscribe = function (subName, fn, cb) {
	    fn = this.$bindToContext($Mixer.caller, fn || angular.noop);
	    cb = cb ? this.$bindToContext($Mixer.caller, cb) : angular.noop;

	    // Additional callbacks specific for this library
	    // onStart - right after Meteor.subscribe()
	    var hooks = {
	      onStart: angular.noop
	    };

	    if (!_underscore2.default.isString(subName)) {
	      throw Error('argument 1 must be a string');
	    }
	    if (!_underscore2.default.isFunction(fn)) {
	      throw Error('argument 2 must be a function');
	    }
	    if (!_underscore2.default.isFunction(cb) && !_underscore2.default.isObject(cb)) {
	      throw Error('argument 3 must be a function or an object');
	    }

	    if (_underscore2.default.isObject(cb)) {
	      for (var hook in hooks) {
	        if (hooks.hasOwnProperty(hook) && cb[hook]) {
	          // Don't use any of additional callbacks in Meteor.subscribe
	          hooks[hook] = cb[hook];
	          delete cb[hook];
	        }
	      }
	    }

	    var result = {};

	    var computation = this.autorun(function () {
	      var _Meteor;

	      var args = fn();
	      if (angular.isUndefined(args)) args = [];

	      if (!_underscore2.default.isArray(args)) {
	        throw Error('reactive function\'s return value must be an array');
	      }

	      var subscription = (_Meteor = Meteor).subscribe.apply(_Meteor, [subName].concat(_toConsumableArray(args), [cb]));

	      hooks.onStart();

	      result.ready = subscription.ready.bind(subscription);
	      result.subscriptionId = subscription.subscriptionId;
	    });

	    // Once the computation has been stopped,
	    // any subscriptions made inside will be stopped as well
	    result.stop = computation.stop.bind(computation);
	    return result;
	  };

	  // Calls Meteor.call() wrapped by a digestion cycle
	  $$Core.callMethod = function () {
	    var _Meteor2;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var fn = args.pop();
	    if (_underscore2.default.isFunction(fn)) fn = this.$bindToContext($Mixer.caller, fn);
	    return (_Meteor2 = Meteor).call.apply(_Meteor2, args.concat([fn]));
	  };

	  // Calls Meteor.apply() wrapped by a digestion cycle
	  $$Core.applyMethod = function () {
	    var _Meteor3;

	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    var fn = args.pop();
	    if (_underscore2.default.isFunction(fn)) fn = this.$bindToContext($Mixer.caller, fn);
	    return (_Meteor3 = Meteor).apply.apply(_Meteor3, args.concat([fn]));
	  };

	  // Stops a process once the scope has been destroyed
	  $$Core.$$autoStop = function (stoppable) {
	    var removeListener = void 0;
	    var baseStop = stoppable.stop.bind(stoppable);

	    // Once the process has been stopped the destroy event listener will be removed
	    // to avoid memory leaks and unexpected behaviours
	    var stop = function stop() {
	      removeListener();
	      return baseStop.apply(undefined, arguments);
	    };

	    removeListener = this.$on('$destroy', stop);
	    return stop;
	  };

	  // Digests scope only if there is no phase at the moment
	  $$Core.$$throttledDigest = function () {
	    var _this = this;

	    var isDigestable = !this.$$destroyed && !this.$$phase && !this.$root.$$phase;

	    if (isDigestable) {
	      // If a digest cycle in one autorun triggers another autorun,
	      // we want to run this second autorun in a non-reactive manner.
	      // thus preventing inner autoruns from being dependent on their parents.
	      Tracker.nonreactive(function () {
	        return _this.$digest();
	      });
	    }
	  };

	  // Creates a promise only that the digestion cycle will be called at its fulfillment
	  $$Core.$$defer = function () {
	    var deferred = $q.defer();
	    // Once promise has been fulfilled, digest
	    deferred.promise = deferred.promise.finally(this.$$throttledDigest.bind(this));
	    return deferred;
	  };

	  // Binds an object or a function to the provided context and digest it once it is invoked
	  $$Core.$bindToContext = function (context, fn) {
	    if (_underscore2.default.isFunction(context)) {
	      fn = context;
	      context = this;
	    }

	    return $$utils.bind(fn, context, this.$$throttledDigest.bind(this));
	  };

	  return $$Core;
	}]);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.reactive = exports.ViewModel = exports.name = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _utils = __webpack_require__(16);

	var _mixer = __webpack_require__(17);

	var _core = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var name = exports.name = 'angular-meteor.view-model';
	var ViewModel = exports.ViewModel = '$$ViewModel';
	var reactive = exports.reactive = '$reactive';

	angular.module(name, [_utils.name, _mixer.name, _core.name])

	/*
	  A mixin which lets us bind a view model into a scope.
	  Note that only a single view model can be bound,
	  otherwise the scope might behave unexpectedly.
	  Mainly used to define the controller as the view model,
	  and very useful when wanting to use Angular's `controllerAs` syntax.
	 */
	.factory(ViewModel, [_utils.utils, _mixer.Mixer, function ($$utils, $Mixer) {
	  function $$ViewModel() {}

	  // Gets an object, wraps it with scope functions and returns it
	  $$ViewModel.viewModel = function (vm) {
	    if (!_underscore2.default.isObject(vm)) {
	      throw Error('argument 1 must be an object');
	    }

	    // Extend view model with mixin functions
	    $Mixer._extend(vm, {
	      pattern: /^(?!\$\$).*$/, // Omitting methods which start with a $$ notation
	      context: this // Binding methods to scope
	    });

	    // Apply mixin constructors on scope with view model
	    $Mixer._construct(this, vm);
	    return vm;
	  };

	  return $$ViewModel;
	}])

	/*
	  Illustrates the old API where a view model is created using $reactive service
	 */
	.service(reactive, [_utils.utils, function ($$utils) {
	  var Reactive = function () {
	    function Reactive(vm) {
	      var _this = this;

	      _classCallCheck(this, Reactive);

	      if (!_underscore2.default.isObject(vm)) {
	        throw Error('argument 1 must be an object');
	      }

	      _underscore2.default.defer(function () {
	        if (!_this._attached) {
	          console.warn('view model was not attached to any scope');
	        }
	      });

	      this._vm = vm;
	    }

	    _createClass(Reactive, [{
	      key: 'attach',
	      value: function attach(scope) {
	        this._attached = true;

	        if (!$$utils.isScope(scope)) {
	          throw Error('argument 1 must be a scope');
	        }

	        var viewModel = scope.viewModel(this._vm);

	        // Similar to the old/Meteor API
	        viewModel.call = viewModel.callMethod;
	        viewModel.apply = viewModel.applyMethod;

	        return viewModel;
	      }
	    }]);

	    return Reactive;
	  }();

	  return function (vm) {
	    return new Reactive(vm);
	  };
	}]);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Reactive = exports.name = undefined;

	var _jsondiffpatch = __webpack_require__(22);

	var _jsondiffpatch2 = _interopRequireDefault(_jsondiffpatch);

	var _underscore = __webpack_require__(2);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _utils = __webpack_require__(16);

	var _mixer = __webpack_require__(17);

	var _core = __webpack_require__(19);

	var _viewModel = __webpack_require__(20);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var name = exports.name = 'angular-meteor.reactive';
	var Reactive = exports.Reactive = '$$Reactive';

	angular.module(name, [_utils.name, _mixer.name, _core.name, _viewModel.name])

	/*
	  A mixin which enhance our reactive abilities by providing methods
	  that are capable of updating our scope reactively.
	 */
	.factory(Reactive, ['$parse', _utils.utils, _mixer.Mixer, function ($parse, $$utils, $Mixer) {
	  function $$Reactive() {
	    var vm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

	    // Helps us track changes made in the view model
	    vm.$$dependencies = {};
	  }

	  // Gets an object containing functions and define their results as reactive properties.
	  // Once a return value has been changed the property will be reset.
	  $$Reactive.helpers = function (vm, props) {
	    var _this = this;

	    if ($$utils.isViewModel(vm)) {
	      if (!_underscore2.default.isObject(props)) {
	        throw Error('argument 2 must be an object');
	      }
	    } else {
	      props = vm;
	      vm = $Mixer.caller;

	      if (!_underscore2.default.isObject(props)) {
	        throw Error('argument 1 must be an object');
	      }
	    }

	    _underscore2.default.each(props, function (v, k) {
	      if (!_underscore2.default.isFunction(v)) {
	        throw Error('helper \'' + k + '\' must be a function');
	      }
	    });

	    _underscore2.default.each(props, function (v, k) {
	      if (!vm.$$dependencies[k]) {
	        // Registers a new dependency to the specified helper
	        vm.$$dependencies[k] = new Tracker.Dependency();
	      }

	      _this.$$setFnHelper(vm, k, v);
	    });
	  };

	  // Gets a model reactively
	  $$Reactive.getReactively = function (vm, k, isDeep) {
	    if ($$utils.isViewModel(vm)) {
	      if (angular.isUndefined(isDeep)) isDeep = false;

	      if (!_underscore2.default.isString(k)) {
	        throw Error('argument 2 must be a string');
	      }
	      if (!_underscore2.default.isBoolean(isDeep)) {
	        throw Error('argument 3 must be a boolean');
	      }
	    } else {
	      isDeep = angular.isDefined(k) ? k : false;
	      k = vm;
	      vm = $Mixer.caller;

	      if (!_underscore2.default.isString(k)) {
	        throw Error('argument 1 must be a string');
	      }
	      if (!_underscore2.default.isBoolean(isDeep)) {
	        throw Error('argument 2 must be a boolean');
	      }
	    }

	    return this.$$reactivateEntity(vm, k, this.$watch, isDeep);
	  };

	  // Gets a collection reactively
	  $$Reactive.getCollectionReactively = function (vm, k) {
	    if ($$utils.isViewModel(vm)) {
	      if (!_underscore2.default.isString(k)) {
	        throw Error('argument 2 must be a string');
	      }
	    } else {
	      k = vm;
	      vm = $Mixer.caller;

	      if (!_underscore2.default.isString(k)) {
	        throw Error('argument 1 must be a string');
	      }
	    }

	    return this.$$reactivateEntity(vm, k, this.$watchCollection);
	  };

	  // Gets an entity reactively, and once it has been changed the computation will be recomputed
	  $$Reactive.$$reactivateEntity = function (vm, k, watcher) {
	    if (!vm.$$dependencies[k]) {
	      vm.$$dependencies[k] = new Tracker.Dependency();

	      for (var _len = arguments.length, watcherArgs = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
	        watcherArgs[_key - 3] = arguments[_key];
	      }

	      this.$$watchEntity.apply(this, [vm, k, watcher].concat(watcherArgs));
	    }

	    vm.$$dependencies[k].depend();
	    return $parse(k)(vm);
	  };

	  // Watches for changes in the view model, and if so will notify a change
	  $$Reactive.$$watchEntity = function (vm, k, watcher) {
	    var _this2 = this;

	    // Gets a deep property from the caller
	    var getVal = _underscore2.default.partial($parse(k), vm);
	    var initialVal = getVal();

	    // Watches for changes in the view model

	    for (var _len2 = arguments.length, watcherArgs = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
	      watcherArgs[_key2 - 3] = arguments[_key2];
	    }

	    watcher.call.apply(watcher, [this, getVal, function (val, oldVal) {
	      var hasChanged = val !== initialVal || val !== oldVal;

	      // Notify if a change has been detected
	      if (hasChanged) _this2.$$changed(vm, k);
	    }].concat(watcherArgs));
	  };

	  // Invokes a function and sets the return value as a property
	  $$Reactive.$$setFnHelper = function (vm, k, fn) {
	    var _this3 = this;

	    var activeObservation = null;
	    var lastModel = null;
	    var lastModelData = [];

	    this.autorun(function () /* computation */{
	      // Invokes the reactive functon
	      var model = fn.apply(vm);

	      // Ignore notifications made by the following handler
	      Tracker.nonreactive(function () {
	        // If a cursor, observe its changes and update acoordingly
	        if ($$utils.isCursor(model)) {
	          var modelData = void 0;

	          if (angular.isUndefined(vm[k])) {
	            _this3.$$setValHelper(vm, k, [], false);
	          }

	          if (activeObservation) {
	            lastModelData = lastModel.fetch();
	            activeObservation.stop();
	            activeObservation = null;
	          }

	          var handle = _this3.$$handleCursor(vm, k, model);

	          activeObservation = handle.observation;
	          modelData = handle.data;

	          if (lastModelData.length !== 0) {
	            var diff = _jsondiffpatch2.default.diff(lastModelData, modelData);
	            vm[k] = _jsondiffpatch2.default.patch(lastModelData, diff);
	          } else {
	            vm[k] = modelData;
	          }

	          lastModel = model;
	          lastModelData = modelData;

	          /* computation.onInvalidate(() => {
	            activeObservation.stop();
	          });*/
	        } else {
	          _this3.$$handleNonCursor(vm, k, model);
	        }

	        // Notify change and update the view model
	        _this3.$$changed(vm, k);
	      });
	    });
	  };

	  // Sets a value helper as a setter and a getter which will notify computations once used
	  $$Reactive.$$setValHelper = function (vm, k, v) {
	    var _this4 = this;

	    var watch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

	    // If set, reactives property
	    if (watch) {
	      var isDeep = _underscore2.default.isObject(v);
	      this.getReactively(vm, k, isDeep);
	    }

	    Object.defineProperty(vm, k, {
	      configurable: true,
	      enumerable: true,

	      get: function get() {
	        return v;
	      },
	      set: function set(newVal) {
	        v = newVal;
	        _this4.$$changed(vm, k);
	      }
	    });
	  };

	  // Fetching a cursor and updates properties once the result set has been changed
	  $$Reactive.$$handleCursor = function (vm, k, cursor) {
	    var _this5 = this;

	    var data = [];
	    // Observe changes made in the result set
	    var observation = cursor.observe({
	      addedAt: function addedAt(doc, atIndex) {
	        if (!observation) {
	          data.push(doc);
	          return;
	        }
	        vm[k].splice(atIndex, 0, doc);
	        _this5.$$changed(vm, k);
	      },
	      changedAt: function changedAt(doc, oldDoc, atIndex) {
	        var diff = _jsondiffpatch2.default.diff(vm[k][atIndex], doc);
	        _jsondiffpatch2.default.patch(vm[k][atIndex], diff);
	        _this5.$$changed(vm, k);
	      },
	      movedTo: function movedTo(doc, fromIndex, toIndex) {
	        vm[k].splice(fromIndex, 1);
	        vm[k].splice(toIndex, 0, doc);
	        _this5.$$changed(vm, k);
	      },
	      removedAt: function removedAt(oldDoc, atIndex) {
	        vm[k].splice(atIndex, 1);
	        _this5.$$changed(vm, k);
	      }
	    });

	    return {
	      observation: observation,
	      data: data
	    };
	  };

	  $$Reactive.$$handleNonCursor = function (vm, k, data) {
	    var v = vm[k];

	    if (angular.isDefined(v)) {
	      delete vm[k];
	      v = null;
	    }

	    if (angular.isUndefined(v)) {
	      this.$$setValHelper(vm, k, data);
	    }
	    // Update property if the new value is from the same type
	    else if ($$utils.areSiblings(v, data)) {
	        var diff = _jsondiffpatch2.default.diff(v, data);
	        _jsondiffpatch2.default.patch(v, diff);
	        this.$$changed(vm, k);
	      } else {
	        vm[k] = data;
	      }
	  };

	  // Notifies dependency in view model
	  $$Reactive.$$depend = function (vm, k) {
	    vm.$$dependencies[k].depend();
	  };

	  // Notifies change in view model
	  $$Reactive.$$changed = function (vm, k) {
	    this.$$throttledDigest();
	    vm.$$dependencies[k].changed();
	  };

	  return $$Reactive;
	}]);

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var name = exports.name = 'angular-templates';

	try {
	  angular.module(name);
	} catch (e) {
	  angular.module(name, []);
	}

/***/ })
/******/ ])
});
;