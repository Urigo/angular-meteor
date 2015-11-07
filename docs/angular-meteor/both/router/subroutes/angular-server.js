ANGULAR_SERVER = {
  groups: [
    {
      id: "0",
      title: "",
      route: "serverBase",
      path: "/server/base/",
      redirectRoute: "serverBase.bootstrapping",
      template: "server-base",
      seoTitleSuffix: " | Angular-Server API",
      seoDesc: "Angular-Server let you use Angular on the server side using the Meteor Platform.",
      pages: [
        {
          id: "01",
          route: "serverBase.bootstrapping",
          path: "/server/base/bootstrapping",
          title: "Bootstrap Angular-Server",
          seoTitle: "Bootstrap Angular-Server",
          mdContent: "server.bootstrapping"
        },
        {
          id: "02",
          route: "serverBase.di",
          path: "/server/base/di",
          title: "Dependency Injection",
          seoTitle: "Dependency Injection",
          mdContent: "server.di"
        },
        {
          id: "03",
          route: "serverBase.api",
          path: "/server/base/api",
          title: "Angular-Server API",
          seoTitle: "Angular-Server API",
          mdContent: "server.api"
        }
      ]
    }
  ]
};
