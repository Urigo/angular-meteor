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
  });
});