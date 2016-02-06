API_1_3_6 = function (version, basedOnTemplatesOf) {
  var urlBase = '/api/' + version + '/';
  var templatePrefix = basedOnTemplatesOf || version;

  return {
    groups: [
      {
        id: "0",
        title: "",
        route: "api",
        path: urlBase,
        redirectRoute: "/api/" + version + "/helpers",
        template: "api",
        seoTitleSuffix: " | Angular Meteor API",
        seoDesc: "angular-meteor is a realtime full stack that combines the best frameworks. use your existing Angular applications with Meteor - the best backend framework for AngularJS applications.",
        pages: [
          {
            id: "01",
            route: "api." + version + ".helpers",
            path: urlBase + "helpers",
            title: "helpers",
            seoTitle: "Context Helpers",
            mdContent: "api." + templatePrefix + ".helpers"
          },
          {
            id: "02",
            route: "api." + version + ".subscribe",
            path: urlBase + "subscribe",
            title: "subscribe",
            seoTitle: "Subscribe",
            mdContent: "api." + templatePrefix + ".subscribe"
          },
          {
            id: "03",
            route: "api." + version + ".autorun",
            path: urlBase + "autorun",
            title: "autorun",
            seoTitle: "Autorun",
            mdContent: "api." + templatePrefix + ".autorun"
          },
          {
            id: "04",
            route: "api." + version + ".get-reactively",
            path: urlBase + "get-reactively",
            title: "getReactively",
            seoTitle: "getReactively",
            mdContent: "api." + templatePrefix + ".get-reactively"
          },
          {
            id: "05",
            route: "api." + version + ".reactive-context",
            path: urlBase + "reactive-context",
            title: "ReactiveContext",
            seoTitle: "ReactiveContext",
            mdContent: "api." + templatePrefix + ".reactive-context"
          },
          {
            id: "06",
            route: "api." + version + ".reactive",
            path: urlBase + "reactive",
            title: "$reactive",
            seoTitle: "$reactive",
            mdContent: "api." + templatePrefix + ".reactive"
          },
          {
            id: "07",
            route: "api." + version + ".auth",
            path: urlBase + "auth",
            title: "$auth",
            seoTitle: "$auth",
            mdContent: "api." + version + ".auth"
          },
          {
            id: "08",
            route: "api." + version + ".blaze-template",
            path: urlBase + "blaze-template",
            title: "blaze-template directive",
            seoTitle: "blaze-template directive",
            mdContent: "api." + templatePrefix + ".blaze-template"
          },
          {
            id: "09",
            route: "api." + version + ".ngFileExtension",
            path: urlBase + "ngFileExtension",
            title: "File Extensions",
            seoTitle: "File Extensions",
            mdContent: "api." + templatePrefix + ".ngFileExtension"
          },
          {
            id: "10",
            route: "api." + version + ".call",
            path: urlBase + "call",
            title: "call",
            seoTitle: "call",
            mdContent: "api." + version + ".call"
          },
          {
            id: "11",
            route: "api." + version + ".apply",
            path: urlBase + "apply",
            title: "apply",
            seoTitle: "apply",
            mdContent: "api." + version + ".apply"
          },
          {
            id: "12",
            route: "api." + version + ".settings",
            path: urlBase + "settings",
            title: "$angularMeteorSettings",
            seoTitle: "$angularMeteorSettings",
            mdContent: "api." + version + ".settings"
          }
        ]
      }
    ]
  }
};
