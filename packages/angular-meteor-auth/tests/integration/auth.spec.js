var testedModule = 'angular-meteor.auth';

describe('angular-meteor', function () {
  describe(testedModule, function () {
    var $compile;
    var $rootScope;
    var $reactive;
    var $auth;

    beforeEach(angular.mock.module(testedModule));

    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_, _$reactive_, _$auth_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $reactive = _$reactive_;
      $auth = _$auth_;

      spyOn(Tracker.Computation.prototype, 'stop').and.callThrough();
    }));

    afterEach(function (done) {
      $rootScope.$destroy();
      Meteor.logout(done);
    });

    it('Should define $auth on rootScope', function () {
      expect($rootScope.$auth).toBeDefined();
      expect($rootScope.$auth.currentUser).toBeDefined();
      expect($rootScope.$auth.currentUserId).toBeDefined();
      expect($rootScope.$auth.loggingIn).toBeDefined();
    });

    it('Should define $auth on child scopes', function () {
      var $scope = $rootScope.$new();
      expect($scope.$auth).toBeDefined();
      expect($scope.$auth.currentUser).toBeDefined();
      expect($scope.$auth.currentUserId).toBeDefined();
      expect($scope.$auth.loggingIn).toBeDefined();
    });

    it('Should define $auth on isolated child scopes', function () {
      var $scope = $rootScope.$new(true);
      expect($scope.$auth).toBeDefined();
      expect($scope.$auth.currentUser).toBeDefined();
      expect($scope.$auth.currentUserId).toBeDefined();
      expect($scope.$auth.loggingIn).toBeDefined();
    });

    it('Should define auth on reactive contexts', function() {
      var context = $reactive({});
      expect(context.auth).toBeDefined();
      expect(context.auth.currentUser).toBeDefined();
      expect(context.auth.currentUserId).toBeDefined();
      expect(context.auth.loggingIn).toBeDefined();
    });

    describe('currentUser', function() {
      it('Should return null if logged out', function () {
        expect($rootScope.$auth.currentUser).toBe(null);
      });
    });

    describe('currentUserId', function() {
      it('Should return null if logged out', function () {
        expect($rootScope.$auth.currentUserId).toBe(null);
      });
    });

    describe('loggingIn', function() {
      it('Should change when logging in', function (done) {
        expect($rootScope.$auth.loggingIn).toBe(false);

        Meteor.login('tempUser', function () {
          expect(Meteor.loggingIn()).toBe(true);
          expect($rootScope.$auth.loggingIn).toBe(true);
          done();
        });
      });

      it('Should change when logging out', function (done) {
        expect($rootScope.$auth.loggingIn).toBe(false);

        Meteor.login('tempUser', function () {
          expect($rootScope.$auth.loggingIn).toBe(true);

          Meteor.logout(function () {
            expect($rootScope.$auth.loggingIn).toBe(false);
            done();
          });
        });
      });
    });

    describe('waitForUser()', function() {
      it('Should return a promise and resolve it once user logs in', function (done) {
        Meteor.login('tempUser', function () {
          expect($rootScope.loggingIn).toBe(true);

          $auth.waitForUser().then(function (user) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect($rootScope.loggingIn).toBe(false);
            done();
          });
        });
      });

      it('Should not fulfill promise once auto computation has been stopped', function () {
        var promise = $auth.waitForUser();
        expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
        promise.stop();
      });
    });

    describe('requireUser()', function() {
      it('Should return a promise and resolve it once user is logged in', function (done) {
        Meteor.login('tempUser', function () {
          $auth.requireUser().then(function (user) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(user.username).toEqual('tempUser');
            done();
          });
        });
      });

      it('Should return a promise and reject it once user is not logged in', function (done) {
        $auth.requireUser().catch(function (err) {
          expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
          expect(err).toEqual('AUTH_REQUIRED');
          done();
        });

        $rootScope.$apply();
      });

      it('Should not fulfill promise once auto computation has been stopped', function () {
        var promise = $auth.waitForUser();
        expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
        promise.stop();
      });
    });

    describe('requireValidUser()', function() {
      it('Should return a promise and resolve it once a valid user is logged in', function (done) {
        Meteor.login('tempUser', function () {
          var spy = jasmine.createSpy().and.returnValue(true);

          $auth.requireValidUser(spy).then(function (user) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(user.username).toEqual('tempUser');
            done();
          });

          $rootScope.$apply();
        });
      });

      it('Should return a promise and reject it once an invalid user is logged in', function (done) {
        Meteor.login('tempUser', function () {
          var spy = jasmine.createSpy().and.returnValue(false);

          $auth.requireValidUser(spy).catch(function (err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('FORBIDDEN');
            done();
          });

          $rootScope.$apply();
        });
      });

      it('Should return a custom validation error if validation method returns a string', function (done) {
        Meteor.login('tempUser', function () {
          var spy = jasmine.createSpy().and.returnValue('NOT_ALLOWED');

          $auth.requireValidUser(spy).catch(function (err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('NOT_ALLOWED');
            done();
          });

          $rootScope.$apply();
        });
      });

      it('Should not fulfill promise once auto computation has been stopped', function () {
        var promise = $auth.waitForUser();
        expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
        promise.stop();
      });
    });
  });
});
