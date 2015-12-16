angular
  .module('angular-meteor.auth')
  .service('$auth', function ($q, $rootScope, $timeout) {
    class AngularMeteorAuthentication {
      constructor() {
        this.accountsPackage = Package['accounts-base'];

        if (!this.accountsPackage) {
          throw new Error('Oops, looks like Accounts-base package is missing!');
        }
      }

      _autorun() {
        let comp = Tracker.autorun((c) => {
          fn(c);
          if (!c.firstRun) $timeout(angular.noop, 0);
        });

        $rootScope.$on('$destroy', () => {
          comp.stop();
        });

        return comp;
      }

      waitForUser() {
        let deferred = $q.defer();

        this._autorun(() => {
          if (!Meteor.loggingIn()) {
            deferred.resolve(Meteor.user());
          }
        });

        return deferred.promise;
      }

      requireUser() {
        let deferred = $q.defer();

        this._autorun(() => {
          if (!Meteor.loggingIn()) {
            if (Meteor.user() == null) {
              deferred.reject("AUTH_REQUIRED");
            }
            else {
              deferred.resolve(Meteor.user());
            }
          }
        });

        return deferred.promise;
      }

      requireValidUser(validatorFn) {
        validatorFn = validatorFn || angular.noop;

        return this.requireUser().then((user) => {
          let valid = validatorFn(user);

          if (valid === true) {
            return user;
          }
          else if (angular.isString(valid)) {
            return $q.reject(valid);
          }
          else {
            return $q.reject("FORBIDDEN");
          }
        });
      }
    }

    angular.extend(this, new AngularMeteorAuthentication());
  })
.run(($auth, $rootScope) => {
  $auth._autorun(() => {
    if (!Meteor.user) return;

    $rootScope.currentUser = Meteor.user();
    $rootScope.currentUserId = Meteor.userId();
    $rootScope.loggingIn = Meteor.loggingIn();
  });
});