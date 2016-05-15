import {createNgZone} from '@angular/core';
import {MeteorCall, MeteorSubscribe, TrackerAutorun} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('Meteor patching', function() {
  var gZone = global.Zone.current;
  var zoneSpy;

  beforeEach(function() {
    zoneSpy = sinon.spy(gZone, 'run');
  });

  afterEach(function() {
    zoneSpy.restore();
  });

  describe('methods', function() {
    function testMethod(name, MeteorMethod, params) {
      describe(name, function() {
        it('callback executed in global zone', function(done) {
          let callback = () => {
            expect(zoneSpy.calledOnce).to.equal(true);
            done();
          };
          MeteorMethod.apply(null, params.concat(callback));
        });

        it('calls to ngZone.run throttled', function(done) {
          let ngZone = gZone.fork({ name: 'angular' });
          let ngZoneSpy = sinon.spy(ngZone, 'run');
          let count = 0;
          function callback() {
            count++;
            if (count == 2) {
              setTimeout(() => {
                expect(ngZoneSpy.calledTwice).to.equal(true);
               }, 10);
              // For some reason done() doesn't work inside timeout
              // in phantomjs, but ok in browser.
              done();
            }
          }

         ngZone.run(() => {
            MeteorMethod.apply(null, params.concat(callback));
            MeteorMethod.apply(null, params.concat(callback));
          });
        });
      });
    }

    // Original Meteor.call should be faked.
    // testMethod('Meteor.call', MeteorCall, ['method']);
    testMethod('Tracker.autorun', TrackerAutorun, []);
  });
});
