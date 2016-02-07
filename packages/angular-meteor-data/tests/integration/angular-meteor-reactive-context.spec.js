var testedModule = 'angular-meteor.reactive-context';

describe('angular-meteor', function () {
  describe(testedModule, function () {
    beforeEach(angular.mock.module(testedModule));

    var $$ReactiveContext;
    var $reactive;
    var $compile;
    var $rootScope;
    var Scope;

    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_, _$$ReactiveContext_, _$reactive_) {
      $$ReactiveContext = _$$ReactiveContext_;
      $reactive = _$reactive_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      Scope = Object.getPrototypeOf($rootScope).constructor;
    }));

    describe('$$ReactiveContext', function () {
      var testId = 'test-id';
      var $scope;
      var context;
      var reactiveContext;

      beforeEach(function() {
        $scope = $rootScope.$new();
        context = {};
        reactiveContext = new $$ReactiveContext(context, $scope);
        bigCollection.remove(testId);
      });

      it('should set the given context and scope', function () {
        expect(reactiveContext._scope).toEqual($scope);
        expect(reactiveContext._context).toEqual(context);
      });

      it('should set a new scope if not specified', function () {
        reactiveContext = new $$ReactiveContext(context);
        expect(reactiveContext._scope).toEqual(jasmine.any(Scope));
        expect(reactiveContext._context).toEqual(context);
      });

      describe('helpers()', function() {
        it('should register a number helper', function () {
          reactiveContext.helpers({
            myHelper: function () {
              return 10;
            }
          });

          expect(context.myHelper).toBe(10);
        });

        it('should override a pre-defined helper', function () {
          context.myHelper = 'oops';

          reactiveContext.helpers({
            myHelper: function () {
              return 10;
            }
          });

          expect(context.myHelper).toBe(10);
        });

        it('should register a string helper', function () {
          reactiveContext.helpers({
            myHelper: function () {
              return 'Test';
            }
          });

          expect(context.myHelper).toBe('Test');
        });

        it('should register an object helper', function () {
          var obj = {
            prop1: '10',
            prop2: 'Test'
          };

          reactiveContext.helpers({
            myHelper: function () {
              return obj;
            }
          });

          expect(context.myHelper).toEqual(obj);
        });

        it('should register an array helper', function () {
          var arr = [10, 20, 30];

          reactiveContext.helpers({
            myHelper: function () {
              return arr;
            }
          });

          expect(context.myHelper).toEqual(arr);
        });

        it('should register cursor helper as an array', function () {
          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find();
            }
          });

          expect(context.myHelper).toEqual(jasmine.any(Array));
        });

        it('should update cursor helper as collection gets updated', function () {
          var cursor = bigCollection.find();

          reactiveContext.helpers({
            myHelper: function () {
              return cursor;
            }
          });

          bigCollection.insert({
            _id: testId,
            prop1: 'A'
          });

          expect(context.myHelper).toEqual(jasmine.any(Array));
          expect(context.myHelper.length).toEqual(1);

          bigCollection.remove({_id: testId});
          expect(context.myHelper).toEqual(jasmine.any(Array));
          expect(context.myHelper.length).toEqual(0);
        });

        it('should register cursor fetch result helper as array', function () {
          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find().fetch();
            }
          });

          expect(context.myHelper).toEqual(jasmine.any(Array));
        });

        it('should update cursor helper once a new document is added', function () {
          var data = {
            _id: testId,
            prop1: 'T'
          };

          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find();
            }
          });

          bigCollection.insert(data);
          expect(context.myHelper.length).toBe(1);
          expect(context.myHelper[0]).toEqual(data);
        });

        it('should update cursor helper once a document is removed', function () {
          var data = {
            _id: testId,
            prop1: 'T'
          };

          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find();
            }
          });

          bigCollection.remove(testId);
          expect(context.myHelper.length).toBe(0);
          expect(context.myHelper[0]).toBeUndefined();
        });

        it('sshould update cursor helper once a document is removed', function () {
          var data = {
            _id: testId,
            prop1: 'T'
          };

          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find();
            }
          });

          bigCollection.insert(data);
          bigCollection.update({_id: testId}, {$set: {prop1: 'B'}});

          expect(context.myHelper.length).toBe(1);
          expect(context.myHelper[0]).toBeDefined();
          expect(context.myHelper[0].prop1).toBe('B');
        });

        it('should update cursor helper once the collection is rearranged', function () {
          var data1 = {
            _id: testId,
            prop1: 'A'
          };

          var data2 = {
            _id: 'OtherId',
            prop1: 'B'
          };

          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find({}, {sort: {prop1: 1}});
            }
          });

          bigCollection.insert(data2);

          expect(context.myHelper.length).toBe(1);
          expect(context.myHelper[0]).toBeDefined();
          expect(context.myHelper[0].prop1).toBe('B');

          bigCollection.insert(data1);

          expect(context.myHelper.length).toBe(2);
          expect(context.myHelper[0]).toBeDefined();
          expect(context.myHelper[1]).toBeDefined();
          expect(context.myHelper[0].prop1).toBe('A');
          expect(context.myHelper[1].prop1).toBe('B');
        });

        it('should digest scope once collection is updated', function () {
          var data = {
            _id: testId,
            prop1: 'T'
          };

          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find({});
            }
          });

          var digestScopeSpy = spyOn($scope, '$digest');
          bigCollection.insert(data);
          expect(digestScopeSpy).toHaveBeenCalled();
          expect(digestScopeSpy.calls.count()).toBe(1);
        });


        it('should digest scope used as context once collection is updated', function () {
          reactiveContext = new $$ReactiveContext($scope, $scope);
          bigCollection.remove(testId);

          var data = {
            _id: testId,
            prop1: 'T'
          };

          reactiveContext.helpers({
            myHelper: function () {
              return bigCollection.find({});
            }
          });

          var digestScopeSpy = spyOn($scope, '$digest');
          bigCollection.insert(data);
          expect(digestScopeSpy).toHaveBeenCalled();
          expect(digestScopeSpy.calls.count()).toBe(1);
        });

        it('should define reactive property on the context', function () {
          reactiveContext.helpers({
            prop: 20
          });

          expect(context.prop).toBeDefined();
          expect(context.prop).toBe(20);
        });

        it('should define reactive property on the context and update the value', function () {
          reactiveContext.helpers({
            prop: 20
          });

          context.prop = 100;
          expect(context.prop).toBeDefined();
          expect(context.prop).toBe(100);
        });


        it('should create a configurable and enumerable reactive property', function () {
          reactiveContext.helpers({
            prop: 20
          });

          expect(Object.keys(context)).toContain("prop");
          delete context.prop;
          expect(context.prop).not.toBeDefined();
        });

        it('should have reactive properties available on the scope and in the view when using scope only', function () {
          reactiveContext = new $$ReactiveContext($scope, $scope);

          reactiveContext.helpers({
            prop: 20
          });

          var element = angular.element('<input type="text" ng-model="prop" /><span>{{ prop }}</span>');
          $compile(element)($scope);
          $scope.$apply();

          expect(element.get(1).innerHTML).toBe('20');
        });

        it('should update reactive properties when using view and ngModel', function () {
          reactiveContext = new $$ReactiveContext($scope, $scope);

          reactiveContext.helpers({
            prop: 20
          });

          var element = angular.element('<input type="text" ng-model="prop" /><span>{{ prop }}</span>');
          $compile(element)($scope);
          $scope.$apply();

          expect(element.get(1).innerHTML).toBe('20');

          var autorunSpy = jasmine.createSpy();
          Meteor.autorun(autorunSpy);
          var inputModel = angular.element(element.get(0)).controller('ngModel');
          inputModel.$setViewValue('test');
          $scope.$apply();
          Tracker.flush();

          expect(autorunSpy).toHaveBeenCalled();
          expect(element.get(1).innerHTML).toBe('test');
        });

        it('should trigger helpers dependencies when using object and updating a sub property', function () {
          reactiveContext.helpers({
            foo: {}
          });

          $rootScope.$apply();
          Tracker.flush();
          expect(context._dependencies.foo).toBeDefined();

          var depend = jasmine.createSpy('depend');
          context._dependencies.foo.depend = depend;
          context.foo.bar = 'newbar';

          $rootScope.$apply();
          Tracker.flush();
          expect(depend.calls.count()).toEqual(1);
        });

        it('should NOT trigger autorun dependencies when using object and adding a sub property', function () {
          var callCount = 0;

          context.prop = {
            mySubProp: 10
          };

          reactiveContext.helpers({
            myMethod: function () {
              callCount++;
              return reactiveContext.getReactively('prop');
            }
          });

          $rootScope.$apply();
          Tracker.flush();
          expect(callCount).toBe(1);

          context.prop.newProp = 20;
          $rootScope.$apply();
          Tracker.flush();

          expect(callCount).toBe(1);
        });

        it('should trigger autorun dependencies when using object and adding a sub property while watching deep', function () {
          var callCount = 0;

          context.prop = {
            mySubProp: 10
          };

          reactiveContext.helpers({
            myMethod: function () {
              callCount++;
              return reactiveContext.getReactively('prop', true);
            }
          });

          $rootScope.$apply();
          Tracker.flush();
          expect(callCount).toBe(1);

          context.prop.newProp = 20;
          $rootScope.$apply();
          Tracker.flush();

          expect(callCount).toBe(2);
        });

        it('should NOT trigger autorun dependencies when using array and adding an element sub property while watching as a collection', function () {
          var callCount = 0;

          context.prop = [{
            mySubProp: 10
          }];

          reactiveContext.helpers({
            myMethod: function () {
              callCount++;
              return reactiveContext.getCollectionReactively('prop');
            }
          });

          $rootScope.$apply();
          Tracker.flush();
          expect(callCount).toBe(1);

          context.prop[0].newProp = 20;
          $rootScope.$apply();
          Tracker.flush();

          expect(callCount).toBe(1);
        });

        it('should trigger autorun dependencies when using array and replacing an element while watching as a collection', function () {
          var callCount = 0;

          context.prop = [10];

          reactiveContext.helpers({
            myMethod: function () {
              callCount++;
              return reactiveContext.getCollectionReactively('prop', true);
            }
          });

          $rootScope.$apply();
          Tracker.flush();
          expect(callCount).toBe(1);

          context.prop[0] = 20;
          $rootScope.$apply();
          Tracker.flush();

          expect(callCount).toBe(2);
        });

        it('should trigger autorun dependencies when using array and adding an element while watching as a collection', function () {
          var callCount = 0;

          context.prop = [10];

          reactiveContext.helpers({
            myMethod: function () {
              callCount++;
              return reactiveContext.getCollectionReactively('prop', true);
            }
          });

          $rootScope.$apply();
          Tracker.flush();
          expect(callCount).toBe(1);

          context.prop.push(20);
          $rootScope.$apply();
          Tracker.flush();

          expect(callCount).toBe(2);
        });

        it ('should not run getReactively() for cursors', function() {
          expect($scope.$$watchersCount).toBe(0);

          reactiveContext.helpers({
            myHelper: function() {
              return bigCollection.find({});
            }
          });

          expect($scope.$$watchersCount).toBe(0);
        });
      });

      describe('autorun()', function() {
        it('should call Scope.autorun()', function() {
          $scope.autorun = jasmine.createSpy('autorun');

          var fn = angular.noop;
          var options = {};

          reactiveContext.autorun(fn, options);
          expect($scope.autorun).toHaveBeenCalledWith(jasmine.any(Function), options);
        });

        it('should call the autorun method with current context', function (done) {
          $scope.autorun = jasmine.createSpy('autorun').and.callFake(function(fn) {
            return fn();
          });

          reactiveContext.autorun(function() {
            expect(this).toBe(context);
            done();
          });
        });
      });

      describe('getReactively()', function() {
        it('should call Scope.getReactively() with context', function() {
          $scope.getReactively = jasmine.createSpy('getReactively');
          reactiveContext.getReactively('myProp');
          expect($scope.getReactively).toHaveBeenCalledWith(context, 'myProp');
        });

        it('should get the value from the context when using getReactively on a primitive', function () {
          context.myProp = 10;
          var value = reactiveContext.getReactively('myProp');
          expect(value).toBe(10);
        });

        it('should get the value from the context when using getReactively on an object', function () {
          context.myProp = {
            subProp: 10
          };
          var value = reactiveContext.getReactively('myProp.subProp');
          expect(value).toBe(10);
        });
      });

      describe('getCollectionReactively()', function() {
        it('should call Scope.getCollectionReactively() with context', function() {
          $scope.getCollectionReactively = jasmine.createSpy('getCollectionReactively');
          reactiveContext.getCollectionReactively('myProp');
          expect($scope.getCollectionReactively).toHaveBeenCalledWith(context, 'myProp');
        });

        it('should get the value from the context when using getCollectionReactively on a primitive', function () {
          context.myProp = [10];
          var value = reactiveContext.getCollectionReactively('myProp');
          expect(value).toEqual([10]);
        });

        it('should get the value from the context when using getCollectionReactively on an object', function () {
          context.myProp = {
            subProp: [10]
          };
          var value = reactiveContext.getCollectionReactively('myProp.subProp');
          expect(value).toEqual([10]);
        });
      });

      describe('subscribe()', function() {
        it('should call Scope.subscribe()', function() {
          $scope.subscribe = jasmine.createSpy('subscribe');
          reactiveContext.subscribe(1, 2, 3);
          expect($scope.subscribe).toHaveBeenCalledWith(1, 2, 3);
        });

        it('should create a dependency when using subscription with getReactively()', function () {
          context.myProp = {
            subProp: 10
          };

          $scope.$apply();

          var callCount = 0;

          reactiveContext.subscribe('t', function () {
            callCount++;
            return [reactiveContext.getReactively('myProp.subProp')];
          });

          $scope.$apply();
          context.myProp.subProp = 2;
          $scope.$apply();

          Tracker.flush();

          expect(callCount).toBe(2);
        });

        it('should create a dependency when using subscription with getCollectionReactively()', function () {
          context.myProp = {
            subProp: [10]
          };

          $scope.$apply();

          var callCount = 0;

          reactiveContext.subscribe('t', function () {
            callCount++;
            return [reactiveContext.getCollectionReactively('myProp.subProp')];
          });

          $scope.$apply();
          context.myProp.subProp.push(2);
          $scope.$apply();

          Tracker.flush();

          expect(callCount).toBe(2);
        });

        it('should create a subscription with no callback or arguments provided', function () {
          var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
            stop: angular.noop,
            ready: angular.noop,
            subscriptionId: 0
          });

          reactiveContext.subscribe('test');

          expect(subscribeSpy).toHaveBeenCalledWith('test', angular.noop);
        });

        it('should create a subscription with no callback provided', function () {
          var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
            stop: angular.noop,
            ready: angular.noop,
            subscriptionId: 0
          });

          reactiveContext.subscribe('test', function() {
            return [10, 20];
          });

          expect(subscribeSpy).toHaveBeenCalledWith('test', 10, 20, angular.noop);
        });

        it('should create a subscription with a callback function provided', function () {
          var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
            stop: angular.noop,
            ready: angular.noop,
            subscriptionId: 0
          });

          var cb = function () {};

          reactiveContext.subscribe('test', function () {
            return [10, 20];
          }, cb);

          expect(subscribeSpy).toHaveBeenCalledWith('test', 10, 20, jasmine.any(Function));
        });

        it('should create a subscription with callbacks object provided', function () {
          var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
            stop: angular.noop,
            ready: angular.noop,
            subscriptionId: 0
          });

          var cb = {
            onReady: function() {},
            onStop: function() {}
          };

          reactiveContext.subscribe('test', function () {
            return [10, 20];
          }, cb);

          expect(subscribeSpy).toHaveBeenCalledWith('test', 10, 20, jasmine.any(Object));
        });

        it('should call subscription arguments function using context as thisArg', function (done) {
          reactiveContext.subscribe('test', function () {
            expect(this).toEqual(context);
            done();
          });
        });

        it('should call subscription callback function using context as thisArg', function(done) {
          $scope.subscribe = function(name, fn, cb) {
            cb();
          };

          reactiveContext.subscribe('test', angular.noop, function() {
            expect(this).toEqual(context);
            done();
          });
        });

        it('should call subscription callbacks object using context as thisArg', function(done) {
          var next = _.after(2, done);

          $scope.subscribe = function(name, fn, cb) {
            cb.onStop();
            cb.onReady();
          };

          reactiveContext.subscribe('test', angular.noop,{
            onStop: function() {
              expect(this).toEqual(context);
              next();
            },

            onReady: function() {
              expect(this).toEqual(context);
              next();
            }
          });
        });
      });

      describe('subscribe()', function() {
        it('should stop all subscriptions and autocomputions', function() {
          var autorun = reactiveContext.autorun(angular.noop);
          var subscription = reactiveContext.subscribe('dummy');
          autorun.stop = jasmine.createSpy('autorunStop');
          subscription.stop = jasmine.createSpy('subscriptionStop');

          reactiveContext.stop();
          expect(autorun.stop).toHaveBeenCalled();
          expect(subscription.stop).toHaveBeenCalled();
        });
      });
    });

    describe('$reactive', function() {
      var $scope;
      var context;

      beforeEach(function() {
        $$ReactiveContext.prototype.helpers = jasmine.createSpy('helpers');
        $$ReactiveContext.prototype.autorun = jasmine.createSpy('autorun');
        $$ReactiveContext.prototype.subscribe = jasmine.createSpy('subscribe');
        $$ReactiveContext.prototype.getReactively = jasmine.createSpy('getReactively');
        $$ReactiveContext.prototype.stop = jasmine.createSpy('stop');

        $scope = $rootScope.$new();
        context = {};
      });

      it('should call ReactiveContext()', function() {
        $reactive(context).attach($scope);
        reactiveContext = context._reactiveContext;

        expect(reactiveContext).toBeDefined();
        expect(reactiveContext._context).toEqual(context);
        expect(reactiveContext._scope).toEqual($scope);
      });

      it('should return the context', function() {
        var vm = $reactive(context).attach($scope);
        expect(vm).toEqual(context);
      });

      it('should attach reactive functions to context', function() {
        $reactive(context).attach($scope);

        context.helpers();
        context.autorun();
        context.subscribe();
        context.getReactively();
        context.stop();

        expect($$ReactiveContext.prototype.helpers).toHaveBeenCalled();
        expect($$ReactiveContext.prototype.autorun).toHaveBeenCalled();
        expect($$ReactiveContext.prototype.subscribe).toHaveBeenCalled();
        expect($$ReactiveContext.prototype.getReactively).toHaveBeenCalled();
        expect($$ReactiveContext.prototype.stop).toHaveBeenCalled();
      });
    });
  });
});
