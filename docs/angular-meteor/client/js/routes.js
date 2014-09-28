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
        })
        .state('tutorial.step01', {
          url: '/step_01',
          template: UiRouter.template('tutorial.step_01.html')
        })
        .state('tutorial.step02', {
          url: '/step_02',
          template: UiRouter.template('tutorial.step_02.html')
        })
        .state('tutorial.step03', {
          url: '/step_03',
          template: UiRouter.template('tutorial.step_03.html')
        })
        .state('tutorial.step04', {
          url: '/step_04',
          template: UiRouter.template('tutorial.step_04.html')
        })
        .state('tutorial.step05', {
          url: '/step_05',
          template: UiRouter.template('tutorial.step_05.html')
        });

    $locationProvider.html5Mode(true);
  }]);