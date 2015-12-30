Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  seoTitle: 'angular-meteor',
  seoAuthor: 'Uri Goldshtein',
  seoDesc: 'angular-meteor is a realtime full stack that combines the best frameworks. use your existing Angular applications with Meteor - the best backend framework for AngularJS applications.',
  seoType: 'website',
  seoImage: 'https://angular-meteor.com/images/logo-large.png',
  seoTwitter: '@urigoldshtein'
});

if (Meteor.isClient) {
  Router.onAfterAction(setSeo);
  Router.onAfterAction(scrollToTop);
}

Router.map(function () {
  var self = this;


  // -------------------------------------------------------------------------
  // Home page
  //

  self.route('home', {
    path: '/',
    seoTitle: 'angular-meteor'
  });

  self.route('angular2', {
    path: '/angular2',
    template: 'angular2',
    seoTitle: 'Angular 2.0 Meteor'
  });

  self.route('manifesto', {
    path: '/manifesto',
    template: 'manifesto',
    seoTitle: 'Angular Meteor Manifesto'
  });

  // Redirect old link
  redirect('/manifest', '/manifesto');

  self.route('about', {
    path: '/about',
    template: 'about.html',
    seoTitle: 'About Angular Meteor'
  });

  // -------------------------------------------------------------------------
  // Tutorial routes
  //

  createSubRoutes(TUTORIALS);

  redirect('/tutorials', '/tutorials/socially');
  redirect('/tutorial', '/tutorials/socially');
  redirect('/tutorialIntro', '/tutorials/socially');
  // Redirecting old links to Socially Angular 1

  redirect('/tutorial/step_00', '/tutorials/socially/angular1/bootstrapping');
  redirect('/tutorial/step_01', '/tutorials/socially/angular1/static-template');
  redirect('/tutorial/step_02', '/tutorials/socially/angular1/dynamic-template');
  redirect('/tutorial/step_03', '/tutorials/socially/angular1/3-way-data-binding');
  redirect('/tutorial/step_04', '/tutorials/socially/angular1/adding-removing-objects-and-angular-event-handling');
  redirect('/tutorial/step_05', '/tutorials/socially/angular1/routing-and-multiple-views');
  redirect('/tutorial/step_06', '/tutorials/socially/angular1/bind-one-object');
  redirect('/tutorial/step_07', '/tutorials/socially/angular1/folder-structure');
  redirect('/tutorial/step_08', '/tutorials/socially/angular1/user-accounts-authentication-and-permissions');
  redirect('/tutorial/step_09', '/tutorials/socially/angular1/privacy-and-publish-subscribe-functions');
  redirect('/tutorial/step_10', '/tutorials/socially/angular1/deploying-your-app');
  redirect('/tutorial/step_11', '/tutorials/socially/angular1/running-your-app-on-android-or-ios-with-phoneGap');
  redirect('/tutorial/step_12', '/tutorials/socially/angular1/search-sort-pagination-and-reactive-vars');
  redirect('/tutorial/step_13', '/tutorials/socially/angular1/using-and-creating-angularjs-filters');
  redirect('/tutorial/step_14', '/tutorials/socially/angular1/meteor-methods-with-promises');
  redirect('/tutorial/step_15', '/tutorials/socially/angular1/conditional-template-directives-with-angularjs');
  redirect('/tutorial/step_16', '/tutorials/socially/angular1/google-maps');
  redirect('/tutorial/step_17', '/tutorials/socially/angular1/css-less-and-bootstrap');
  redirect('/tutorial/step_18', '/tutorials/socially/angular1/angular-material-and-custom-angular-auth-forms');
  redirect('/tutorial/step_19', '/tutorials/socially/angular1/3rd-party-libraries');
  redirect('/tutorial/step_20', '/tutorials/socially/angular1/handling-files-with-collectionfs');

  // Redirecting old links to Socially Angular 1
  redirect('/tutorials/angular1', '/tutorials/socially/angular1');
  redirect('/tutorials/angular1/bootstrapping', '/tutorials/socially/angular1/bootstrapping');
  redirect('/tutorials/angular1/static-template', '/tutorials/socially/angular1/static-template');
  redirect('/tutorials/angular1/dynamic-template', '/tutorials/socially/angular1/dynamic-template');
  redirect('/tutorials/angular1/3-way-data-binding', '/tutorials/socially/angular1/3-way-data-binding');
  redirect('/tutorials/angular1/adding-removing-objects-and-angular-event-handling', '/tutorials/socially/angular1/adding-removing-objects-and-angular-event-handling');
  redirect('/tutorials/angular1/routing-and-multiple-views', '/tutorials/socially/angular1/routing-and-multiple-views');
  redirect('/tutorials/angular1/bind-one-object', '/tutorials/socially/angular1/bind-one-object');
  redirect('/tutorials/angular1/folder-structure', '/tutorials/socially/angular1/folder-structure');
  redirect('/tutorials/angular1/user-accounts-authentication-and-permissions', '/tutorials/socially/angular1/user-accounts-authentication-and-permissions');
  redirect('/tutorials/angular1/privacy-and-publish-subscribe-functions', '/tutorials/socially/angular1/privacy-and-publish-subscribe-functions');
  redirect('/tutorials/angular1/deploying-your-app', '/tutorials/socially/angular1/deploying-your-app');
  redirect('/tutorials/angular1/running-your-app-on-android-or-ios-with-phoneGap', '/tutorials/socially/angular1/running-your-app-on-android-or-ios-with-phoneGap');
  redirect('/tutorials/angular1/search-sort-pagination-and-reactive-vars', '/tutorials/socially/angular1/search-sort-pagination-and-reactive-vars');
  redirect('/tutorials/angular1/using-and-creating-angularjs-filters', '/tutorials/socially/angular1/using-and-creating-angularjs-filters');
  redirect('/tutorials/angular1/meteor-methods-with-promises', '/tutorials/socially/angular1/meteor-methods-with-promises');
  redirect('/tutorials/angular1/conditional-template-directives-with-angularjs', '/tutorials/socially/angular1/conditional-template-directives-with-angularjs');
  redirect('/tutorials/angular1/google-maps', '/tutorials/socially/angular1/google-maps');
  redirect('/tutorials/angular1/css-less-and-bootstrap', '/tutorials/socially/angular1/css-less-and-bootstrap');
  redirect('/tutorials/angular1/angular-material-and-custom-angular-auth-forms', '/tutorials/socially/angular1/angular-material-and-custom-angular-auth-forms');
  redirect('/tutorials/angular1/3rd-party-libraries', '/tutorials/socially/angular1/3rd-party-libraries');
  redirect('/tutorials/angular1/handling-files-with-collectionfs', '/tutorials/socially/angular1/handling-files-with-collectionfs');
  redirect('/tutorials/angular1/mobile-support-and-packages-isolation', '/tutorials/socially/angular1/mobile-support-and-packages-isolation');
  redirect('/tutorials/angular1/ionic', '/tutorials/socially/angular1/ionic');
  redirect('/tutorials/angular1/next-steps', '/tutorials/socially/angular1/next-steps');

  // Redirecting old links to Socially Angular 2
  redirect('/tutorials/angular2', '/tutorials/socially/angular2');
  redirect('/tutorials/angular2/bootstrapping', '/tutorials/socially/angular2/bootstrapping');
  redirect('/tutorials/angular2/static-template', '/tutorials/socially/angular2/static-template');
  redirect('/tutorials/angular2/dynamic-template', '/tutorials/socially/angular2/dynamic-template');
  redirect('/tutorials/angular2/3-way-data-binding', '/tutorials/socially/angular2/3-way-data-binding');
  redirect('/tutorials/angular2/adding-removing-objects-and-angular-event-handling', '/tutorials/socially/angular2/adding-removing-objects-and-angular-event-handling');
  redirect('/tutorials/angular2/routing-and-multiple-views', '/tutorials/socially/angular2/routing-and-multiple-views');
  redirect('/tutorials/angular2/bind-one-object', '/tutorials/socially/angular2/bind-one-object');
  redirect('/tutorials/angular2/folder-structure', '/tutorials/socially/angular2/folder-structure');
  redirect('/tutorials/angular2/user-accounts-authentication-and-permissions', '/tutorials/socially/angular2/user-accounts-authentication-and-permissions');
  redirect('/tutorials/angular2/privacy-and-publish-subscribe-functions', '/tutorials/socially/angular2/privacy-and-publish-subscribe-functions');
  redirect('/tutorials/angular2/deploying-your-app', '/tutorials/socially/angular2/deploying-your-app');
  redirect('/tutorials/angular2/running-your-app-on-android-or-ios-with-phoneGap', '/tutorials/socially/angular2/running-your-app-on-android-or-ios-with-phoneGap');
  redirect('/tutorials/angular2/search-sort-pagination-and-reactive-vars', '/tutorials/socially/angular2/search-sort-pagination-and-reactive-vars');
  redirect('/tutorials/angular2/using-and-creating-angularjs-filters', '/tutorials/socially/angular2/using-and-creating-angularjs-filters');
  redirect('/tutorials/angular2/meteor-methods-with-promises', '/tutorials/socially/angular2/meteor-methods-with-promises');
  redirect('/tutorials/angular2/conditional-template-directives-with-angularjs', '/tutorials/socially/angular2/conditional-template-directives-with-angularjs');
  redirect('/tutorials/angular2/google-maps', '/tutorials/socially/angular2/google-maps');
  redirect('/tutorials/angular2/css-less-and-bootstrap', '/tutorials/socially/angular2/css-less-and-bootstrap');
  redirect('/tutorials/angular2/angular-material-and-custom-angular-auth-forms', '/tutorials/socially/angular2/angular-material-and-custom-angular-auth-forms');
  redirect('/tutorials/angular2/3rd-party-libraries', '/tutorials/socially/angular2/3rd-party-libraries');
  redirect('/tutorials/angular2/handling-files-with-collectionfs', '/tutorials/socially/angular2/handling-files-with-collectionfs');
  redirect('/tutorials/angular2/mobile-support-and-packages-isolation', '/tutorials/socially/angular2/mobile-support-and-packages-isolation');
  redirect('/tutorials/angular2/ionic', '/tutorials/socially/angular2/ionic');
  redirect('/tutorials/angular2/next-steps', '/tutorials/socially/angular2/next-steps');

  // Redirecting old links to WhatsApp Ionic
  redirect('/ionic-tutorial', '/tutorials/whatsapp');
  redirect('/tutorials/ionic', '/tutorials/whatsapp');
  redirect('/tutorials/ionic/bootstrapping', '/tutorials/whatsapp/ionic/bootstrapping');
  redirect('/tutorials/ionic/layout', '/tutorials/whatsapp/ionic/layout');
  redirect('/tutorials/ionic/server', '/tutorials/whatsapp/ionic/server');
  redirect('/tutorials/ionic/methods', '/tutorials/whatsapp/ionic/methods');
  redirect('/tutorials/ionic/authentication', '/tutorials/whatsapp/ionic/authentication');
  redirect('/tutorials/ionic/chats', '/tutorials/whatsapp/ionic/chats');
  redirect('/tutorials/ionic/privacy', '/tutorials/whatsapp/ionic/privacy');
  redirect('/tutorials/ionic/summary', '/tutorials/whatsapp/ionic/summary');


  self.route('tutorials.socially', {
    path: '/tutorials/socially',
    template: 'tutorials.socially.intro',
    seoTitle: 'Angular Meteor Tutorials'
  });

  self.route('tutorials.whatsapp', {
    path: '/tutorials/whatsapp',
    template: 'tutorials.whatsapp.intro',
    seoTitle: 'Angular Meteor and Ionic tutorial'
  });

  var directedRouteNames = [];
  for (var apiKey in API_DEFINITION) {
    var currentApi = API_DEFINITION[apiKey];

    for (var coreAPI in currentApi.groups[0].pages) {
      var routeName = currentApi.groups[0].pages[coreAPI].route;
      routeName = routeName.slice(routeName.lastIndexOf('.') + 1);
      var redirectFrom = '/api/' + routeName;
      var redirectTo = '/api/' + apiKey + '/' + routeName;
      if (!_.contains(directedRouteNames, routeName)) {
        redirect(redirectFrom, redirectTo);
        directedRouteNames.push(routeName);
      }
    }

    createSubRoutes(currentApi);

    (function (routeUrl) {
      if (routeUrl) {
        Router.route('/api/' + apiKey, function () {
          this.redirect(routeUrl);
        });
      }
    })(currentApi.groups[0].redirectRoute);
  }

  redirect('/api', '/api/' + DEFAULT_API + '/helpers');

  // -------------------------------------------------------------------------
  // Migration routes
  //

  redirect('/migration', '/migration/angular1/intro');

  createSubRoutes(MIGRATION);

  // -------------------------------------------------------------------------
  // Angular Server routes
  //

  self.route('server', {
    path: '/server',
    template: 'angular-server',
    seoTitle: 'Angular-Server | Angular-Meteor'
  });
  createSubRoutes(ANGULAR_SERVER);
  redirect('/server/base', '/server/base/bootstrapping');

}); // end Router.map
