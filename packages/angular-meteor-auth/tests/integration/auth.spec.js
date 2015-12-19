var testedModule = 'angular-meteor.auth';

describe('angular-meteor', function () {
  describe(testedModule, function () {
    beforeEach(angular.mock.module(testedModule));

    var $compile;
    var $rootScope;
    var testScope;

    beforeEach(angular.mock.inject(function (_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      testScope = $rootScope.$new();
    }));

    beforeEach(function(done) {
      Meteor.logout(function() {
        done();
      })
    });

    it('Should put $auth on the rootScope for easy use', function() {
      expect($rootScope.$auth).toBeDefined();
      expect($rootScope.$auth.currentUser).toBeDefined();
      expect($rootScope.$auth.currentUserId).toBeDefined();
      expect($rootScope.$auth.loggingIn).toBeDefined();
    });

    it('Should $auth be available on every scope created', function() {
      var newScope = $rootScope.$new();
      expect(newScope.$auth).toBeDefined();
      expect(newScope.$auth.currentUser).toBeDefined();
      expect(newScope.$auth.currentUserId).toBeDefined();
      expect(newScope.$auth.loggingIn).toBeDefined();
    });

    it('Should $auth be available on every isolated scope created', function() {
      var newScope = $rootScope.$new(true);
      expect(newScope.$auth).toBeDefined();
      expect(newScope.$auth.currentUser).toBeDefined();
      expect(newScope.$auth.currentUserId).toBeDefined();
      expect(newScope.$auth.loggingIn).toBeDefined();
    });

    it('Should currentUser return empty value when there is no user logged in', function() {
      expect($rootScope.currentUser).toBe(null);
    });

    it('Should loggingIn change when logging in', function(done) {
      expect($rootScope.loggingIn).toBe(false);
      Meteor.insecureUserLogin('tempUser', function() {
        expect($rootScope.loggingIn).toBe(true);
        done();
      });
    });

    it('Should loggingIn change when logging out', function(done) {
      expect($rootScope.loggingIn).toBe(false);
      Meteor.insecureUserLogin('tempUser', function() {
        expect($rootScope.loggingIn).toBe(true);

        Meteor.logout(function() {
          expect($rootScope.loggingIn).toBe(false);
          done();
        });
      });
    });
  });
});