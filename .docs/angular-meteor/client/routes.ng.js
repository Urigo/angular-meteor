angular.module("meteor-angular-docs").config(
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: '/',
        template: UiRouter.template('main.html'),
        controller: 'MainCtrl'
      })
      .state('about', {
        url: '/about',
        template: UiRouter.template('about.html')
      })
      .state('manifest', {
        url: '/manifest',
        template: UiRouter.template('manifest.html')
      })
      .state('server', {
        url: '/server',
        template: UiRouter.template('server.html')
      })
        .state('server.base', {
          url: '/base',
          template: UiRouter.template('server-base.html')
        })
        .state('server.base.bootstrapping', {
          url: '/bootstrapping',
          template: UiRouter.template('server.bootstrapping.html')
        })
        .state('server.base.di', {
          url: '/di',
          template: UiRouter.template('server.di.html')
        })
        .state('server.base.api', {
          url: '/api',
          template: UiRouter.template('server.api.html')
        })
      .state('angular2', {
        url: '/angular2',
        template: UiRouter.template('angular2.html')
      })
      .state('api', {
        url: '/api',
        template: UiRouter.template('api.html')
      })
        .state('api.collection', {
          url: '/collection',
          template: UiRouter.template('api.collection.html')
        })
        .state('api.meteorCollection', {
          url: '/meteorCollection',
          template: UiRouter.template('api.meteorCollection.html')
        })
        .state('api.meteorObject', {
          url: '/meteorObject',
          template: UiRouter.template('api.meteorObject.html')
        })
        .state('api.collection-bind', {
          url: '/collection-bind',
          template: UiRouter.template('api.collection-bind.html')
        })
        .state('api.collection-bindOne', {
          url: '/collection-bindOne',
          template: UiRouter.template('api.collection-bindOne.html')
        })
        .state('api.AngularMeteorCollection', {
          url: '/AngularMeteorCollection',
          template: UiRouter.template('api.AngularMeteorCollection.html')
        })
        .state('api.AngularMeteorObject', {
          url: '/AngularMeteorObject',
          template: UiRouter.template('api.AngularMeteorObject.html')
        })
        .state('api.subscribe', {
          url: '/subscribe',
          template: UiRouter.template('api.subscribe.html')
        })
        .state('api.session', {
          url: '/session',
          template: UiRouter.template('api.session.html')
        })
        .state('api.methods', {
          url: '/methods',
          template: UiRouter.template('api.methods.html')
        })
        .state('api.auth', {
          url: '/auth',
          template: UiRouter.template('api.auth.html')
        })
        .state('api.getReactively', {
          url: '/getReactively',
          template: UiRouter.template('api.getReactively.html')
        })
        .state('api.meteor-include', {
          url: '/meteor-include',
          template: UiRouter.template('api.meteor-include.html')
        })
        .state('api.collectionfs', {
          url: '/collectionfs',
          template: UiRouter.template('api.collectionfs.html')
        })
        .state('api.utils', {
          url: '/utils',
          template: UiRouter.template('api.utils.html')
        })
        .state('api.camera', {
          url: '/camera',
          template: UiRouter.template('api.camera.html')
        })
        .state('api.collection-pagination', {
          url: '/collection-pagination',
          template: UiRouter.template('api.collection-pagination.html')
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
        })
        .state('tutorial.step06', {
          url: '/step_06',
          template: UiRouter.template('tutorial.step_06.html')
        })
        .state('tutorial.step07', {
          url: '/step_07',
          template: UiRouter.template('tutorial.step_07.html')
        })
        .state('tutorial.step08', {
          url: '/step_08',
          template: UiRouter.template('tutorial.step_08.html')
        })
        .state('tutorial.step09', {
          url: '/step_09',
          template: UiRouter.template('tutorial.step_09.html')
        })
        .state('tutorial.step10', {
          url: '/step_10',
          template: UiRouter.template('tutorial.step_10.html')
        })
        .state('tutorial.step11', {
          url: '/step_11',
          template: UiRouter.template('tutorial.step_11.html')
        })
        .state('tutorial.step12', {
          url: '/step_12',
          template: UiRouter.template('tutorial.step_12.html')
        })
        .state('tutorial.step13', {
          url: '/step_13',
          template: UiRouter.template('tutorial.step_13.html')
        })
        .state('tutorial.step14', {
          url: '/step_14',
          template: UiRouter.template('tutorial.step_14.html')
        })
        .state('tutorial.step15', {
          url: '/step_15',
          template: UiRouter.template('tutorial.step_15.html')
        })
        .state('tutorial.step16', {
          url: '/step_16',
          template: UiRouter.template('tutorial.step_16.html')
        })
        .state('tutorial.step17', {
          url: '/step_17',
          template: UiRouter.template('tutorial.step_17.html')
        })
        .state('tutorial.step18', {
          url: '/step_18',
          template: UiRouter.template('tutorial.step_18.html')
        })
        .state('tutorial.step19', {
          url: '/step_19',
          template: UiRouter.template('tutorial.step_19.html')
        })
        .state('tutorial.next_steps', {
          url: '/next_steps',
          template: UiRouter.template('tutorial.next_steps.html')
        });

    $locationProvider.html5Mode(true);
  })

 .run(function($rootScope) {
   $rootScope.$on('$stateChangeSuccess', function() {
     window.scrollTo(0, 0);
   })
 });
