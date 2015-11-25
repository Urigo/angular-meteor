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
    });
  });
});
