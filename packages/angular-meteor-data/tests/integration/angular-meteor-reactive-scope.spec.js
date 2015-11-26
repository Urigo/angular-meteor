var testedModule = 'angular-meteor.reactive-scope';

describe('angular-meteor', function () {
  fdescribe(testedModule, function () {
    var $compile;
    var $rootScope;
    var testScope;

    var trackFuncSpy, helpersFuncSpy, autorunFuncSpy, subscribeFuncSpy, reactivePropertiesFuncSpy, attachFuncSpy, onPropertyChangedFuncSpy, stopFuncSpy;

    beforeEach(angular.mock.module(testedModule, function($provide) {
      $provide.factory('$reactive', function() {
        return function(context) {
          var fakedReactiveClass = function(context) {
            this.context = context;
          };

          helpersFuncSpy = fakedReactiveClass.prototype.helpers = jasmine.createSpy('helpers');
          attachFuncSpy = fakedReactiveClass.prototype.attach = jasmine.createSpy('attach');
          reactivePropertiesFuncSpy = fakedReactiveClass.prototype.reactiveProperties = jasmine.createSpy('reactiveProperties');
          onPropertyChangedFuncSpy = fakedReactiveClass.prototype.onPropertyChanged = jasmine.createSpy('onPropertyChanged');
          subscribeFuncSpy = fakedReactiveClass.prototype.subscribe = jasmine.createSpy('subscribe');
          autorunFuncSpy = fakedReactiveClass.prototype.autorun = jasmine.createSpy('autorun');
          stopFuncSpy = fakedReactiveClass.prototype.stop = jasmine.createSpy('stop');
          trackFuncSpy = fakedReactiveClass.prototype._track = jasmine.createSpy('_track');

          return new fakedReactiveClass(context);
        }
      })
    }));


    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      testScope = $rootScope.$new();
    }));

    it('Should extend any child scope that created from the $rootScope with the relevant API', function () {
      expect(typeof testScope.helpers).toBe('function');
      expect(typeof testScope.autorun).toBe('function');
      expect(typeof testScope.subscribe).toBe('function');
      expect(typeof testScope.getReactively).toBe('function');
      expect(typeof testScope.stopOnDestroy).toBe('function');
    });

    it('Should use the $reactive helpers function when using it', function() {
      testScope.helpers({
        test: function() {
          return 10;
        }
      });

      expect(helpersFuncSpy).toHaveBeenCalled();
    });

    it('Should use the Meteor autorun function when using it', function() {
      var meteorAutorunSpy = spyOn(Meteor, 'autorun');
      testScope.autorun(function() {});

      expect(meteorAutorunSpy).toHaveBeenCalled();
    });

    it('Should use the Meteor subscribe function when using it', function() {
      var meteorSubscribeSpy = spyOn(Meteor, 'subscribe');
      testScope.subscribe('', function() { return [] });

      expect(meteorSubscribeSpy).toHaveBeenCalled();
    });

    it('Should wrap the subscription with autorun context', function() {
      var meteorSubscribeSpy = spyOn(Meteor, 'subscribe');
      var meteorAutorunSpy = spyOn(Meteor, 'autorun').and.callThrough();

      testScope.subscribe('test', function() { return [] });
      Tracker.flush();

      expect(meteorAutorunSpy).toHaveBeenCalled();
      expect(meteorSubscribeSpy).toHaveBeenCalled();
    });

    it('Should register twice to destroy when adding a subscription', function() {
      var scopeDestroySpy = spyOn(testScope, '$on');

      testScope.subscribe('test', function() { return [] });

      expect(scopeDestroySpy).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
      expect(scopeDestroySpy.calls.count()).toBe(2);
    });

    it('Should register once to destroy when adding a autorun', function() {
      var scopeDestroySpy = spyOn(testScope, '$on');

      testScope.autorun(function() {  });

      expect(scopeDestroySpy).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
    });

    it('Should convert the subscription array to list of param - test with no params', function() {
      var meteorSubscribeSpy = spyOn(Meteor, 'subscribe');

      testScope.subscribe('test', function() { return [] });

      expect(meteorSubscribeSpy).toHaveBeenCalledWith('test');
    });

    it('Should convert the subscription array to list of param - test with no return value', function() {
      var meteorSubscribeSpy = spyOn(Meteor, 'subscribe');

      testScope.subscribe('test', function() {  });

      expect(meteorSubscribeSpy).toHaveBeenCalledWith('test');
    });

    it('Should convert the subscription array to list of param - test with one param', function() {
      var meteorSubscribeSpy = spyOn(Meteor, 'subscribe');

      testScope.subscribe('test', function() { return ['a'] });

      expect(meteorSubscribeSpy).toHaveBeenCalledWith('test', 'a');
    });

    it('Should convert the subscription array to list of param - test with more than one param', function() {
      var meteorSubscribeSpy = spyOn(Meteor, 'subscribe');

      testScope.subscribe('test', function() { return ['a', 'b', 10, 100] });

      expect(meteorSubscribeSpy).toHaveBeenCalledWith('test', 'a', 'b', 10, 100);
    });

    it('Should call stop method of autorun when destroying the scope', function() {
      var stoppableSpy = jasmine.createSpy('stop');
      spyOn(Meteor, 'autorun').and.returnValue({stop: stoppableSpy});

      testScope.autorun(function() { });
      testScope.$destroy();

      expect(stoppableSpy).toHaveBeenCalled();
    });

    it('Should use track function of $reactive when using getReactively', function() {
      testScope.getReactively('t');
      expect(trackFuncSpy).toHaveBeenCalled();
    });

    it('Should register a handler for scope destroy when using stopOnDestory', function() {
      var stoppableSpy = jasmine.createSpy('stop');
      var scopeDestroySpy = spyOn(testScope, '$on');

      testScope.stopOnDestroy({stop: stoppableSpy});

      expect(scopeDestroySpy).toHaveBeenCalled();
    });
  });
});
