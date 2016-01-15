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
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Accounts = Package['accounts-base'].Accounts;
var AccountsClient = Package['accounts-base'].AccountsClient;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var babelHelpers = Package['babel-runtime'].babelHelpers;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var Promise = Package.promise.Promise;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/angular-meteor-auth/angular-meteor-auth.js                                                  //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
angular.module('angular-meteor.auth', ['angular-meteor']);                                              // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/angular-meteor-auth/modules/auth.js                                                         //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
angular.module('angular-meteor.auth').service('$auth', ['$rootScope', '$q', function ($rootScope, $q) {
  var _this = this;                                                                                     //
                                                                                                        //
  if (!Package['accounts-base']) throw Error('Oops, looks like Accounts-base package is missing!' + 'Please add it by running: meteor add accounts-base');
                                                                                                        //
  this.waitForUser = function () {                                                                      // 15
    var deferred = $q.defer();                                                                          // 16
                                                                                                        //
    var promise = deferred.promise['finally'](function () {                                             // 18
      $rootScope._throttledDigest();                                                                    // 19
    });                                                                                                 //
                                                                                                        //
    var c = Meteor.autorun(function (c) {                                                               // 22
      if (Meteor.loggingIn()) return;                                                                   // 23
                                                                                                        //
      c.stop();                                                                                         // 25
      deferred.resolve(Meteor.user());                                                                  // 26
      $rootScope._throttledDigest();                                                                    // 27
    });                                                                                                 //
                                                                                                        //
    promise.stop = c.stop.bind(c);                                                                      // 30
    return promise;                                                                                     // 31
  };                                                                                                    //
                                                                                                        //
  this.requireUser = function (c) {                                                                     // 34
    var waiting = _this.waitForUser();                                                                  // 35
                                                                                                        //
    var promise = waiting.then(function (currentUser) {                                                 // 37
      if (currentUser) return $q.resolve(currentUser);                                                  // 38
                                                                                                        //
      return $q.reject('AUTH_REQUIRED');                                                                // 41
    });                                                                                                 //
                                                                                                        //
    promise.stop = waiting.stop;                                                                        // 44
    return promise;                                                                                     // 45
  };                                                                                                    //
                                                                                                        //
  this.requireValidUser = function () {                                                                 // 48
    var validate = arguments.length <= 0 || arguments[0] === undefined ? angular.noop : arguments[0];   //
                                                                                                        //
    if (!_.isFunction(validate)) throw Error('argument 1 must be a function');                          // 49
                                                                                                        //
    var requiring = _this.requireUser();                                                                // 52
                                                                                                        //
    var promise = requiring.then(function (user) {                                                      // 54
      if (user === 'AUTH_REQUIRED') return $q.reject(user);                                             // 55
                                                                                                        //
      var isValid = validate(user);                                                                     // 58
                                                                                                        //
      if (isValid === true) return $q.resolve(user);                                                    // 60
                                                                                                        //
      isValid = _.isString(isValid) ? isValid : "FORBIDDEN";                                            // 63
      return $q.reject(isValid);                                                                        // 64
    });                                                                                                 //
                                                                                                        //
    promise.stop = requiring.stop;                                                                      // 67
    return promise;                                                                                     // 68
  };                                                                                                    //
                                                                                                        //
  this.getUserInfo = function () {                                                                      // 71
    return {                                                                                            // 72
      currentUser: Meteor.user(),                                                                       // 73
      currentUserId: Meteor.userId(),                                                                   // 74
      loggingIn: Meteor.loggingIn()                                                                     // 75
    };                                                                                                  //
  };                                                                                                    //
}]).run(['$rootScope', '$auth', '$reactive', function ($rootScope, $auth, Reactive) {                   //
  Tracker.autorun(function () {                                                                         // 87
    var scopeProto = Object.getPrototypeOf($rootScope);                                                 // 88
    var userInfo = $auth.getUserInfo();                                                                 // 89
    _.extend(scopeProto, { $auth: userInfo });                                                          // 90
    _.extend(Reactive, { auth: userInfo });                                                             // 91
  });                                                                                                   //
}]);                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['angular-meteor-auth'] = {};

})();
