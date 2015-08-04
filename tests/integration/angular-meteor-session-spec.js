describe('$meteorSession service', function () {
  var $meteorSession,
      $rootScope,
      $scope;

  beforeEach(angular.mock.module('angular-meteor'));

  beforeEach(angular.mock.inject(function(_$meteorSession_, _$rootScope_) {
    $meteorSession = _$meteorSession_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  it('should update the scope variable when session variable changes', function () {
    Session.set('myVar', 3);
    $meteorSession('myVar').bind($scope, 'myVar');

    Session.set('myVar', 4);
    Tracker.flush(); // get the computations to run

    expect($scope.myVar).toEqual(4);
  });

  it('should update the session variable when the scope variable changes', function() {
    $scope.myVar = 3;
    $meteorSession('myVar').bind($scope, 'myVar');

    $scope.myVar = 4;
    $rootScope.$apply();

    expect(Session.get('myVar')).toEqual(4);
  });


  it('should update the scope variable nested property when session variable changes', function () {
    Session.set('myVar', 3);
    $scope.a ={
      b:{
        myVar: 3
      }
    };

    $meteorSession('myVar').bind($scope, 'a.b.myVar');

    Session.set('myVar', 4);
    Tracker.flush(); // get the computations to run

    expect($scope.a.b.myVar).toEqual(4);
  });

  it('should update the session variable when the scope variable nested property changes', function() {
    $scope.a ={
      b:{
        myVar: 3
      }
    };
    $meteorSession('myVar').bind($scope, 'a.b.myVar');

    $scope.a.b.myVar = 4;
    $rootScope.$apply();

    expect(Session.get('myVar')).toEqual(4);
  });
});
