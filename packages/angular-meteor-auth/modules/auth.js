angular.module('angular-meteor.auth')


.service('$auth', [
  '$rootScope',
  '$q', 

function ($rootScope, $q) {
  if (!Package['accounts-base'])
    throw Error(
      'Oops, looks like Accounts-base package is missing!' +
      'Please add it by running: meteor add accounts-base'
    );

  this.waitForUser = () => {
    let deferred = $q.defer();

    $rootScope.autorun(() => {
      if (!Meteor.loggingIn()) deferred.resolve(Meteor.user());
    });

    return deferred.promise;
  };

  this.requireUser = () => {
    let deferred = $q.defer();

    $rootScope.autorun(() => {
      if (Meteor.loggingIn()) return;
      let currentUser = Meteor.user();

      if (currentUser)
        deferred.resolve(currentUser);
      else
        deferred.reject("AUTH_REQUIRED");
    });

    return deferred.promise;
  };

  this.requireValidUser = (validate = angular.noop) => {
    if (!_.isFunction(validate))
      throw Error('argument 1 must be a function');

    return this.requireUser().then((user) => {
      let isValid = validate(user);

      if (isValid === true) 
        return $q.resolve(user);
      if (_.isString(isValid))
        return $q.reject(isValid);

      return $q.reject(isValid);
    });
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
  $rootScope.autorun(() => {
    let scopeProto = Object.getPrototypeOf($rootScope);
    let userInfo = $auth.getUserInfo();
    _.extend(scopeProto, { $auth: userInfo });
    _.extend(Reactive, { auth: userInfo });
  });
}]);
