API_1_3_0 = function(version, basedOnTemplatesOf) {
  var urlBase = '/api/' + version + '/';
  var templatePrefix = basedOnTemplatesOf || version;

  return {
    groups: [
      {
        id: "0",
        title: "",
        route: "api",
        path: urlBase,
        redirectRoute: "api." + version + ".meteorCollection",
        template: "api",
        seoTitleSuffix: " | Angular Meteor API",
        seoDesc: "angular-meteor is a realtime full stack that combines the best frameworks. use your existing Angular applications with Meteor - the best backend framework for AngularJS applications.",
        pages: [
          {
            id: "01",
            route: "api." + version + ".reactiveContext",
            path: urlBase + "reactiveContext",
            title: "ReactiveContext",
            seoTitle: "ReactiveContext",
            mdContent: "api." + templatePrefix + ".reactiveContext"
          }
        ]
      }
    ]
  }
};