angular.module('angular-meteor.auth', [
  'angular-meteor.mixer',
  'angular-meteor.view-model',
  'angular-meteor.core',
  'angular-meteor.reactive'
])


/*
  A mixin which is provided with authentication related properties and methods
 */
.service('$$Auth', [
  '$q',

function($q) {
  const Accounts = (Package['accounts-base'] || {}).Accounts;

  if (!Accounts) throw Error(
    '`angular-meteor.auth` module requires `accounts-base` package, ' +
    'please run `meteor add accounts-base` before use'
  );

  const errors = {
    required: 'AUTH_REQUIRED',
    forbidden: 'FORBIDDEN'
  };

  function $$Auth(vm = this) {
    // reset auth properties
    this.$autorun(() => {
      vm.currentUser = Accounts.user();
      vm.currentUserId = Accounts.userId();
      vm.isLoggingIn = Accounts.loggingIn();;
    });
  }

  // Waits for user to finish the login process. Gets an optional validation function which
  // will validate if the current user is valid or not. Returns a promise which will be rejected
  // once login has failed or user is not valid, otherwise it will be resolved with the current
  // user
  $$Auth.$awaitUser = function(validate) {
    validate = validate ? this.$$bind(validate) : angular.noop;

    if (!_.isFunction(validate))
      throw Error('argument 1 must be a function');

    let deferred = $q.defer();

    let computation = this.$autorun((computation) => {
      if (this.$reactivate('isLoggingIn')) return;
      // Stop computation once a user has logged in
      computation.stop();

      let user = this.$$vm.currentUser;
      if (!user) return deferred.reject(errors.required);

      let isValid = validate(user);
      // Resolve the promise if validation has passed
      if (isValid == true) return deferred.resolve(user);

      let error;

      if (_.isString(isValid) || isValid instanceof Error)
        error = isValid;
      else
        error = errors.forbidden;

      deferred.reject(error);
    });

    // Once promise has been fulfilled, digest
    let promise = deferred.promise.finally(this.$$throttledDigest.bind(this));
    promise.stop = computation.stop.bind(computation);
    return promise;
  };

  return $$Auth;
}])


.run([
  '$$Mixer',
  '$$Auth',

function($$Mixer, $$Auth) {
  $$Mixer.mixin($$Auth);
}]);
