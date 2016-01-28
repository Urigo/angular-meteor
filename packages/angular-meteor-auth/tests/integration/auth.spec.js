describe('angular-meteor.auth', function() {
  beforeEach(angular.mock.module('angular-meteor'));
  beforeEach(angular.mock.module('angular-meteor.auth'));

  var Accounts = Package['accounts-base'].Accounts;
  var $rootScope;

  beforeEach(angular.mock.inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  describe('$$Auth', function() {
    afterEach(function(done) {
      Accounts.logout(done);
    });

    it('should extend child scope', function() {
      var scope = $rootScope.$new();
      expect(scope.currentUser).toBeDefined();
      expect(scope.currentUserId).toBeDefined();
      expect(scope.isLoggingIn).toBeDefined();
      expect(scope.$awaitUser).toEqual(jasmine.any(Function));
    });

    describe('currentUser', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should be correlated with user status', function(done) {
        expect(scope.currentUser).toEqual(null);

        Accounts.login('dummy_user').onEnd(function() {
          expect(scope.currentUser).toEqual({ username: 'dummy_user' });
          done();
        });
      });
    });

    describe('currentUserId', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should be correlated with user status', function(done) {
        expect(scope.currentUserId).toEqual(null);

        Accounts.login('dummy_user').onEnd(function() {
          expect(scope.currentUserId).toEqual(Accounts.userId());
          done();
        });
      })
    });

    describe('isLoggingIn', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should be correlated with user status', function(done) {
        expect(scope.isLoggingIn).toBe(false);

        Accounts.login('dummy_user', function() {
          expect(scope.isLoggingIn).toBe(true);

          Accounts.logout(function() {
            expect(scope.isLoggingIn).toBe(false);
            done();
          });
        });
      });
    });

    describe('$awaitUser()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
        spyOn(Tracker.Computation.prototype, 'stop').and.callThrough();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should return a promise and reject it once user is not logged in', function(done) {
        scope.$awaitUser().catch(function(err) {
          expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
          expect(err).toEqual('AUTH_REQUIRED');
          done();
        });

        scope.$$throttledDigest();
      });

      it('should return a promise and resolve it once a valid user is logged in', function(done) {
        Accounts.login('tempUser', function() {
          var spy = jasmine.createSpy().and.returnValue(true);

          scope.$awaitUser(spy).then(function(user) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(user.username).toEqual('tempUser');
            done();
          });

          scope.$$throttledDigest();
        });
      });

      it('should return a promise and reject it once an invalid user is logged in', function(done) {
        Accounts.login('tempUser', function() {
          var spy = jasmine.createSpy().and.returnValue(false);

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('FORBIDDEN');
            done();
          });

          scope.$$throttledDigest();
        });
      });

      it('should return a custom validation error if validation method returns a string', function(done) {
        Accounts.login('tempUser', function() {
          var spy = jasmine.createSpy().and.returnValue('NOT_ALLOWED');

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual('NOT_ALLOWED');
            done();
          });

          scope.$$throttledDigest();
        });
      });

      it('should return a custom validation error if validation method returns an error', function(done) {
        Accounts.login('tempUser', function() {
          var err = Error();
          var spy = jasmine.createSpy().and.returnValue(err);

          scope.$awaitUser(spy).catch(function(err) {
            expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
            expect(spy).toHaveBeenCalled();
            expect(err).toEqual(err);
            done();
          });

          scope.$$throttledDigest();
        });
      });

      it('should not fulfill promise once auto computation has been stopped', function() {
        var promise = scope.$awaitUser();
        expect(Tracker.Computation.prototype.stop).toHaveBeenCalled();
        promise.stop();
      });
    });
  });
});