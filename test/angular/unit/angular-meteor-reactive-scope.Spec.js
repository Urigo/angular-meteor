'use strict';

var Tracker;

describe('Given the Reactive Scope Module', function() {

  var $rootScope, $scope, changedSpy, dependSpy;

  beforeEach(function() {

    changedSpy = jasmine.createSpy('changed');
    dependSpy = jasmine.createSpy('depend');

    var D = function() {};
    D.prototype = {
      changed: changedSpy,
      depend: dependSpy
    };

    Tracker = {
      Dependency: D
    };

    module('angular-meteor.reactive-scope');

    inject(function(_$rootScope_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
    });

  });

  it('should attach getReactively to $rootScope', function() {
      expect(typeof $rootScope.getReactively).toBe('function');
  });

  it('should invoke Tracker.depend() when you set a property', function() {

    $rootScope.myReactiveProp = 'Hello!';
    $rootScope.getReactively('myReactiveProp');
    expect(dependSpy).toHaveBeenCalled();
  });

  it('should invoke Tracker.changed() when you change the property value', function() {
    $rootScope.myReactiveProp = 'Red Light';
    $rootScope.getReactively('myReactiveProp');
    $rootScope.myReactiveProp = 'Green Light';
    $rootScope.$apply();
    expect(changedSpy).toHaveBeenCalled();
  });


});
