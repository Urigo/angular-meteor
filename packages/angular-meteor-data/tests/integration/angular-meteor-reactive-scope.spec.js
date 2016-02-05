var testedModule = 'angular-meteor.reactive-scope';

describe('angular-meteor', function () {
  describe(testedModule, function () {
    beforeEach(angular.mock.module(testedModule));

    var $$ReactiveContext;
    var $compile;
    var $rootScope;

    beforeEach(angular.mock.module(testedModule, function($provide) {
      $provide.factory('$$ReactiveContext', function() {
        function $$ReactiveContext() {}
        $$ReactiveContext.prototype.helpers = jasmine.createSpy('helpers');
        return $$ReactiveContext;
      });
    }));

    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_, _$$ReactiveContext_) {
      $$ReactiveContext = _$$ReactiveContext_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should extend any child scope that created from the $rootScope with the relevant API', function () {
      var $scope = $rootScope.$new();
      expect(typeof $rootScope.helpers).toBe('function');
      expect(typeof $rootScope.autorun).toBe('function');
      expect(typeof $rootScope.subscribe).toBe('function');
      expect(typeof $rootScope.getReactively).toBe('function');
      expect(typeof $rootScope.getCollectionReactively).toBe('function');
    });

    describe('$$ReactiveScope', function() {
      var $scope;

      beforeEach(function() {
        $scope = $rootScope.$new();
      });

      describe('helpers()', function() {
        it('should call $$ReactiveContext.helpers()', function() {
          $scope.helpers({
            test: function() {
              return 10;
            }
          });

          expect($$ReactiveContext.prototype.helpers).toHaveBeenCalled();
        });
      });

      describe('autorun()', function() {
        it('should call Meteor.autorun()', function() {
          var meteorAutorunSpy = spyOn(Meteor, 'autorun').and.returnValue({stop: angular.noop});
          $scope.autorun(function() {});
          expect(meteorAutorunSpy).toHaveBeenCalled();
        });

        it('should register destroyment once when adding an autorun', function() {
          var scopeDestroySpy = spyOn($scope, '$on');
          $scope.autorun(angular.noop);
          expect(scopeDestroySpy).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
        });

        it('should call stop method of autorun when destroying the scope', function() {
          var stoppableSpy = jasmine.createSpy('stop');
          spyOn(Meteor, 'autorun').and.returnValue({stop: stoppableSpy});

          $scope.autorun(function() { });
          $scope.$destroy();

          expect(stoppableSpy).toHaveBeenCalled();
        });

        it('should register a handler for scope destroy when using _autoStop', function() {
          var stoppableSpy = jasmine.createSpy('stop');
          var scopeDestroySpy = spyOn($scope, '$on');

          $scope._autoStop({stop: stoppableSpy});
          expect(scopeDestroySpy).toHaveBeenCalled();
        });

        it('should call autorun function using $scope as thisArg', function() {
          $scope.autorun(function() {
            expect(this).toEqual($scope);
          });
        });

        it('should call digestion at the end of autorun function', function() {
          $scope.$digest = jasmine.createSpy('digest');
          $scope.autorun(angular.noop);
          expect($scope.$digest).toHaveBeenCalled();
        });
      });

      describe('subscribe()', function() {
        describe('result convertion', function() {
          it('no params', function() {
            var mockedResult = {
              ready : jasmine.createSpy('ready'),
              stop : jasmine.createSpy('stop'),
              subscriptionId : '123'
            };

            var meteorSubscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);
            $scope.subscribe('test', function() { return []; });
            expect(meteorSubscribeSpy).toHaveBeenCalledWith('test', jasmine.any(Function));
          });

          it('no return value', function() {
            var mockedResult = {
              ready : jasmine.createSpy('ready'),
              stop : jasmine.createSpy('stop'),
              subscriptionId : '123'
            };

            var meteorSubscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);
            $scope.subscribe('test', function() {  });
            expect(meteorSubscribeSpy).toHaveBeenCalledWith('test', jasmine.any(Function));
          });

          it('one param', function() {
            var mockedResult = {
              ready : jasmine.createSpy('ready'),
              stop : jasmine.createSpy('stop'),
              subscriptionId : '123'
            };

            var meteorSubscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);
            $scope.subscribe('test', function() { return ['a']; });
            expect(meteorSubscribeSpy).toHaveBeenCalledWith('test', 'a', jasmine.any(Function));
          });

          it('more than one param', function() {
            var mockedResult = {
              ready : jasmine.createSpy('ready'),
              stop : jasmine.createSpy('stop'),
              subscriptionId : '123'
            };
            var meteorSubscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);
            $scope.subscribe('test', function() { return ['a', 'b', 10, 100]; });
            expect(meteorSubscribeSpy).toHaveBeenCalledWith('test', 'a', 'b', 10, 100, jasmine.any(Function));
          });
        });

        it('should call Meteor.subscribe()', function() {
          var mockedResult = {
            ready : jasmine.createSpy('ready'),
            stop : jasmine.createSpy('stop'),
            subscriptionId : '123'
          };

          var meteorSubscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);
          $scope.subscribe('', function() { return []; });
          expect(meteorSubscribeSpy).toHaveBeenCalled();
        });

        it('should stop subscription when calling stop on the returned value', function() {
          var mockedResult = {
            ready : jasmine.createSpy('ready'),
            stop : jasmine.createSpy('stop'),
            subscriptionId : '123'
          };

          spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);

          spyOn(Meteor, 'autorun').and.callFake(function(cb) {
            cb();

            return {
              stop : function() { mockedResult.stop(); }
            };
          });

          var result = $scope.subscribe('', function(){ return []; });
          result.stop();
          result.ready();

          expect(mockedResult.stop).toHaveBeenCalled();
          expect(result.subscriptionId).toEqual(mockedResult.subscriptionId);
          expect(mockedResult.ready).toHaveBeenCalled();
        });

        it('should wrap the subscription with autorun context', function() {
          var mockedResult = {
            ready : jasmine.createSpy('ready'),
            stop : jasmine.createSpy('stop'),
            subscriptionId : '123'
          };

          var meteorSubscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);
          var meteorAutorunSpy = spyOn(Meteor, 'autorun').and.callThrough();

          $scope.subscribe('test', function() { return []; });
          Tracker.flush();

          expect(meteorAutorunSpy).toHaveBeenCalled();
          expect(meteorSubscribeSpy).toHaveBeenCalled();
        });

        it('should register destroyment twice when adding a subscription', function() {
          var scopeDestroySpy = spyOn($scope, '$on');
          $scope.subscribe('test', function() { return []; });
          expect(scopeDestroySpy).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
          expect(scopeDestroySpy.calls.count()).toBe(2);
        });

        it('should subscribe without subscribe function', function () {
          var mockedResult = {
            ready : jasmine.createSpy('ready'),
            stop : jasmine.createSpy('stop'),
            subscriptionId : '123'
          };

          var meteorSubscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue(mockedResult);
          $scope.subscribe('test');
          expect(meteorSubscribeSpy).toHaveBeenCalledWith('test', jasmine.any(Function));
        });

        it('should call subscription arguments function using context as thisArg', function (done) {
          $scope.subscribe('test', function () {
            expect(this).toEqual($scope);
            done();
          });
        });

        it('should call subscription callback function using context as thisArg', function(done) {
          spyOn(Meteor, 'subscribe').and.callFake(function(name, cb) {
            cb();
          });

          $scope.subscribe('test', angular.noop, function() {
            expect(this).toEqual($scope);
            done();
          });
        });

        it('should call subscription callbacks object using context as thisArg', function(done) {
          var next = _.after(2, done);

          spyOn(Meteor, 'subscribe').and.callFake(function(name, cb) {
            cb.onStop();
            cb.onReady();
          });

          $scope.subscribe('test', angular.noop, {
            onStop: function() {
              expect(this).toEqual($scope);
              next();
            },

            onReady: function() {
              expect(this).toEqual($scope);
              next();
            }
          });
        });

        it('should call digestion loop after subscription arguments function', function(done) {
          $scope.$digest = jasmine.createSpy('digest');

          $scope.subscribe('test', function() {
            $scope.$digest = done;
            return [];
          });
        });

        it('should call digestion loop after subscribtion callback', function(done) {
          spyOn(Meteor, 'subscribe').and.callFake(function(name, cb) {
            cb();
          });

          $scope.subscribe('test', angular.noop, function() {
            $scope.$digest = done;
          });
        });
      });

      describe('$getReactivley()', function() {
        it ('should return model', function() {
          $scope.myProp = 10;
          expect($scope.getReactively('myProp')).toBe(10);
        });

        it ('should register a scope watcher', function() {
          $scope.myProp = 'myProp';
          var watchSpy = spyOn($scope, '$watch');

          $scope.getReactively('myProp');
          expect(watchSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), false);

          var args = watchSpy.calls.argsFor(0);
          expect(args[0]()).toEqual('myProp');
        });

        it ('should register a scope watch with custom equality (deep)', function() {
          $scope.myProp = 'myProp';
          var watchSpy = spyOn($scope, '$watch');

          $scope.getReactively('myProp', true);
          expect(watchSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), true);

          var args = watchSpy.calls.argsFor(0);
          expect(args[0]()).toEqual('myProp');
        });

        it ('should register a scope watch with custom equality (shallow)', function() {
          $scope.myProp = 'myProp';
          var watchSpy = spyOn($scope, '$watch');

          $scope.getReactively('myProp', false);
          expect(watchSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), false);

          var args = watchSpy.calls.argsFor(0);
          expect(args[0]()).toEqual('myProp');
        });

        it ('should register a scope watch with custom watcher (collection)', function() {
          $scope.myProp = 'myProp';
          var watchSpy = spyOn($scope, '$watchCollection');

          $scope.getCollectionReactively('myProp', false);
          expect(watchSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));

          var args = watchSpy.calls.argsFor(0);
          expect(args[0]()).toEqual('myProp');
        });

        it('should register a custom context watch', function() {
          var context = {};
          context.myProp = 'myProp';
          var watchSpy = spyOn($scope, '$watch');

          $scope.getReactively(context, 'myProp');
          expect(watchSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), false);

          var args = watchSpy.calls.argsFor(0);
          expect(args[0]()).toEqual('myProp');
        });

        it ('should register a tracker dependency', function() {
          $scope.myProp = 10;

          $scope.getReactively('myProp');
          expect($scope._dependencies).toBeDefined();
          expect($scope._dependencies.myProp).toBeDefined();
        });

        it('should register a tracker dependency on a custom context', function() {
          var context = {};
          context.myProp = 10;

          $scope.getReactively(context, 'myProp');
          expect(context._dependencies).toBeDefined();
          expect(context._dependencies.myProp).toBeDefined();
        });

        it ('should create a dependency object for the reactive property', function() {
          $scope.myProp = 10;

          var depCtorSpy = spyOn(Tracker, 'Dependency').and.callFake(function() {
            return {
              depend: angular.noop,
              changed: angular.noop
            };
          });

          $scope.getReactively('myProp');
          expect(depCtorSpy).toHaveBeenCalled();
          expect(depCtorSpy.calls.count()).toBe(1);
        });

        it ('should trigger the dependency logic when the watch callback is called', function() {
          $scope.myProp = 10;
          var changedSpy = jasmine.createSpy('changed');

          spyOn(Tracker, 'Dependency').and.callFake(function() {
            return {
              depend: angular.noop,
              changed: changedSpy
            };
          });

          $scope.getReactively('myProp');
          $scope.$apply();

          $scope.myProp = 20;
          $scope.$apply();

          expect(changedSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
