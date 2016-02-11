Template.api.helpers({
  api: function () {
    var route = Router.current().route.path(this);
    var apiVersionIndex = 2;
    var apis = ANGULAR1_API_DEFINITION;

    if (route.indexOf('api/angular2') > -1) {
      apiVersionIndex = 3;
      apis = ANGULAR2_API_DEFINITION;
    }

    var currentRoute = route.split('/');
    var currentAPI = currentRoute[apiVersionIndex];

    return apis[currentAPI];
  }
});
