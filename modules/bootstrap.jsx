'use strict';

import * as ng2 from 'angular2/angular2';

import {defaultIterableDiffers} from 'angular2/change_detection';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

export function bootstrap(classFn, bindings) {
  var newBindings = bindings || [];
  if (_.isUndefined(bindings) || _.isArray(bindings)) {
    var factories = defaultIterableDiffers.factories;
    if (factories) {
      factories.push(new MongoCursorDifferFactory());
    }
    newBindings.push(ng2.bind(ng2.IterableDiffers).toValue(
      new ng2.IterableDiffers(factories)
    ));
  }
  ng2.bootstrap(classFn, newBindings);
}