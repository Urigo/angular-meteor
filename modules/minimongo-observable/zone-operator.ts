'use strict';

import {Observable, Operator, Subscriber} from 'rxjs';
import {TeardownLogic} from 'rxjs/Subscription';

export function zone<T>(zone?: Zone): Observable<T> {
  return this.lift(new ZoneOperator(zone || Zone.current));
}

class ZoneOperator<T> implements Operator<T, T> {
  constructor(private zone: Zone) {}

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source._subscribe(new ZoneSubscriber(subscriber, this.zone));
  }
}

class ZoneSubscriber<T> extends Subscriber<T> {
  constructor(destination: Subscriber<T>,
              private zone: Zone) {
    super(destination);
  }

  protected _next(value: T) {
    this.zone.run(() => {
      this.destination.next(value);
    });
  }

  protected _error(err?: any) {
    this.zone.run(() => {
      this.destination.error(err);
    });
  }
}

export interface ZoneSignature<T> {
  (zone?: Zone): Observable<T>;
}

Observable.prototype.zone = zone;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    zone: ZoneSignature<T>;
  }
}
