var testedModule = 'angular-meteor.reactive';

describe('angular-meteor', function () {
  describe(testedModule, function() {
    beforeEach(angular.mock.module(testedModule));

    var $reactive;
    var $rootScope;
    var testScope;
    var context = {};

    beforeEach(angular.mock.inject(function(_$reactive_, _$rootScope_) {
      $reactive = _$reactive_;
      $rootScope = _$rootScope_;
      testScope = $rootScope.$new();
    }));

    describe('$reactive', function() {
      it('Should receive two param and pass them to the ReactiveContext class', function() {
        var returnValue = $reactive(context, testScope);

        expect(returnValue.scope).toBe(testScope);
        expect(returnValue.context).toBe(context);
      });

      it('Should receive only context and do not use scope', function() {
        var returnValue = $reactive(context);

        expect(returnValue.scope).toBeUndefined();
        expect(returnValue.context).toBe(context);
      });

      it('Should receive only scope and use it as context', function() {
        var returnValue = $reactive(testScope);

        expect(returnValue.scope).toBe(testScope);
        expect(returnValue.context).toBe(testScope);
      });
    });

    describe('ReactiveContext', function() {
      var reactiveContextInstance;
      var testObjectId = 'TempId';

      beforeEach(function() {
        testScope = $rootScope.$new();
        context = {};
        reactiveContextInstance = $reactive(context, testScope);
        bigCollection.remove(testObjectId);
      });

      it('Should throw an exception when helper is not a function', function() {
        expect(function() {
          reactiveContextInstance.helpers({
            myHelper: 10
          });
        }).toThrow();
      });


      it('Should register primitive helper', function() {
        reactiveContextInstance.helpers({
          myHelper: function() {
            return 10;
          }
        });

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).toBe(10);
      });

      it('Should register string helper', function() {
        reactiveContextInstance.helpers({
          myHelper: function() {
            return 'Test';
          }
        });

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).toBe('Test');
      });

      it('Should register object helper', function() {
        var testObject = {
          prop1: '10',
          prop2: 'Test'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
            return testObject;
          }
        });

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).not.toBe(testObject);
        expect(reactiveContextInstance.context['myHelper']).toEqual(testObject);
      });

      it('Should register array helper', function() {
        var testArray = [10, 20, 30];

        reactiveContextInstance.helpers({
          myHelper: function() {
            return testArray;
          }
        });

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper']).not.toBe(testArray);
        expect(reactiveContextInstance.context['myHelper']).toEqual(testArray);
      });

      it('Should register cursor helper as array', function() {
        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find();
          }
        });

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
      });

      it('Should register cursor and reset the data when cursor is invalidated', function() {
        var cursor = bigCollection.find();

        reactiveContextInstance.helpers({
          myHelper: function() {
            return cursor;
          }
        });

        bigCollection.insert({
          _id: testObjectId,
          prop1: 'A'
        });

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
        expect(reactiveContextInstance.context['myHelper'].length).toEqual(1);

        reactiveContextInstance.computations[0].invalidate();

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
        expect(reactiveContextInstance.context['myHelper'].length).toEqual(0);
      });

      it('Should register cursor fetch result helper as array', function() {
        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find().fetch();
          }
        });

        expect(reactiveContextInstance.computations.length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'] instanceof Array).toEqual(true);
      });

      it('Should handle cursor - add action', function() {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find();
          }
        });

        bigCollection.insert(data);

        expect(reactiveContextInstance.context['myHelper'].length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'][0]).toEqual(data);
      });

      it('Should handle cursor - remove action', function() {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find();
          }
        });

        bigCollection.remove(testObjectId);

        expect(reactiveContextInstance.context['myHelper'].length).toBe(0);
        expect(reactiveContextInstance.context['myHelper'][0]).toBeUndefined();
      });

      it('Should handle cursor - update action', function() {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find();
          }
        });

        bigCollection.insert(data);
        bigCollection.update({_id: testObjectId}, {$set: {prop1: 'B'}});

        expect(reactiveContextInstance.context['myHelper'].length).toBe(1);
        expect(reactiveContextInstance.context['myHelper'][0]).toBeDefined();
        expect(reactiveContextInstance.context['myHelper'][0].prop1).toBe('B');
      });

      it('Should handle cursor - move action', function() {
        var data1 = {
          _id: testObjectId,
          prop1: 'A'
        };

        var data2 = {
          _id: 'OtherId',
          prop1: 'B'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
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

      it('Should trigger scope $digest when using scope and context', function() {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find({});
          }
        });

        var digestScopeSpy = spyOn(testScope, '$digest');

        bigCollection.insert(data);

        expect(digestScopeSpy).toHaveBeenCalled();
        expect(digestScopeSpy.calls.count()).toBe(1);
      });

      it('Should trigger scope $digest when using scope only as context', function() {
        testScope = $rootScope.$new();
        reactiveContextInstance = $reactive(testScope);
        bigCollection.remove(testObjectId);

        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find({});
          }
        });

        var digestScopeSpy = spyOn(testScope, '$digest');

        bigCollection.insert(data);

        expect(digestScopeSpy).toHaveBeenCalled();
        expect(digestScopeSpy.calls.count()).toBe(1);
      });

      it('Should call stop of all computations when stopping the reactivity of the context', function() {
        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find({});
          }
        });

        var computationSpy = spyOn(reactiveContextInstance.computations[0], 'stop');

        reactiveContextInstance.stop();

        expect(computationSpy).toHaveBeenCalled();
      });

      it('Should trigger the the property change when update values', function() {
        var data = {
          _id: testObjectId,
          prop1: 'T'
        };

        reactiveContextInstance.helpers({
          myHelper: function() {
            return bigCollection.find({});
          }
        });

        var cbSpy = jasmine.createSpy();

        reactiveContextInstance.onPropertyChanged(cbSpy);

        bigCollection.insert(data);

        expect(cbSpy).toHaveBeenCalled();
      });

      it('Should defined reactive property on the context', function() {
        reactiveContextInstance.reactiveProperties({
          prop: 20
        });

        expect(context.prop).toBeDefined();
        expect(context.prop).toBe(20);
      });

      it('Should defined reactive property on the context and update the value', function() {
        reactiveContextInstance.reactiveProperties({
          prop: 20
        });

        context.prop = 100;

        expect(context.prop).toBeDefined();
        expect(context.prop).toBe(100);
      });

      it('Should add subscription when call subscribe', function() {
        reactiveContextInstance.reactiveProperties({
          prop: 20
        });

        var subscribeSpy = spyOn(testScope, 'subscribe');

        reactiveContextInstance.subscribe('users', function() {
          return [];
        });

        expect(subscribeSpy).toHaveBeenCalled();
      });

      fit('Should call autorun methods when updating reactive property value', function() {
        reactiveContextInstance.reactiveProperties({
          prop: 20
        });

        var callCount = 0;
        var obj = {
          func : () => { callCount++ }
        };

        Meteor.autorun(() => {
          obj.func();
          console.log(context.prop);
        });

        context.prop = 100;
        Tracker.flush();

        expect(callCount).toBe(2);
      });
    });
  });
});
