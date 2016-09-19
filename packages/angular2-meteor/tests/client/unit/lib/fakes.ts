export var MongoCollectionObserverFake = function() {
  this._generators = [];

  this.emit = function(value) {
    for (var i = 0; i < this._generators.length; i++) {
      this._generators[i].next(value);
    }
  };

  this.clear = function() {
    this._generators.length = 0;
  };

  this.destroy = function() {};

  this.subscribe = function(generator) {
    this._generators.push(generator);
  };
};

export class MongoCollectionFake {
  allow() {}
  deny() {}
  insert() {}
  rawCollection() {}
  rawDatabase() {}
  remove() {}
  update() {}
  upsert() {}
  find() {}
  findOne() {}
}

export var ObserverFactoryFake = function(observer) {
  this._observer = observer;

  var self = this;
  this.create = function(cursor) {
    self.observer = self._observer ||
      new MongoCollectionObserverFake();
    return self.observer;
  };
};

export var ObserveHandleFake = function() {
  this.stop = function() {};
};

export var MongoCollectionCursorFake = function() {
  this._generators = [];
  this.handle = new ObserveHandleFake();

  this.observe = function(generator) {
    this._generators.push(generator);
    return this.handle;
  };

  this.fetch = function() {};

  this.add = function(doc, index) {
    for (let generator of this._generators) {
      if (generator.addedAt) {
        generator.addedAt(doc, index);
      }
    }
  }

  this.remove = function(doc, index) {
    for (let generator of this._generators) {
      if (generator.removedAt) {
        generator.removedAt(doc, index);
      }
    }
  }
};

MongoCollectionCursorFake.prototype = Object.create(Mongo.Cursor.prototype);
