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
  redirect('/tutorials', '/tutorialIntro');

  // Redirect old link
  redirect('/tutorial', '/tutorialIntro');

  self.route('tutorialIntro', {
    path: '/tutorialIntro',
    template: 'tutorial-intro',
    seoTitle: 'Angular Meteor Tutorials'
  });


  // -------------------------------------------------------------------------
  // API reference routes
  //
  createSubRoutes(API_REFERENCE);
  redirect('/api', '/api/meteorCollection');

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
