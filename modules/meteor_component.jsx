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

  subscribe(name, ...args /*, callback|callbacks, autobind*/) {
    var autobind = args[args.length - 1];
    var callbacks;

    if (_.isBoolean(autobind)) {
      callbacks = createSubscribeCallbacks(args[args.length - 2], autobind);
      if (callbacks) args.splice(-2);
    }
    else {
      callbacks = createSubscribeCallbacks(autobind);
      if (callbacks) args.pop();
    }

    var superArgs = _.compact([name, ...args, callbacks]);
    var hSubscribe = Meteor.subscribe(...superArgs);
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

var subscribeEvents = ['onReady', 'onError', 'onStop'];

var createSubscribeCallbacks = (callbacks, autobind) => {
  var bind = autobind ? zone.bind.bind(zone) : _.identity;

  if (_.isFunction(callbacks))
    return bind(callbacks);

  if (isSubscribeCallbacks(callbacks))
    return subscribeEvents.reduce((boundCallbacks, event) => {
      boundCallbacks[event] = bind(callbacks[event]);
      return boundCallbacks;
    }, {});
};

var isSubscribeCallbacks = (callbacks) => {
  return callbacks && subscribeEvents.some((event) => {
    return _.isFunction(callbacks[event]);
  });
};
