MongoCollectionObserverFake = function() {
  this._generators = [];

  this.observer = function(generator) {
    this._generators.push(generator);
  };

  this.next = function(value) {
    for (var i = 0; i < this._generators.length; i++) {
      this._generators[i].next(value);
    }
  };

  this.clear = function() {
    this._generators.length = 0;
  };
};

ObserverFactoryFake = function(observer) {
  this._observer = observer;

  this.create = function(cursor) {
    return this._observer;
  };
};

ObserveHandleFake = function() {
  this.stop = function() {};
};

MongoCollectionCursorFake = function() {
  this._generators = [];
  this.handle = new ObserveHandleFake();

  this.observe = function(generator) {
    this._generators.push(generator);
    return this.handle;
  };

  this.fetch = function() {};

  MongoCollectionCursorFake.prototype = Object.create(Mongo.Cursor.prototype);
};