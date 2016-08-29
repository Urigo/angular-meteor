"use strict";
var rxjs_1 = require('rxjs');
var observable_cursor_1 = require('./observable-cursor');
var MongoObservable;
(function (MongoObservable) {
    'use strict';
    var Collection = (function () {
        function Collection(name, options) {
            this._collection = new Mongo.Collection(name, options);
        }
        Object.defineProperty(Collection.prototype, "collection", {
            get: function () {
                return this._collection;
            },
            enumerable: true,
            configurable: true
        });
        Collection.prototype.allow = function (options) {
            return this._collection.allow(options);
        };
        Collection.prototype.deny = function (options) {
            return this._collection.deny(options);
        };
        Collection.prototype.rawCollection = function () {
            return this._collection.rawCollection();
        };
        Collection.prototype.rawDatabase = function () {
            return this._collection.rawDatabase();
        };
        Collection.prototype.insert = function (doc) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.insert(doc, function (error, docId) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(docId);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.remove = function (selector) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.remove(selector, function (error, removed) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(removed);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.update = function (selector, modifier, options) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.update(selector, modifier, options, function (error, updated) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(updated);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.upsert = function (selector, modifier, options) {
            var observers = [];
            var obs = this._createObservable(observers);
            this._collection.upsert(selector, modifier, options, function (error, affected) {
                observers.forEach(function (observer) {
                    error ? observer.error(error) :
                        observer.next(affected);
                    observer.complete();
                });
            });
            return obs;
        };
        Collection.prototype.find = function (selector, options) {
            var cursor = this._collection.find(selector, options);
            return observable_cursor_1.ObservableCursor.create(cursor);
        };
        Collection.prototype.findOne = function (selector, options) {
            return this._collection.findOne(selector, options);
        };
        Collection.prototype._createObservable = function (observers) {
            return rxjs_1.Observable.create(function (observer) {
                observers.push(observer);
                return function () {
                    var index = observers.indexOf(observer);
                    if (index !== -1) {
                        observers.splice(index, 1);
                    }
                };
            });
        };
        return Collection;
    }());
    MongoObservable.Collection = Collection;
})(MongoObservable = exports.MongoObservable || (exports.MongoObservable = {}));
