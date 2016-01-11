angular.module('angular-meteor.auth')


.service('$auth', [
  '$rootScope',
  '$q', 

function($rootScope, $q) {
  if (!Package['accounts-base'])
    throw Error(
      'Oops, looks like Accounts-base package is missing!' +
      'Please add it by running: meteor add accounts-base'
    );

  this.waitForUser = () => {
    let deferred = $q.defer();

    let promise = deferred.promise.finally(() => {
      $rootScope._throttledDigest();
    });

    var c = Meteor.autorun((c) => {
      if (Meteor.loggingIn()) return;

      c.stop();
      deferred.resolve(Meteor.user());
      $rootScope._throttledDigest();
    });

    promise.stop = c.stop.bind(c);
    return promise;
  };

  this.requireUser = (c) => {
    let waiting = this.waitForUser();

    let promise = waiting.then((currentUser) => {
      if (currentUser)
        return $q.resolve(currentUser);

      return $q.reject('AUTH_REQUIRED');
    });

    promise.stop = waiting.stop;
    return promise;
  };

  this.requireValidUser = (validate = angular.noop) => {
    if (!_.isFunction(validate))
      throw Error('argument 1 must be a function');

    let requiring = this.requireUser();

    let promise = requiring.then((user) => {
      if (user === 'AUTH_REQUIRED')
        return $q.reject(user);

      let isValid = validate(user);

      if (isValid === true)
        return $q.resolve(user);

      isValid = _.isString(isValid) ? isValid : "FORBIDDEN";
      return $q.reject(isValid);
    });

    promise.stop = requiring.stop;
    return promise;
  };

  this.getUserInfo = () => {
    return {
      currentUser: Meteor.user(),
      currentUserId: Meteor.userId(),
      loggingIn: Meteor.loggingIn()
    };
  };
}])


.run([
  '$rootScope',
  '$auth',
  '$reactive',

function($rootScope, $auth, Reactive) {
  Tracker.autorun(() => {
    let scopeProto = Object.getPrototypeOf($rootScope);
    let userInfo = $auth.getUserInfo();
    _.extend(scopeProto, { $auth: userInfo });
    _.extend(Reactive, { auth: userInfo });
  });
}]);
