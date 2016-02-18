describe('angular-meteor.core', function() {
  beforeEach(angular.mock.module('angular-meteor'));

  var $rootScope;

  beforeEach(angular.mock.inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  describe('$$Core', function() {
    it('should extend child scope', function() {
      var scope = $rootScope.$new();
      expect(scope.subscribe).toEqual(jasmine.any(Function));
      expect(scope.autorun).toEqual(jasmine.any(Function));
    });

    describe('autorun()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should call Tracker.autorun()', function() {
        var stoppable = { stop: jasmine.createSpy('stop') };
        spyOn(Tracker, 'autorun').and.returnValue(stoppable);

        scope.autorun(function() {});
        expect(Tracker.autorun).toHaveBeenCalled();
      });

      it('should autostop computation', function() {
        var stoppable = { stop: jasmine.createSpy('stop') };
        spyOn(Tracker, 'autorun').and.returnValue(stoppable);

        scope.autorun(angular.noop);
        scope.$destroy();

        expect(stoppable.stop).toHaveBeenCalled();
      });

      it('should stop computation manually', function() {
        var stoppable = { stop: jasmine.createSpy('stop') };
        spyOn(Tracker, 'autorun').and.returnValue(stoppable);

        var computation = scope.autorun(angular.noop);
        computation.stop();

        expect(stoppable.stop).toHaveBeenCalled();
      });

      it('should call autorun function using view model as context', function() {
        var vm = scope.viewModel({});

        vm.autorun(function() {
          expect(this).toEqual(vm);
        });
      });

      it('should digest once autorun function is invoked', function() {
        scope.$digest = jasmine.createSpy('digest');
        scope.autorun(angular.noop);
        expect(scope.$digest).toHaveBeenCalled();
      });
    });

    describe('subscribe()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should call Meteor.subscribe()', function() {
        var subscription = { ready: angular.noop  };
        var subscribe = spyOn(Meteor, 'subscribe').and.returnValue(subscription);
        scope.subscribe('test', function() { return []; });
        expect(subscribe).toHaveBeenCalled();
      });

      it('should autostop subscription', function() {
        var stoppable = { stop: jasmine.createSpy('stop') };
        spyOn(Tracker, 'autorun').and.returnValue(stoppable);

        scope.subscribe('test');
        scope.$destroy();

        expect(stoppable.stop).toHaveBeenCalled();
      });

      it('should stop subscription manually', function() {
        var stoppable = { stop: jasmine.createSpy('stop') };
        spyOn(Tracker, 'autorun').and.returnValue(stoppable);

        var subscription = scope.subscribe('test');
        subscription.stop();

        expect(stoppable.stop).toHaveBeenCalled();
      });

      it('should return subscription ready and subscriptionId properties', function(done) {
        var subscription = { ready: done, subscriptionId: 'my-subscription' };
        spyOn(Meteor, 'subscribe').and.returnValue(subscription);
        subscription = scope.subscribe('test');

        expect(subscription.subscriptionId).toEqual('my-subscription');
        subscription.ready();
      });

      it('should recompute subscription if parameters have been changed', function(done) {
        var next = _.after(2, done);
        var dependency = new Tracker.Dependency();

        scope.subscribe('test', function() {
          next();
          dependency.depend();
          return [];
        });

        Tracker.flush();
        dependency.changed();
      });

      it('should accept subscriptions calls with no function specified', function () {
        var subscription = { ready: angular.noop };
        var subscribe = spyOn(Meteor, 'subscribe').and.returnValue(subscription);

        scope.subscribe('test');
        expect(subscribe).toHaveBeenCalledWith('test', jasmine.any(Function));
      });

      it('should call subscription function using view model as context', function (done) {
        var vm = scope.viewModel({});

        vm.subscribe('test', function () {
          expect(this).toEqual(vm);
          done();
        });
      });

      it('should call subscription callback using view model as context', function(done) {
        var vm = scope.viewModel({});

        spyOn(Meteor, 'subscribe').and.callFake(function(name, cb) {
          cb();
          return { ready: angular.noop };
        });

        vm.subscribe('test', angular.noop, function() {
          expect(this).toEqual(vm);
          done();
        });
      });

      it('should call subscription callbacks object using view model as context', function(done) {
        var vm = scope.viewModel({});

        var next = _.after(2, done);

        spyOn(Meteor, 'subscribe').and.callFake(function(name, cbs) {
          cbs.onReady();
          cbs.onStop();
          return { ready: angular.noop };
        });

        vm.subscribe('test', angular.noop, {
          onStop: function() {
            expect(this).toEqual(vm);
            next();
          },

          onReady: function() {
            expect(this).toEqual(vm);
            next();
          }
        });
      });

      it('should digest once subscription function is invoked', function(done) {
        var digest = scope.$digest.bind(scope);

        scope.subscribe('test', function() {
          scope.$digest = function() {
            digest();
            done();
          };

          return [];
        });
      });

      it('should digest once subscription callback is invoked', function(done) {
        var digest = scope.$digest.bind(scope);

        spyOn(Meteor, 'subscribe').and.callFake(function(name, cb) {
          cb();
          return { ready: angular.noop };
        });

        scope.subscribe('test', angular.noop, function() {
          scope.$digest = function() {
            digest();
            done();
          };
        });
      });

      it('should digest once subscription callbacks are invoked', function(done) {
        var next = _.after(2, done);
        var digest = scope.$digest.bind(scope);

        spyOn(Meteor, 'subscribe').and.callFake(function(name, cbs) {
          scope.$digest = function() {
            digest();
            done();
          };

          cbs.onReady();
          cbs.onStop();
          return { ready: angular.noop };
        });

        scope.subscribe('test', angular.noop, {
          onReady: angular.noop,
          onStop: angular.noop
        });
      });

      describe('result convertion', function() {
        it('no params', function() {
          var subscription = { ready: angular.noop };
          var subscribe = spyOn(Meteor, 'subscribe').and.returnValue(subscription);
          scope.subscribe('test', function() { return []; });
          expect(subscribe).toHaveBeenCalledWith('test', jasmine.any(Function));
        });

        it('no return value', function() {
          var subscription = { ready: angular.noop };
          var subscribe = spyOn(Meteor, 'subscribe').and.returnValue(subscription);
          scope.subscribe('test', function() {  });
          expect(subscribe).toHaveBeenCalledWith('test', jasmine.any(Function));
        });

        it('one param', function() {
          var subscription = { ready: angular.noop };
          var subscribe = spyOn(Meteor, 'subscribe').and.returnValue(subscription);
          scope.subscribe('test', function() { return ['a']; });
          expect(subscribe).toHaveBeenCalledWith('test', 'a', jasmine.any(Function));
        });

        it('more than one param', function() {
          var subscription = { ready: angular.noop };
          var subscribe = spyOn(Meteor, 'subscribe').and.returnValue(subscription);
          scope.subscribe('test', function() { return ['a', 'b', 10, 100]; });
          expect(subscribe).toHaveBeenCalledWith('test', 'a', 'b', 10, 100, jasmine.any(Function));
        });
      });
    });

    describe('callMethod()',function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should call Meteor.call() and digest once called back', function(done) {
        var digest = scope.$digest;

        spyOn(Meteor, 'call').and.callFake(function(name, arg1, arg2, cb) {
          expect(name).toEqual('method');
          expect(arg1).toEqual('foo');
          expect(arg2).toEqual('bar');
          cb();
        });

        scope.$digest = function() {
         digest.apply(this, arguments);
         done();
        };

        scope.callMethod('method', 'foo', 'bar', angular.noop);
      });
    });

    describe('applyMethod()',function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should call Meteor.apply() and digest once called back', function(done) {
        var digest = scope.$digest;

        spyOn(Meteor, 'apply').and.callFake(function(name, args, cb) {
          expect(name).toEqual('method');
          expect(args).toEqual(['foo', 'bar']);
          cb();
        });

        scope.$digest = function() {
         digest.apply(this, arguments);
         done();
        };

        scope.applyMethod('method', ['foo', 'bar'], angular.noop);
      });
    });
  });
});
