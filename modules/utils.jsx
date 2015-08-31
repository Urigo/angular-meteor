'use strict';

export function zoneAutorun(func) {
  check(func, Function);

  return Tracker.autorun(zone.bind(() => {
    func();
  }));
};
