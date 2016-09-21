
import {MongoCursorObserver} from 'angular2-meteor';
import * as fakes from './lib/fakes';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

const noop = () => {};

describe('MongoCursorObserver', function() {
  let gZone = global.Zone.current;

  let fakeCursor, spy;
  beforeEach(() => {
    fakeCursor = new fakes.MongoCollectionCursorFake();
    spy = sinon.spy(fakeCursor, 'observe');
  });

  afterEach(() => {
    spy.restore();
  });

  it('start observing cursor', function() {
    let observer = new MongoCursorObserver(fakeCursor);
    observer.subscribe();
    expect(spy.calledOnce).to.equal(true);
  });

  it('new docs emitted', function(done) {
    let observer = new MongoCursorObserver(fakeCursor, 0);
    let emit = sinon.spy(observer, 'emit');
    observer.subscribe({ next: noop });

    let doc1 = { id: 'doc1' };
    let doc2 = { id: 'doc2' };
    fakeCursor.add(doc1, 0);
    fakeCursor.add(doc2, 1);

    setTimeout(() => {
      expect(emit.calledOnce).to.equal(true);
      expect(emit.args[0][0][0].item).to.deep.equal(doc1);
      expect(emit.args[0][0][1].item).to.deep.equal(doc2);
      done();
    });
  });

  it('emit is debounced', function(done) {
    let observer = new MongoCursorObserver(fakeCursor, 50);
    let emit = sinon.spy(observer, 'emit');
    observer.subscribe({ next: noop });

    fakeCursor.add({ id: 'doc1' }, 0);
    fakeCursor.add({ id: 'doc2' }, 1);

    setTimeout(() => {
      fakeCursor.remove({ id: 'doc1' }, 0);
      fakeCursor.remove({ id: 'doc2' }, 1);
    });

    setTimeout(() => {
      expect(emit.calledOnce).to.equal(true);
      done();
    }, 100);
  });

  it('angular zone is run after the emit', function(done) {
    let ngZone = gZone.fork({ name: 'angular' });
    let ngZoneSpy = sinon.spy(ngZone, 'run');

    let observer;
    ngZone.run(() => {
      observer = new MongoCursorObserver(fakeCursor, 0);
      observer.subscribe({ next: noop });
    });
    let emit = sinon.spy(observer, 'emit');

    fakeCursor.add({ id: 'doc1' }, 0);
    fakeCursor.add({ id: 'doc2' }, 1);

    setTimeout(() => {
      expect(emit.calledOnce).to.equal(true);
      expect(ngZoneSpy.calledTwice).to.equal(true);
      done();
    });
  });

  it('angular zone has macro taskon the emit', function() {
    let hasMacroTask = false;

    let ngZone = gZone.fork({ name: 'angular',
     onHasTask:
      (delegate: ZoneDelegate, current: Zone,
       target: Zone, hasTaskState: HasTaskState) => {
        if (current == target) {
          if (hasTaskState.change == 'macroTask') {
            hasMacroTask = true;
          }
        }
      }
    });

    let observer;
    ngZone.run(() => {
      observer = new MongoCursorObserver(fakeCursor, 0);
      observer.subscribe({ next: noop });
    });

    fakeCursor.add({ id: 'doc1' }, 0);
    fakeCursor.add({ id: 'doc2' }, 1);

    expect(hasMacroTask).to.be.true;
  });
});
