"use strict";
var to_observable_1 = require('./to-observable');
var MongoObservable;
(function (MongoObservable) {
    'use strict';
    var Collection = (function () {
        function Collection(name, options) {
            this.collection = new Mongo.Collection(name, options);
        }
        Collection.prototype.allow = function (options) {
            return this.collection.allow.apply(this.collection, arguments);
        };
        Collection.prototype.deny = function (options) {
            return this.collection.deny.apply(this.collection, arguments);
        };
        Collection.prototype.insert = function (doc, callback) {
            return this.collection.insert.apply(this.collection, arguments);
        };
        Collection.prototype.rawCollection = function () {
            return this.collection.rawCollection.apply(this.collection, arguments);
        };
        Collection.prototype.getMongoCollection = function () {
            return this.collection;
        };
        Collection.prototype.rawDatabase = function () {
            return this.collection.rawDatabase.apply(this.collection, arguments);
        };
        Collection.prototype.remove = function (selector, callback) {
            return this.collection.remove.apply(this.collection, arguments);
        };
        Collection.prototype.update = function (selector, modifier, options, callback) {
            return this.collection.update.apply(this.collection, arguments);
        };
        Collection.prototype.upsert = function (selector, modifier, options, callback) {
            return this.collection.upsert.apply(this.collection, arguments);
        };
        Collection.prototype.find = function (selector, options) {
            var cursor = this.collection.find.apply(this.collection, arguments);
            return to_observable_1.toObservable(cursor);
        };
        Collection.prototype.findOne = function (selector, options) {
            return this.collection.findOne.apply(this.collection, arguments);
        };
        return Collection;
    }());
    MongoObservable.Collection = Collection;
})(MongoObservable = exports.MongoObservable || (exports.MongoObservable = {}));
