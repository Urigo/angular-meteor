/*
  Note that meteor's accounts system requires a minimum interval of 10 seconds between the log-ins
  which costs some precious time and may cause unexpected behaviours. The following stubs simulate
  an accounts system and fixes that problem.
 */
Package['accounts-base'] = function() {
  var Accounts = {};

  var vals = {
    user: null,
    userId: null,
    loggingIn: false
  };

  var deps = _.keys(vals).reduce(function(deps, k) {
    deps[k] = new Tracker.Dependency();

    Accounts[k] = function() {
      deps[k].depend();
      return vals[k];
    };

    return deps
  }, {});

  Accounts.login = function(username, onStart, onEnd) {
    onStart = onStart || angular.noop;
    onEnd = onEnd || angular.noop;

    var cbs = {
      onStart: function(cb) { onStart = cb },
      onEnd: function(cb) { onEnd = cb }
    };

    setTimeout(function() {
      vals.loggingIn = true;
      deps.loggingIn.changed();

      Tracker.afterFlush(function() {
        onStart();

        setTimeout(function() {
          vals.user = { username: username };
          vals.userId = new Mongo.ObjectID();
          vals.loggingIn = false;

          deps.user.changed();
          deps.userId.changed();
          deps.loggingIn.changed();

          Tracker.afterFlush(onEnd);
        });
      })
    });

    return cbs;
  };

  Accounts.logout = function(cb) {
    setTimeout(function() {
      vals.user = null;
      vals.userId = null;
      vals.loggingIn = false;

      deps.user.changed();
      deps.userId.changed();
      deps.loggingIn.changed();

      Tracker.afterFlush(cb);
    });
  };

  return {
    Accounts: Accounts
  };
}.call(this);