ANGULAR2_API_0_4_2 = function(version, basedOnTemplatesOf) {
  var urlBase = '/api/angular2/' + version + '/';
  var templatePrefix = basedOnTemplatesOf || version;

  return {
    groups: [
      {
        id: "0",
        title: "",
        route: "api",
        path: urlBase,
        redirectRoute: "/api/angular2/" + version + "/meteorComponent",
        template: "api",
        seoTitleSuffix: " | Angular2 Meteor API",
        seoDesc: "angular2-meteor is a realtime full stack that combines the best frameworks. use your existing Angular2.0 applications with Meteor - the best backend framework for AngularJS 2.0 applications.",
        pages: [
          {
            id: "01",
            route: "api.angular2." + version + ".meteorComponent",
            path: urlBase + "meteorComponent",
            title: "MeteorComponent",
            seoTitle: "MeteorComponent",
            mdContent: "api.angular2." + templatePrefix + ".meteorComponent"
          },
          {
            id: "02",
            route: "api.angular2." + version + ".bootstrap",
            path: urlBase + "bootstrap",
            title: "bootstrap",
            seoTitle: "bootstrap",
            mdContent: "api.angular2." + templatePrefix + ".bootstrap"
          }
        ]
      }
    ]
  }
};