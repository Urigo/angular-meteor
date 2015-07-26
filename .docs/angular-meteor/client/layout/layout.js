Template.layout.rendered = function () {
  if (window.oldIe) {
    $('body').addClass('oldIe');
  }
};

Template.layout.events({
  'click section': function () {
    $(".navbar-collapse").removeClass("in");
  }
});
