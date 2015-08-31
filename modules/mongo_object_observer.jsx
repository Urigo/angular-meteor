import {CursorHandle} from './cursor_handle';

export class MongoObjectObserver {
  _collection: Mongo.Collection;
  _doc: Object;
  _docId: String;

  constructor(collection, docId) {
    check(collection, Mongo.Collection);
    check(docId, String);

    this._collection = collection;
    this._docId = docId;
    this._doc = {};

    this._cursor = this._defineCursor(collection, docId);
    this._assignProps(this._getDocOrDie(this._cursor));

    this._startCursor(this._cursor);
  }

  _getDocOrDie(cursor: Mongo.Cursor<any>) {
    var docs = cursor.fetch();
    if (!docs.length) {
      throw new Error('There is no document with given ID');
    }
    return docs[0];
  }

  save() {
    delete this._doc._id;
    this._collection.update(this._docId, {$set: this._doc});
  }

  _defineCursor(collection, docId) {
    return collection.find(docId);
  }

  _assignProps(doc) {
    Object.assign(this._doc, doc);
    Object.assign(this, doc);
  }

  _startCursor(cursor: Mongo.Cursor<any>) {
    var hCurObserver = this._startCursorObserver(cursor);
    var hAutoNotify = this._startAutoChangesNotify(cursor);
    return new CursorHandle(cursor, hAutoNotify, hCurObserver);
  }

  _startAutoChangesNotify(cursor: Mongo.Cursor<any>) {
    var self = this;
    return Tracker.autorun(zone.bind(() => {
      cursor.fetch();
    }));
  }

  _startCursorObserver(cursor: Mongo.Cursor<any>) {
    var self = this;
    return cursor.observe({
      changedAt: function(nDoc, oDoc, index) {
        self._assignProps(nDoc);
      }
    });
  }
}
