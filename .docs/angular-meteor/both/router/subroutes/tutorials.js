PAGES = [
  {
    id: "1",
    title: "Angular 1",
    route: "tutorials.angular1",
    path: "/tutorials/angular1",
    pathRedirect: "/tutorials/angular1/bootstrapping",
    ghRepoName: "https://github.com/Urigo/meteor-angular-socially",
    subSidebarType: "sidebarStepsCollapse",
    seoTitlePrefix: "Angular Meteor Tutorial | ",
    subHead: "Build your first Angular Meteor app",
    stepbarHide: true,
    pages: SOCIALLY_ANGULAR1
  },
  {
    id: "2",
    title: "Angular 2",
    route: "tutorials.angular2",
    path: "/tutorials/angular2",
    pathRedirect: "/tutorials/angular2/bootstrapping",
    ghRepoName: "https://github.com/ShMcK/ng2-socially-tutorial",
    subSidebarType: "sidebarStepsCollapse",
    seoTitlePrefix: "Angular 2.0 Meteor Tutorial | ",
    subHead: "Angular 2.0 Meteor tutorial",
    stepbarHide: true,
    pages: SOCIALLY_ANGULAR2
  },
  {
    id: "3",
    title: "Ionic",
    route: "tutorials.ionic",
    path: "/tutorials/ionic",
    pathRedirect: "/tutorials/ionic/bootstrapping",
    ghRepoName: "https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial",
    seoTitlePrefix: "Angular-Meteor and Ionic | ",
    subHead: "Angular-Meteor and Ionic",
    stepbarHide: true,
    pages: WHATSAPP_IONIC
  }
];

TUTORIALS = {
  groups: [
    {
      id: "0",
      title: "Tutorials",
      route: "tutorials",
      path: "/tutorials",
      pathRedirect: "/tutorialIntro",
      template: "tutorial",
      pages: PAGES

    }
  ]
};


