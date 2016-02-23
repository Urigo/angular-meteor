import 'reflect-metadata';
import * as ngCore from 'angular2/core';
import {MeteorComponent} from 'angular2-meteor/meteor_component';

describe('MeteorComponent', function() {
  var ngZone;
  var component;

  beforeEach(function() {
    ngZone = ngCore.createNgZone();
    spyOn(ngZone, 'run').and.callThrough();
    component = new MeteorComponent(ngZone);
  });

  describe('implements', function() {
    it('ngOnDestroy', function() {
      expect(component.ngOnDestroy).toBeDefined();
    });
  });

  describe('subscribe', function() {
    beforeEach(function() {
      spyOn(Meteor, 'subscribe').and.returnValue({ stop: _.noop });
    });

    describe('with only name', function() {
      it('should call Meteor.subscribe with only name', function() {
        var args = ['collection'];
        component.subscribe.apply(component, args);
        expect(Meteor.subscribe.calls.count()).toEqual(1);
        expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
      });
    });

    describe('with args', function() {
      it('should call Meteor.subscribe with given name, args', function() {
        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args);
        expect(Meteor.subscribe.calls.count()).toEqual(1);
        expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
      });

      describe('and autoBind true', function() {
        it('should call Meteor.subscribe as usual', function() {
          var args = ['collection', 'foo', 'bar', true];
          component.subscribe.apply(component, args);
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
        });
      });
    });

    describe('with callback', function() {
      it('should call Meteor.subscribe with name, args and callback', function() {
        var callback = jasmine.createSpy();
        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args.concat(callback));
        expect(Meteor.subscribe.calls.count()).toEqual(1);
        expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

        _.last(Meteor.subscribe.calls.mostRecent().args).call();
        expect(callback.calls.count()).toEqual(1);
      });
    });

    describe('with Meteor callbacks object', function() {
      it('should call Meteor.subscribe with name, args and callbacks object', function() {
        var callbacks = {
          onReady: jasmine.createSpy(),
          onStop: jasmine.createSpy(),
          onError: jasmine.createSpy()
        };

        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args.concat(callbacks));
        expect(Meteor.subscribe.calls.count()).toEqual(1);
        expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

        var actualCallbacks = _.last(Meteor.subscribe.calls.mostRecent().args);
        actualCallbacks.onReady();
        actualCallbacks.onError();
        actualCallbacks.onStop();
        expect(callbacks.onReady.calls.count()).toEqual(1);
        expect(callbacks.onError.calls.count()).toEqual(1);
        expect(callbacks.onStop.calls.count()).toEqual(1);
      });
    });

    describe('with callback and autobind', function() {
      describe('autobind off', function() {
        it('should use callback as usual', function() {
          var callback = jasmine.createSpy();
          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callback, false));
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

          _.last(Meteor.subscribe.calls.mostRecent().args).call();
          expect(callback.calls.count()).toEqual(1);
          expect(ngZone.run.calls.count()).toEqual(0);
        });
      });

      describe('autobind on', function() {
        it('should use callback with zone.run', function() {
          var callback = jasmine.createSpy();
          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callback, true));
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

          _.last(Meteor.subscribe.calls.mostRecent().args).call();
          expect(callback.calls.count()).toEqual(1);
          expect(ngZone.run.calls.count()).toEqual(1);
        });
      });
    });

    describe('with callbacks objects and autobind', function() {
      describe('autobind off', function() {
        it('should use callbacks as usual', function() {
          var callbacks = {
            onReady: jasmine.createSpy(),
            onStop: jasmine.createSpy(),
            onError: jasmine.createSpy()
          };

          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callbacks, false));
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

          var actualCallbacks = _.last(Meteor.subscribe.calls.mostRecent().args);
          actualCallbacks.onReady();
          actualCallbacks.onError();
          actualCallbacks.onStop();
          expect(callbacks.onReady.calls.count()).toEqual(1);
          expect(callbacks.onError.calls.count()).toEqual(1);
          expect(callbacks.onStop.calls.count()).toEqual(1);
          expect(ngZone.run.calls.count()).toEqual(0);
        });
      });

      describe('autobind on', function() {
        it('should use callbacks with zone.bind', function() {
          var callbacks = {
            onReady: jasmine.createSpy(),
            onStop: jasmine.createSpy(),
            onError: jasmine.createSpy()
          };

          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callbacks, true));
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

          var actualCallbacks = _.last(Meteor.subscribe.calls.mostRecent().args);
          actualCallbacks.onReady();
          actualCallbacks.onError();
          actualCallbacks.onStop();
          expect(callbacks.onReady.calls.count()).toEqual(1);
          expect(callbacks.onError.calls.count()).toEqual(1);
          expect(callbacks.onStop.calls.count()).toEqual(1);
          expect(ngZone.run.calls.count()).toEqual(3);
        });
      });
    });
  });

  describe('MeteorComponent.call', function() {
    beforeEach(function() {
      spyOn(Meteor, 'call');
    });

    it('Meteor.call should be called with the same args', function() {
      var args = ['collection', 'foo1', 'foo2', true];
      component.call.apply(component, args);
      expect(Meteor.call.calls.count()).toEqual(1);
      expect(Meteor.call.calls.mostRecent().args).toEqual(args);
    });

    it('the method callback should run in the zone if the autobind is true', function() {
      var callback = jasmine.createSpy();
      var args = ['collection', 'foo1', 'foo2'];
      component.call.apply(component, args.concat(callback, true));
      expect(Meteor.call.calls.count()).toEqual(1);
      expect(_.initial(Meteor.call.calls.mostRecent().args)).toEqual(args);

      _.last(Meteor.call.calls.mostRecent().args).call();
      expect(callback.calls.count()).toEqual(1);
      expect(ngZone.run.calls.count()).toEqual(1);
    });
  });
});
