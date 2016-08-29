import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {MeteorObservable} from 'angular2-meteor';
import {Observable} from 'rxjs';

const expect = chai.expect;

describe('ZoneOperator', () => {
  it('Should exist on Observable', () => {
    let obs = Observable.create();
    expect(obs.zone).to.be.function;
  });

  it('Should run in the expected zone on the next', done => {
    let gZone = Zone.current;
    let zone = Zone.current.fork({});

    let obs = Observable.create(observer => {
      gZone.run(() => observer.next());
    });
    zone.run(() => {
      obs.zone().subscribe(() => {
        expect(Zone.current).to.equal(zone);
        done();
      });
    });
  });
});
