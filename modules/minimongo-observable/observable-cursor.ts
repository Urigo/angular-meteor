import {Observable, Subscriber} from 'rxjs';

export class ObservableCursor<T> extends Observable<T> {
  public _cursorRef;
  public _reloadRef;
  private _isReactive : boolean = true;

  static create(subscribe?: <R>(subscriber: Subscriber<R>) => any) {
    return new ObservableCursor(subscribe);
  }

  constructor(subscribe?: <R>(subscriber: Subscriber<R>) => any) {
    super(subscribe);
  }

  public nonReactive() : ObservableCursor<T> {
    this._isReactive = false;

    return this;
  }

  public isReactive() : boolean {
    return this._isReactive;
  }

  public getMongoCursor() : Mongo.Cursor<T> {
    return this._cursorRef;
  }

  public reload() : ObservableCursor<T> {
    if (!this.isReactive() && this._reloadRef) {
      this._reloadRef();

      return this;
    } else {
      throw new Error(
        `"reload" method only available when using non-reactive Observable Mongo.Cursor!`
      );
    }
  }
}
