Template.home.rendered = function () {
  Tracker.autorun(function () {
    if (Session.get("twitterWidgetLoaded")) {
      var newElement = $('#homepage-social-buttons-cache').clone();
      newElement.attr("id", "homepage-social-buttons");
      $('#homepage-social-buttons').replaceWith(newElement);
    }
  });
};