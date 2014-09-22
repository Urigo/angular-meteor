angular.module("meteor-angular-docs").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: '/',
        template: UiRouter.template('main.html'),
        controller: 'MainCtrl'
      })
      .state('tutorial', {
        abstract: true,
        url: '/tutorial',
        template: UiRouter.template('tutorial.html'),
        controller: 'TutorialCtrl'
      })
        .state('tutorial.intro', {
          url: '',
          template: UiRouter.template('tutorial.intro.html')
        })
        .state('tutorial.step00', {
          url: '/step_00',
          template: UiRouter.template('tutorial.step_00.html')
        });

    $locationProvider.html5Mode(true);
  }]);