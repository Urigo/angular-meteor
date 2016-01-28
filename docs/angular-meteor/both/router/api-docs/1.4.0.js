API_1_4_0 = function (version, basedOnTemplatesOf) {
  var urlBase = '/api/' + version + '/';
  var templatePrefix = basedOnTemplatesOf || version;

  return {
    groups: [
      {
        id: "0",
        title: "",
        route: "api",
        path: urlBase,
        redirectRoute: "/api/" + version + "/mixer",
        template: "api",
        seoTitleSuffix: " | Angular Meteor API",
        seoDesc: "angular-meteor is a realtime full stack that combines the best frameworks. use your existing Angular applications with Meteor - the best backend framework for AngularJS applications.",
        pages: [
          {
            id: "01",
            route: "api." + version + ".mixer",
            path: urlBase + "mixer",
            title: "$Mixer",
            seoTitle: "$Mixer",
            mdContent: "api." + templatePrefix + ".mixer"
          },
          {
            id: "02",
            route: "api." + version + ".core",
            path: urlBase + "core",
            title: "$$Core",
            seoTitle: "$$Core",
            mdContent: "api." + templatePrefix + ".core"
          },
          {
            id: "03",
            route: "api." + version + ".viewModel",
            path: urlBase + "viewModel",
            title: "$$ViewModel",
            seoTitle: "$$ViewModel",
            mdContent: "api." + templatePrefix + ".viewModel"
          },
          {
            id: "04",
            route: "api." + version + ".reactive",
            path: urlBase + "reactive",
            title: "$$Reactive",
            seoTitle: "$$Reactive",
            mdContent: "api." + templatePrefix + ".reactive"
          },
          {
            id: "05",
            route: "api." + version + ".auth",
            path: urlBase + "auth",
            title: "$$Auth",
            seoTitle: "$$Auth",
            mdContent: "api." + templatePrefix + ".auth"
          },
          {
            id: "06",
            route: "api." + version + ".blaze-template",
            path: urlBase + "blaze-template",
            title: "blaze-template directive",
            seoTitle: "blaze-template directive",
            mdContent: "api." + templatePrefix + ".blaze-template"
          },
          {
            id: "07",
            route: "api." + version + ".ngFileExtension",
            path: urlBase + "ngFileExtension",
            title: "ng file-extension",
            seoTitle: "ng file-extension",
            mdContent: "api." + templatePrefix + ".ngFileExtension"
          }
        ]
      }
    ]
  }
};