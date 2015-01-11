'use strict';


var Session, Tracker;

describe('Given the Meteor Session service', function() {

  describe('when calling bind()', function() {

    var $meteorSession, $scope;

    beforeEach(function(){

      var S = function S() {
        this.cache = {};
      };

      S.prototype = {
        get: function(key) {
          return this.cache[key] || false;
        },
        set: function(key, val) {
          this.cache[key] = val;
        }
      };

      Session = new S();

      Tracker = {
        autorun: function (fn) {
          fn({firstRun: false});
        }
      };

      module('angular-meteor.session');

      inject(function(_$meteorSession_, _$rootScope_) {

        $scope = _$rootScope_.$new();

        $meteorSession = _$meteorSession_;

      });


    });

    it('should bind the $scope with the session key', function() {

      Session.set('mySessionKey', 'LikeCoffeeBro?');

      $meteorSession('mySessionKey').bind($scope, 'mySessionKeyFromScope');

      expect($scope.mySessionKeyFromScope).toEqual('LikeCoffeeBro?');

      $scope.mySessionKeyFromScope = 'HeresCoffee';

      $scope.$apply();

      expect(Session.get('mySessionKey')).toEqual('HeresCoffee');

    });

  });

});
