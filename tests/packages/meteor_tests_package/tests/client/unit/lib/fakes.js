export var MongoCollectionObserverFake = function() {
  this._generators = [];

  this.observer = function(generator) {
    this._generators.push(generator);
  };

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

export var ObserverFactoryFake = function(observer) {
  this._observer = observer;

  var self = this;
  this.create = function(cursor) {
    self.observer = self._observer ||
      new MongoCollectionObserverFake(cursor);
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

  MongoCollectionCursorFake.prototype = Object.create(Mongo.Cursor.prototype);
};