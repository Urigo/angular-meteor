import {Observable, Subscriber} from 'rxjs';

export class ObservableMeteorSubscription<T> extends Observable<T> {
  public _meteorSubscriptionRef : Meteor.SubscriptionHandle;

  static create(subscribe?: <R>(subscriber: Subscriber<R>) => any) {
    return new ObservableMeteorSubscription(subscribe);
  }

  constructor(subscribe?: <R>(subscriber: Subscriber<R>) => any) {
    super(subscribe);
  }

  stop() {
    if (this._meteorSubscriptionRef && this._meteorSubscriptionRef.stop) {
      this._meteorSubscriptionRef.stop();
    }
  }
}
