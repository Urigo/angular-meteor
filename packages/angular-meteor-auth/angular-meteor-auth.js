angular.module('angular-meteor.auth', [
  'angular-meteor.mixer',
  'angular-meteor.core',
  'angular-meteor.scope',
  'angular-meteor.view-model',
  'angular-meteor.reactive'
])


.service('$$Auth', [
  '$q',

function($q) {
  let Accounts = (Package['accounts-base'] || {}).Accounts;

  if (!Accounts) throw Error(
    '`angular-meteor.auth` module requires `accounts-base` package, ' +
    'please run `meteor add accounts-base` before use'
  );

  const errors = {
    required: 'AUTH_REQUIRED',
    forbidden: 'FORBIDDEN'
  };

  function $$Auth(vm = this) {
    this.$autorun(() => {
      vm.currentUser = Accounts.user();
      vm.currentUserId = Accounts.userId();
      vm.isLoggingIn = Accounts.loggingIn();;
    });
  }

  $$Auth.$awaitUser = function(validate) {
    validate = validate ? this.$$bind(validate) : angular.noop;

    if (!_.isFunction(validate))
      throw Error('argument 1 must be a function');

    let deferred = $q.defer();

    let computation = this.$autorun((computation) => {
      if (this.$reactivate('isLoggingIn')) return;
      computation.stop();

      let user = this.$$vm.currentUser;
      if (!user) return deferred.reject(errors.required);

      let isValid = validate(user);
      if (isValid == true) return deferred.resolve(user);

      let error;

      if (_.isString(isValid) || isValid instanceof Error)
        error = isValid;
      else
        error = errors.forbidden;

      deferred.reject(error);
    });

    let promise = deferred.promise.finally(() => {
      this.$$throttledDigest();
      computation.stop();
    });

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
