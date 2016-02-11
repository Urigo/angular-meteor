API_1_2_2 = function(version, basedOnTemplatesOf) {
  var urlBase = '/api/' + version + '/';
  var templatePrefix = basedOnTemplatesOf || version;

  return {
    groups: [
      {
        id: "0",
        title: "",
        route: "api",
        path: urlBase,
        redirectRoute: "/api/" + version + "/meteorCollection",
        template: "api",
        seoTitleSuffix: " | Angular Meteor API",
        seoDesc: "angular-meteor is a realtime full stack that combines the best frameworks. use your existing Angular applications with Meteor - the best backend framework for AngularJS applications.",
        pages: [
          {
            id: "01",
            route: "api." + version + ".meteorCollection",
            path: urlBase + "meteorCollection",
            title: "$meteor.collection",
            seoTitle: "$meteor.collection",
            mdContent: "api." + templatePrefix + ".meteorCollection",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "02",
            route: "api." + version + ".AngularMeteorCollection",
            path: urlBase + "AngularMeteorCollection",
            title: "AngularMeteorCollection",
            seoTitle: "AngularMeteorCollection",
            mdContent: "api." + templatePrefix + ".AngularMeteorCollection",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "03",
            route: "api." + version + ".meteorObject",
            path: urlBase + "meteorObject",
            title: "$meteor.object",
            seoTitle: "$meteor.object",
            mdContent: "api." + templatePrefix + ".meteorObject",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "04",
            route: "api." + version + ".AngularMeteorObject",
            path: urlBase + "AngularMeteorObject",
            title: "AngularMeteorObject",
            seoTitle: "AngularMeteorObject",
            mdContent: "api." + templatePrefix + ".AngularMeteorObject",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "05",
            route: "api." + version + ".subscribe",
            path: urlBase + "subscribe",
            title: "$meteor.subscribe",
            seoTitle: "$meteor.subscribe",
            mdContent: "api." + templatePrefix + ".subscribe",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "06",
            route: "api." + version + ".methods",
            path: urlBase + "methods",
            title: "$meteor.call",
            seoTitle: "$meteor.call",
            mdContent: "api." + templatePrefix + ".methods",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "07",
            route: "api." + version + ".auth",
            path: urlBase + "auth",
            title: "User Authentication",
            seoTitle: "User Authentication",
            mdContent: "api." + templatePrefix + ".auth",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "08",
            route: "api." + version + ".getReactively",
            path: urlBase + "getReactively",
            title: "$scope.getReactively",
            seoTitle: "$scope.getReactively",
            mdContent: "api." + templatePrefix + ".getReactively",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "09",
            route: "api." + version + ".blaze-template",
            path: urlBase + "blaze-template",
            title: "blaze-template directive",
            seoTitle: "blaze-template directive",
            mdContent: "api." + templatePrefix + ".blaze-template"
          },
          {
            id: "10",
            route: "api." + version + ".files",
            path: urlBase + "files",
            title: "CollectionFS",
            seoTitle: "Files with CollectionFS",
            mdContent: "api." + templatePrefix + ".collectionfs",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "11",
            route: "api." + version + ".utils",
            path: urlBase + "utils",
            title: "$meteorUtils",
            seoTitle: "$meteorUtils",
            mdContent: "api." + templatePrefix + ".utils",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "12",
            route: "api." + version + ".camera",
            path: urlBase + "camera",
            title: "$meteorCamera",
            seoTitle: "$meteorCamera",
            mdContent: "api." + templatePrefix + ".camera",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "13",
            route: "api." + version + ".session",
            path: urlBase + "session",
            title: "$meteor.session.bind",
            seoTitle: "$meteor.session",
            mdContent: "api." + templatePrefix + ".session",
            deprecated: '1.3.0', removedIn: '1.4.0'
          },
          {
            id: "14",
            route: "api." + version + ".ngFileExtension",
            path: urlBase + "ngFileExtension",
            title: "File Extensions",
            seoTitle: "File Extensions",
            mdContent: "api." + templatePrefix + ".ngFileExtension"
          }
        ]
      }
    ]
  }
};