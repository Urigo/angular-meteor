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

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/angular-meteor-auth/angular-meteor-auth.js                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
angular.module('angular-meteor.auth', ['angular-meteor']);                                   // 1
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/angular-meteor-auth/modules/auth.js                                              //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
angular.module('angular-meteor.auth').service('$auth', function ($q, $rootScope, $timeout) {
  var AngularMeteorAuthentication = (function () {                                           //
    function AngularMeteorAuthentication() {                                                 // 5
      babelHelpers.classCallCheck(this, AngularMeteorAuthentication);                        //
                                                                                             //
      this.accountsPackage = Package['accounts-base'];                                       // 6
                                                                                             //
      if (!this.accountsPackage) {                                                           // 8
        throw new Error('Oops, looks like Accounts-base package is missing! Please add it by running: meteor add accounts-base ');
      }                                                                                      //
    }                                                                                        //
                                                                                             //
    AngularMeteorAuthentication.prototype._autorun = (function () {                          // 4
      function _autorun(fn) {                                                                // 13
        var comp = Tracker.autorun(function (c) {                                            // 14
          fn(c);                                                                             // 15
          if (!c.firstRun) $timeout(angular.noop, 0);                                        // 16
        });                                                                                  //
                                                                                             //
        $rootScope.$on('$destroy', function () {                                             // 19
          comp.stop();                                                                       // 20
        });                                                                                  //
                                                                                             //
        return comp;                                                                         // 23
      }                                                                                      //
                                                                                             //
      return _autorun;                                                                       //
    })();                                                                                    //
                                                                                             //
    AngularMeteorAuthentication.prototype.waitForUser = (function () {                       // 4
      function waitForUser() {                                                               // 26
        var deferred = $q.defer();                                                           // 27
                                                                                             //
        this._autorun(function () {                                                          // 29
          if (!Meteor.loggingIn()) {                                                         // 30
            deferred.resolve(Meteor.user());                                                 // 31
          }                                                                                  //
        });                                                                                  //
                                                                                             //
        return deferred.promise;                                                             // 35
      }                                                                                      //
                                                                                             //
      return waitForUser;                                                                    //
    })();                                                                                    //
                                                                                             //
    AngularMeteorAuthentication.prototype.requireUser = (function () {                       // 4
      function requireUser() {                                                               // 38
        var deferred = $q.defer();                                                           // 39
                                                                                             //
        this._autorun(function () {                                                          // 41
          if (!Meteor.loggingIn()) {                                                         // 42
            if (Meteor.user() == null) {                                                     // 43
              deferred.reject("AUTH_REQUIRED");                                              // 44
            } else {                                                                         //
              deferred.resolve(Meteor.user());                                               // 47
            }                                                                                //
          }                                                                                  //
        });                                                                                  //
                                                                                             //
        return deferred.promise;                                                             // 52
      }                                                                                      //
                                                                                             //
      return requireUser;                                                                    //
    })();                                                                                    //
                                                                                             //
    AngularMeteorAuthentication.prototype.requireValidUser = (function () {                  // 4
      function requireValidUser(validatorFn) {                                               // 55
        validatorFn = validatorFn || angular.noop;                                           // 56
                                                                                             //
        return this.requireUser().then(function (user) {                                     // 58
          var valid = validatorFn(user);                                                     // 59
                                                                                             //
          if (valid === true) {                                                              // 61
            return user;                                                                     // 62
          } else if (angular.isString(valid)) {                                              //
            return $q.reject(valid);                                                         // 65
          } else {                                                                           //
            return $q.reject("FORBIDDEN");                                                   // 68
          }                                                                                  //
        });                                                                                  //
      }                                                                                      //
                                                                                             //
      return requireValidUser;                                                               //
    })();                                                                                    //
                                                                                             //
    return AngularMeteorAuthentication;                                                      //
  })();                                                                                      //
                                                                                             //
  var instance = new AngularMeteorAuthentication();                                          // 74
                                                                                             //
  angular.extend(this, Object.getPrototypeOf(instance));                                     // 76
}).run(function ($auth, $rootScope) {                                                        //
  $auth._autorun(function () {                                                               // 79
    if (!Meteor.user) return;                                                                // 80
                                                                                             //
    Object.getPrototypeOf($rootScope).$auth = {                                              // 82
      currentUser: Meteor.user(),                                                            // 83
      currentUserId: Meteor.userId(),                                                        // 84
      loggingIn: Meteor.loggingIn()                                                          // 85
    };                                                                                       //
  });                                                                                        //
});                                                                                          //
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['angular-meteor-auth'] = {};

})();
