window.console = window.console || {
  log: function () {}
};

Template.registerHelper("oldIe", function () {
  return window.oldIe;
});
