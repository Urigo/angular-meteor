TUTORIALS = {
  groups: [
    // Loaded from `tutorials` package, so that the tutorials can be open source
    // while the rest of meteor.com is closed-source
    {
      id: "0",
      title: "Tutorials",
      route: "tutorials",
      path: "/tutorials",
      pathRedirect: "/tutorialIntro",
      template: "tutorials",
      pages: PAGES
    }
  ]
};
