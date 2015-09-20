describe('MeteorComponent', function() {
  var MeteorComponent;
  var component;

  beforeAll(function(done) {
    System.import('angular2-meteor').then(function(ngMeteor2) {
      MeteorComponent = ngMeteor2.MeteorComponent;
      done();
    });
  });

  beforeEach(function() {
    component = new MeteorComponent();
  });

  describe('#subscribe()', function() {
    describe('overloadings', function() {
      beforeEach(function() {
        spyOn(Meteor, 'subscribe').and.returnValue({ stop: _.noop });
        spyOn(zone, 'bind').and.callFake(function(fn) { return fn; });
      });

      describe('given name', function() {
        it('should call Meteor.subscribe with given name', function() {
          var args = ['collection'];
          component.subscribe.apply(component, args);
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
        });
      });

      describe('given name, args', function() {
        it('should call Meteor.subscribe with given name, args', function() {
          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args);
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
        });

        describe('last arg is a boolean', function() {
          it('should call Meteor,subscribe as usual', function() {
            var args = ['collection', 'foo', 'bar', true];
            component.subscribe.apply(component, args);
            expect(Meteor.subscribe.calls.count()).toEqual(1);
            expect(Meteor.subscribe.calls.mostRecent().args).toEqual(args);
          });
        });
      });

      describe('given name, args, callback', function() {
        it('should call Meteor.subscribe with the given name, args, callback', function() {
          var callback = jasmine.createSpy();
          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callback));
          expect(Meteor.subscribe.calls.count()).toEqual(1);
          expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

          _.last(Meteor.subscribe.calls.mostRecent().args).call();
          expect(callback.calls.count()).toEqual(1);
        });
      });

      describe('given name, args, callbacks', function() {
        it('should call Meteor.Subscribe with the given name, args, callbacks', function() {
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

      describe('given name, args, callback, autobind', function() {
        describe('autobind off', function() {
          it('should use callback as usual', function() {
            var callback = jasmine.createSpy();
            var args = ['collection', 'foo', 'bar'];
            component.subscribe.apply(component, args.concat(callback, false));
            expect(Meteor.subscribe.calls.count()).toEqual(1);
            expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

            _.last(Meteor.subscribe.calls.mostRecent().args).call();
            expect(callback.calls.count()).toEqual(1);
            expect(zone.bind.calls.count()).toEqual(0);
          });
        });

        describe('autobind on', function() {
          it('should use callback with zone.bind', function() {
            var callback = jasmine.createSpy();
            var args = ['collection', 'foo', 'bar'];
            component.subscribe.apply(component, args.concat(callback, true));
            expect(Meteor.subscribe.calls.count()).toEqual(1);
            expect(_.initial(Meteor.subscribe.calls.mostRecent().args)).toEqual(args);

            _.last(Meteor.subscribe.calls.mostRecent().args).call();
            expect(callback.calls.count()).toEqual(1);
            expect(zone.bind.calls.count()).toEqual(1);
          });
        });
      });

      describe('given name, args, callbacks, autobind', function() {
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
            expect(zone.bind.calls.count()).toEqual(0);
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
            expect(zone.bind.calls.count()).toEqual(3);
          });
        });
      });
    });
  });
});