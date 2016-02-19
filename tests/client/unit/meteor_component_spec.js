describe('MeteorComponent', () => {
  var MeteorComponent;
  var ngCore;
  beforeAll(done => {
    System.import('angular2/core').then(ngCore_ => {
      ngCore = ngCore_;
      System.import('angular2-meteor').then(ng2Meteor => {
        MeteorComponent = ng2Meteor.MeteorComponent;
        done();
      });
    });
  });

  var ngZone;
  var component;
  beforeEach(() => {
    ngZone = ngCore.createNgZone();
    spyOn(ngZone, 'run').and.callThrough();
    component = new MeteorComponent(ngZone);
  });

  describe('implements', () => {
    it('ngOnDestroy', () => {
      expect(component.ngOnDestroy).toBeDefined();
    });
  });

  describe('execute subscribe', () => {
    beforeEach(() => {
      spyOn(Meteor, 'subscribe').and.returnValue({ stop: _.noop });
    });

    describe('with only name', () => {
      it('should call Meteor.subscribe with only name', () => {
        var args = ['collection'];
        component.subscribe.apply(component, args);
        expect(Meteor.subscribe.calls.count()).toEqual(1);
        expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
      });
    });

    describe('with arbitrary args', () => {
      it('should call Meteor.subscribe with ' +
          'subscription name and other args', () => {
        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args);
        expect(Meteor.subscribe.calls.count()).toEqual(1);
        expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
      });

      describe('and autoBind true', () => {
        it('should call Meteor.subscribe as usual', () => {
          var args = ['collection', 'foo', 'bar', true];
          component.subscribe.apply(component, args);
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
        });
      });
    });

    describe('with callback', () => {
      it('should call Meteor.subscribe with ' +
          'subscription name, other args and callback', () => {
        var callback = jasmine.createSpy();
        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args.concat(callback));
        expect(Meteor.subscribe.calls.count()).toEqual(1);
        expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

        _.last(Meteor.subscribe.calls.mostRecent().args).call();
        expect(callback.calls.count()).toEqual(1);
      });
    });

    describe('with Meteor callbacks object', () => {
      it('should call Meteor.subscribe with ' +
          'subscription name, other args and callbacks object', () => {
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

    describe('with callback and autobind', () => {
      describe('autobind off', () => {
        it('should use callback as usual', () => {
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

      describe('with autobind on', () => {
        it('should use callback with zone.run', () => {
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

    describe('with callbacks objects', () => {
      describe('and autobind off', () => {
        it('should use callbacks as usual', () => {
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

      describe('and autobind on', () => {
        it('should use callbacks with zone.bind', () => {
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

  describe('call', () => {
    beforeEach(() => {
      spyOn(Meteor, 'call');
    });

    it('Meteor.call should be called with the same args', () => {
      var args = ['collection', 'foo1', 'foo2', true];
      component.call.apply(component, args);
      expect(Meteor.call.calls.count()).toEqual(1);
      expect(Meteor.call.calls.mostRecent().args).toEqual(args);
    });

    it('the method callback should run in the zone ' +
        'if the autobind is true', () => {
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

  describe('autorun', () => {
    beforeEach(() => {
      spyOn(Tracker, 'autorun').and.callThrough();;
    });

    it('should call Tracker.autorun and ' +
        'callback with Tracker.Computation param', () => {
      var spy = jasmine.createSpy();
      component.autorun(spy);

      expect(spy.calls.count()).toEqual(1);
      expect(spy.calls.mostRecent().args[0] instanceof Tracker.Computation).toBe(true);
      expect(Tracker.autorun.calls.count()).toEqual(1);
      expect(ngZone.run.calls.count()).toEqual(0);
    });

    it('should call callback with Tracker.Computation param ' +
        'when autoBind = true', () => {
      var spy = jasmine.createSpy();
      component.autorun(spy, true);

      expect(spy.calls.count()).toEqual(1);
      expect(spy.calls.mostRecent().args[0] instanceof Tracker.Computation).toBe(true);
      expect(Tracker.autorun.calls.count()).toEqual(1);
      expect(ngZone.run.calls.count()).toEqual(1);
    });
  });
});
