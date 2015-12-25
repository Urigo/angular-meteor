var testedModule = 'angular-meteor.auth';

describe('angular-meteor', function () {
  describe(testedModule, function () {
    beforeEach(angular.mock.module(testedModule));

    var $compile;
    var $rootScope;
    var testScope;
    var $auth;

    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_, _$auth_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      testScope = $rootScope.$new();
      $auth = _$auth_;
    }));

    afterEach(function (done) {
      $rootScope.$destroy();

      Meteor.logout(function () {
        done();
      });
    });

    it('Should put $auth on the rootScope for easy use', function () {
      expect($rootScope.$auth).toBeDefined();
      expect($rootScope.$auth.currentUser).toBeDefined();
      expect($rootScope.$auth.currentUserId).toBeDefined();
      expect($rootScope.$auth.loggingIn).toBeDefined();
    });

    it('Should $auth be available on every scope created', function () {
      var newScope = $rootScope.$new();
      expect(newScope.$auth).toBeDefined();
      expect(newScope.$auth.currentUser).toBeDefined();
      expect(newScope.$auth.currentUserId).toBeDefined();
      expect(newScope.$auth.loggingIn).toBeDefined();
    });

    it('Should $auth be available on every isolated scope created', function () {
      var newScope = $rootScope.$new(true);
      expect(newScope.$auth).toBeDefined();
      expect(newScope.$auth.currentUser).toBeDefined();
      expect(newScope.$auth.currentUserId).toBeDefined();
      expect(newScope.$auth.loggingIn).toBeDefined();
    });

    it('Should currentUser return empty value when there is no user logged in', function () {
      expect($rootScope.$auth.currentUser).toBe(null);
    });

    it('Should loggingIn change when logging in', function (done) {
      expect($rootScope.$auth.loggingIn).toBe(false);
      Meteor.insecureUserLogin('tempUser', function () {
        expect($rootScope.$auth.loggingIn).toBe(true);
        done();
      });
    });

    it('Should loggingIn change when logging out', function (done) {
      expect($rootScope.$auth.loggingIn).toBe(false);
      Meteor.insecureUserLogin('tempUser', function () {
        expect($rootScope.$auth.loggingIn).toBe(true);

        Meteor.logout(function () {
          expect($rootScope.$auth.loggingIn).toBe(false);
          done();
        });
      });
    });

    it('Should waitForUser return a promise and resolve it when user logs in', function (done) {
      var promise = $auth.waitForUser();

      promise.then(function () {
        done();
      });

      Meteor.insecureUserLogin('tempUser', function () {
        expect($rootScope.loggingIn).toBe(true);
        $rootScope.$apply();
      });
    });

    it('Should requireUser return a promise and reject it immediately when user is not logged in', function (done) {
      var promise = $auth.requireUser();

      promise.then(angular.noop, function () {
        done();
      });

      $rootScope.$apply();
    });

    it('Should requireUser return a promise and resolve it immediately when user is logged in', function (done) {
      Meteor.insecureUserLogin('tempUser', function () {
        $rootScope.$apply();

        var promise = $auth.requireUser();

        promise.then(function () {
          done();
        });

        $rootScope.$apply();
      });
    });

    it('Should requireValidUser return a promise and resolve it immediately when user is logged in with the validation method', function (done) {
      Meteor.insecureUserLogin('tempUser', function () {
        $rootScope.$apply();

        var spy = jasmine.createSpy().and.returnValue(true);
        var promise = $auth.requireValidUser(spy);

        promise.then(function () {
          expect(spy).toHaveBeenCalled();
          done();
        });

        $rootScope.$apply();
      });
    });

    it('Should requireValidUser return a promise and reject it immediately when user is logged in and validation method return false', function (done) {
      Meteor.insecureUserLogin('tempUser', function () {
        $rootScope.$apply();

        var spy = jasmine.createSpy().and.returnValue(false);
        var promise = $auth.requireValidUser(spy);

        promise.then(angular.noop, function () {
          done();
        });

        $rootScope.$apply();
      });
    });
  });
});