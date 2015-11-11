Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  seoTitle:   'angular-meteor',
  seoAuthor:  'Uri Goldshtein',
  seoDesc:    'angular-meteor is a realtime full stack that combines the best frameworks. use your existing Angular applications with Meteor - the best backend framework for AngularJS applications.',
  seoType:    'website',
  seoImage:   'https://angular-meteor.com/images/logo-large.png',
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

  // Redirect old link
  redirect('/tutorial', '/tutorialIntro');
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

  // -------------------------------------------------------------------------
  // API reference routes
  //
  createSubRoutes(API_REFERENCE);
  redirect('/api', '/api/meteorCollection');
  redirect('/api/meteor-include', '/api/blaze-template');

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
