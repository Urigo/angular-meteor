'use strict';

var Meteor, Tracker;

describe('Given the User Service', function() {


  beforeEach(function () {

    Tracker = {
      autorun: function (fn) {
        fn({firstRun: true})
      }
    }
  });


  describe('when Meteor.user is set', function() {

    var $rootScope;

    beforeEach(function() {

      Meteor = {
        user: function() {
          return 'user';
        },

        loggingIn: function()
        {
          return 'loggingIn';
        }
      };

      module('angular-meteor.user');

      // Injecting Services to use
      inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
      });

    });


    it('should assign currentUser and loggingIn the $rootScope', function() {

      expect($rootScope.currentUser).toEqual('user');
      expect($rootScope.loggingIn).toEqual('loggingIn');

    });

  });

  describe('when Meteor.user is not set', function() {

    var $rootScope;

    beforeEach(function() {

      Meteor = {
        user: false
      };

      module('angular-meteor.user');

      // Injecting Services to use
      inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
      });

    });


    it('should not assign currentUser and loggingIn the $rootScope', function() {

      expect($rootScope.currentUser).toEqual(undefined);
      expect($rootScope.loggingIn).toEqual(undefined);

    });


  });

});
