TUTORIAL_PAGES = {
  id: "0",
  title: "Tutorials",
  route: "tutorials",
  path: "/tutorials",
  pathRedirect: "/tutorialIntro",
  template: "tutorials",
  pages: [
    {
      id: "1",
      title: "Angular",
      route: "tutorials.angular1",
      path: "/tutorials/angular1",
      pathRedirect: "/tutorials/angular1/bootstrapping",
      ghRepoName: "https://github.com/Urigo/meteor-angular-socially",
      subSidebarType: "sidebarStepsCollapse",
      seoTitlePrefix: "Angular Meteor Tutorial | ",
      subHead: "Build your first Angular Meteor app",
      stepbarHide: true,
      pages: ANGULAR1_TUT
    },
    {
      id: "2",
      title: "Angular 2.0",
      route: "tutorials.angular2",
      path: "/tutorials/angular2",
      pathRedirect: "/tutorials/angular2/bootstrapping",
      ghRepoName: "https://github.com/ShMcK/ng2-socially-tutorial",
      subSidebarType: "sidebarStepsCollapse",
      seoTitlePrefix: "Angular 2.0 Meteor Tutorial | ",
      subHead: "Angular 2.0 Meteor tutorial",
      stepbarHide: true,
      pages: ANGULAR2_TUT
    }
  ]
};