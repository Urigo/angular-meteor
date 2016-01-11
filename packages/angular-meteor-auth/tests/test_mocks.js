(function() {
  // Note that meteor's accounts system requires a minimum interval of 10 seconds between the log-ins
  // which costs some precious time and may cause unexpected behaviours. The following stubs simulate
  // an accounts system and fixes that problem.
  var mockAuth = function()  {
    var authAPI = ['user', 'userId', 'loggingIn'];
    var deps = {};

    var vals = {
      user: null,
      userId: null,
      loggingIn: false
    };

    Meteor.login = function(username, cb) {
      setTimeout(function() {
        vals.loggingIn = true;
        deps.loggingIn.changed();

        Tracker.afterFlush(function() {
          cb();

          setTimeout(function() {
            vals.user = { username: username };
            vals.userId = new Mongo.ObjectID();
            vals.loggingIn = false;

            deps.user.changed();
            deps.userId.changed();
            deps.loggingIn.changed();
          });
        })
      });
    };

    Meteor.logout = function(cb) {
      setTimeout(function() {
        vals.user = null;
        vals.userId = null;
        vals.loggingIn = false;

        deps.user.changed();
        deps.userId.changed();
        deps.loggingIn.changed();

        Tracker.afterFlush(function() {
          cb();
        });
      });
    };

    authAPI.forEach(function(k) {
      deps[k] = new Tracker.Dependency();

      Meteor[k] = function() {
        deps[k].depend();
        return vals[k];
      };
    });
  };

  mockAuth();
})();