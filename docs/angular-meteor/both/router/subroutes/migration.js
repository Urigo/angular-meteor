MIGRATION = {
  groups: [
    {
      id: "0",
      title: "Migration",
      route: "migration",
      path: "/migration",
      pathRedirect: "/migration/angular1/01-intro",
      template: "migration",
      pages: [
        {
          id: "1",
          title: "Angular 1",
          route: "migration.angular1",
          path: "/migration/angular1",
          pathRedirect: "/migration/angular1/01-intro",
          pages: [
            {
              id: "10",
              title: 'Intro',
              seoTitle: 'Intro',
              route: "migration.angular1.01-intro",
              path: "/migration/angular1/01-intro",
              contentTemplate: 'migration.angular1.01-intro.md'
            }
          ]
        }
      ]
    }
  ]
};
