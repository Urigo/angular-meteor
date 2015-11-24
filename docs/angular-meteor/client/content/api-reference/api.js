Template.api.helpers({
  api: function () {
    var currentRoute = Router.current().route.path(this).split('/');
    var currentAPI = currentRoute[2];

    return API_DEFINITION[currentAPI];
  }
});
