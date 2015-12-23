var testedModule = 'angular-meteor.reactive';

describe('angular-meteor', function () {
  describe(testedModule, function () {
    beforeEach(angular.mock.module(testedModule));

    var $compile;
    var $reactive;
    var $rootScope;
    var testScope;
    var context = {};

    beforeEach(angular.mock.inject(function (_$compile_, _$reactive_, _$rootScope_) {
      $compile = _$compile_;
      $reactive = _$reactive_;
      $rootScope = _$rootScope_;
      testScope = $rootScope.$new();
    }));

    describe('$reactive', function () {
      it('Should receive one param and pass them to the ReactiveContext class without scope object', function () {
        var returnValue = $reactive(context);

        expect(returnValue.scope).toBeUndefined();
        expect(returnValue.context).toBe(context);
      });

      it('Should receive context param and attached scope and then and pass them to the ReactiveContext class', function () {
        var returnValue = $reactive(context).attach(testScope);

        expect(returnValue.scope).toBe(testScope);
        expect(returnValue.context).toBe(context);
      });

      it('Should receive only context and do not use scope', function () {
        var returnValue = $reactive(context);

        expect(returnValue.scope).toBeUndefined();
        expect(returnValue.context).toBe(context);
      });

      it('Should receive only scope and use it as context', function () {
        var returnValue = $reactive(testScope);

        expect(returnValue.scope).toBe(testScope);
        expect(returnValue.context).toBe(testScope);
      });
    });

    describe('ReactiveContext', function () {
      var reactiveContextInstance;
      var testObjectId = 'TempId';

      beforeEach(function () {
        testScope = $rootScope.$new();
        context = {};
        reactiveContextInstance = $reactive(context).attach(testScope);
        bigCollection.remove(testObjectId);
      });

      it('Should register primitive helper', function () {
        reactiveContextInstance.helpers({
          myHelper: function () {
            return 10;
          }
        });

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).toBe(10);
      });

      it('Whould not explode when there is property on the context with the helper name', function () {
        var scope = $rootScope.$new();

        scope.myHelper = 'oops';
        var instance = $reactive(scope).helpers({
          myHelper: function () {
            return 10;
          }
        });

        expect(instance.stoppables.length).toBe(1);
        expect(instance.context['myHelper']).toBe(10);
      });

      it('Should register string helper', function () {
        reactiveContextInstance.helpers({
          myHelper: function () {
            return 'Test';
          }
        });

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).toBe('Test');
      });

      it('Should register object helper', function () {
        var testObject = {
          prop1: '10',
          prop2: 'Test'
        };

        reactiveContextInstance.helpers({
          myHelper: function () {
            return testObject;
          }
        });

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).toEqual(testObject);
      });

      it('Should register array helper', function () {
        var testArray = [10, 20, 30];

        reactiveContextInstance.helpers({
          myHelper: function () {
            return testArray;
          }
        });

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).toEqual(testArray);
      });

      it('Should register cursor helper as array', function () {
        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find();
          }
        });

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
      });

      it('Should register cursor and reset the data when cursor is invalidated', function () {
        var cursor = bigCollection.find();

        reactiveContextInstance.helpers({
          myHelper: function () {
            return cursor;
          }
        });

        bigCollection.insert({
          _id: testObjectId,
          prop1: 'A'
        });

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
        expect(reactiveContextInstance.context['myHelper'].length).toEqual(1);

        reactiveContextInstance.stoppables[0].invalidate();

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
        expect(reactiveContextInstance.context['myHelper'].length).toEqual(0);
      });

      it('Should register cursor fetch result helper as array', function () {
        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find().fetch();
          }
        });

        expect(reactiveContextInstance.stoppables.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
      });

      it('Should handle cursor - add action', function () {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find();
          }
        });

        bigCollection.insert(data);

        expect(reactiveContextInstance.context['myHelper'].length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'][0]).toEqual(data);
      });

      it('Should handle cursor - remove action', function () {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find();
          }
        });

        bigCollection.remove(testObjectId);

        expect(reactiveContextInstance.context['myHelper'].length).toBe(0);
        expect(reactiveContextInstance.context['myHelper'][0]).toBeUndefined();
      });

      it('Should handle cursor - update action', function () {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find();
          }
        });

        bigCollection.insert(data);
        bigCollection.update({_id: testObjectId}, {$set: {prop1: 'B'}});

        expect(reactiveContextInstance.context['myHelper'].length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'][0]).toBeDefined();
        expect(reactiveContextInstance.context['myHelper'][0].prop1).toBe('B');
      });

      it('Should handle cursor - move action', function () {
        var data1 = {
          _id: testObjectId,
          prop1: 'A'
        };

        var data2 = {
          _id: 'OtherId',
          prop1: 'B'
        };

        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find({}, {sort: {prop1: 1}});
          }
        });

        bigCollection.insert(data2);

        expect(reactiveContextInstance.context['myHelper'].length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'][0]).toBeDefined();
        expect(reactiveContextInstance.context['myHelper'][0].prop1).toBe('B');

        bigCollection.insert(data1);

        expect(reactiveContextInstance.context['myHelper'].length).toBe(2);
        expect(reactiveContextInstance.context['myHelper'][0]).toBeDefined();
        expect(reactiveContextInstance.context['myHelper'][1]).toBeDefined();
        expect(reactiveContextInstance.context['myHelper'][0].prop1).toBe('A');
        expect(reactiveContextInstance.context['myHelper'][1].prop1).toBe('B');
      });

      it('Should trigger scope $digest when using scope and context', function () {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find({});
          }
        });

        var digestScopeSpy = spyOn(testScope, '$digest');

        bigCollection.insert(data);

        expect(digestScopeSpy).toHaveBeenCalled();
        expect(digestScopeSpy.calls.count()).toBe(1);
      });


      it('Should trigger scope $digest when using scope only as context', function () {
        testScope = $rootScope.$new();
        reactiveContextInstance = $reactive(testScope);
        bigCollection.remove(testObjectId);

        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find({});
          }
        });

        var digestScopeSpy = spyOn(testScope, '$digest');

        bigCollection.insert(data);

        expect(digestScopeSpy).toHaveBeenCalled();
        expect(digestScopeSpy.calls.count()).toBe(1);
      });

      it('Should call stop of all computations when stopping the reactivity of the context', function () {
        reactiveContextInstance.helpers({
          myHelper: function () {
            return bigCollection.find({});
          }
        });

        var computationSpy = spyOn(reactiveContextInstance.stoppables[0], 'stop');

        reactiveContextInstance.stop();

        expect(computationSpy).toHaveBeenCalled();
      });

      it('Should define reactive property on the context', function () {
        reactiveContextInstance.helpers({
          prop: 20
        });

        expect(context.prop).toBeDefined();
        expect(context.prop).toBe(20);
      });

      it('Should defined reactive property on the context and update the value', function () {
        reactiveContextInstance.helpers({
          prop: 20
        });

        context.prop = 100;

        expect(context.prop).toBeDefined();
        expect(context.prop).toBe(100);
      });


      it('Should create a configurable and enumerable reactive property', function () {
        reactiveContextInstance.helpers({
          prop: 20
        });

        expect(Object.keys(context)).toContain("prop");

        delete context.prop;

        expect(context.prop).not.toBeDefined();
      });

      it('Should add subscription when call subscribe', function () {
        reactiveContextInstance.helpers({
          prop: 20
        });

        var subscribeSpy = spyOn(testScope, 'subscribe');

        reactiveContextInstance.subscribe('users', function () {
          return [];
        });

        expect(subscribeSpy).toHaveBeenCalled();
      });

      it('Should call autorun methods when updating reactive property value', function () {
        reactiveContextInstance.helpers({
          prop: 20
        });

        var autorunSpy = jasmine.createSpy();
        Meteor.autorun(autorunSpy);

        context.prop = 100;
        Tracker.flush();

        expect(autorunSpy.calls.count()).toBe(1);
      });

      it('Should have reactive properties available on the scope and in the view when using scope only', function () {
        testScope = $rootScope.$new();
        reactiveContextInstance = $reactive(testScope);

        reactiveContextInstance.helpers({
          prop: 20
        });

        var element = angular.element('<input type="text" ng-model="prop" /><span>{{ prop }}</span>');
        $compile(element)(testScope);
        testScope.$apply();

        expect(element.get(1).innerHTML).toBe('20');
      });

      it('Should update reactive properties when using view and ngModel', function () {
        testScope = $rootScope.$new();
        reactiveContextInstance = $reactive(testScope);

        reactiveContextInstance.helpers({
          prop: 20
        });

        var element = angular.element('<input type="text" ng-model="prop" /><span>{{ prop }}</span>');
        $compile(element)(testScope);
        testScope.$apply();

        expect(element.get(1).innerHTML).toBe('20');

        var autorunSpy = jasmine.createSpy();
        Meteor.autorun(autorunSpy);
        var inputModel = angular.element(element.get(0)).controller('ngModel');
        inputModel.$setViewValue('test');
        testScope.$apply();
        Tracker.flush();

        expect(autorunSpy).toHaveBeenCalled();
        expect(element.get(1).innerHTML).toBe('test');
      });

      it('Should trigger Helpers dependencies when using object and updating a sub property', function () {
        $reactive(context);

        var callCount = 0;

        context.prop = {
          mySubProp: 10
        };

        context.helpers({
          myMethod: function () {
            callCount++;

            return 'a';
          }
        });

        $rootScope.$apply();
        Tracker.flush();

        context.prop.mySubProp = 20;

        $rootScope.$apply();
        Tracker.flush();

        //expect(callCount).toBe(2);
      });

      it('Should NOT trigger Autorun dependencies when using object and adding a sub property', function () {
        $reactive(context);

        var callCount = 0;

        context.prop = {
          mySubProp: 10
        };

        context.helpers({
          myMethod: function () {
            callCount++;

            return context.getReactively('prop'); // Shallow
          }
        });

        $rootScope.$apply();
        Tracker.flush();

        context.prop.newProp = 20;

        $rootScope.$apply();
        Tracker.flush();

        expect(callCount).toBe(1);
      });

      it('Should trigger Autorun dependencies when using object and adding a sub property and watching deep', function () {
        $reactive(context);

        var callCount = 0;

        context.prop = {
          mySubProp: 10
        };

        context.helpers({
          myMethod: function () {
            callCount++;

            return context.getReactively('prop', true);
          }
        });

        $rootScope.$apply();
        Tracker.flush();

        context.prop.newProp = 20;

        $rootScope.$apply();
        Tracker.flush();

        expect(callCount).toBe(2);
      });

      it('Should remove and destroy custom scope if it was necessary to create it', function () {
        var reactive = $reactive(context);

        context.helpers({
          prop: {
            mySubProp: 10
          }
        });

        var destroySpy = spyOn(reactive.scope, '$destroy').and.callThrough();

        reactive.stop();

        expect(destroySpy).toHaveBeenCalled();
        expect(reactive.scope).toBeUndefined();
      });


      it('Should NOT remove and destroy scope if the scope was attached', function () {
        var reactive = $reactive(context);
        reactive.attach(testScope);

        context.helpers({
          prop: {
            mySubProp: 10
          }
        });

        var destroySpy = spyOn(reactive.scope, '$destroy').and.callThrough();

        reactive.stop();

        expect(destroySpy).not.toHaveBeenCalled();
        expect(reactive.scope).toBeDefined();
      });

      it('Should get the value from the context when using getReactively - primitive', function () {
        var reactive = $reactive(context);
        reactive.attach(testScope);

        context.myProp = 10;

        var value = context.getReactively('myProp');

        expect(value).toBe(10);
      });

      it('Should get the value from the context when using getReactively - object', function () {
        var reactive = $reactive(context);
        reactive.attach(testScope);

        context.myProp = {
          subProp: 10
        };

        var value = context.getReactively('myProp.subProp');

        expect(value).toBe(10);
      });

      it('Should create a dependency when using subscription with getReactively', function () {
        var reactive = $reactive(context);
        reactive.attach(testScope);

        context.myProp = {
          subProp: 10
        };

        testScope.$apply();

        var callCount = 0;

        context.subscribe('t', function () {
          callCount++;
          return [context.getReactively('myProp.subProp')]
        });

        testScope.$apply();
        context.myProp.subProp = 2;
        testScope.$apply();

        Tracker.flush();

        expect(callCount).toBe(2);
      });


      it('Should create a subscription without callback - NO scope', function () {
        $reactive(context);

        var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
          ready: angular.noop,
          subscriptionId: 0
        });

        context.subscribe('test');

        expect(subscribeSpy).toHaveBeenCalledWith('test', angular.noop);
      });

      it('Should create a subscription with no callback and args- NO scope', function () {
        $reactive(context);

        var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
          ready: angular.noop,
          subscriptionId: 0
        });

        context.subscribe('test', function() {
          return [
            10,
            20
          ];
        });

        expect(subscribeSpy).toHaveBeenCalledWith('test', 10, 20, angular.noop);
      });

      it('Should create a subscription with callback and args- NO scope', function () {
        $reactive(context);

        var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
          ready: angular.noop,
          subscriptionId: 0
        });
        var cb = function () {
        };

        context.subscribe('test', function () {
          return [
            10,
            20
          ];
        }, cb);

        expect(subscribeSpy).toHaveBeenCalledWith('test', 10, 20, cb);
      });

      it('Should create a subscription with callback and args- NO scope', function () {
        $reactive(context);

        var subscribeSpy = spyOn(Meteor, 'subscribe').and.returnValue({
          ready: angular.noop,
          subscriptionId: 0
        });

        var cb = {
          onReady: function() {

          },
          onStop: function() {

          }
        };

        context.subscribe('test', function () {
          return [
            10,
            20
          ];
        }, cb);

        expect(subscribeSpy).toHaveBeenCalledWith('test', 10, 20, cb);
      });
    });
  });
});
