'use strict';

import {Component, LifecycleEvent} from 'angular2/angular2';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

@Component({
  lifecycle: [LifecycleEvent.onDestroy]
})
export class MeteorComponent {
  _hAutoruns: Array<Tracker.Computation>;
  _hSubscribes: Array<Object>;

  constructor() {
    this._hAutoruns = [];
    this._hSubscribes = [];
  }

  autorun(func, autoBind) {
    check(func, Function);

    var hAutorun = Tracker.autorun(autoBind ? zone.bind(func) : func);
    this._hAutoruns.push(hAutorun);
  }

  subscribe() {
    var args = _.toArray(arguments);
    if (args.length) {
      var last = _.last(args);
      if (_.isFunction(last)) {
        args[args.length - 1] = zone.bind(last);
      }
    }
    var hSubscribe = Meteor.subscribe.apply(this, args);
    this._hSubscribes.push(hSubscribe);
  }

  onDestroy() {
    for (var hAutorun of this._hAutoruns) {
      hAutorun.stop();
    }
    for (var hSubscribe of this._hSubscribes) {
      hSubscribe.stop();
    }

    this._hAutoruns = null;
    this._hSubscribes = null;
  }
}
