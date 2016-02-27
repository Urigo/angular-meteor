Template.paneActivator.events({
  'click': function(event, template) {
    $('.tab-pane').removeClass('active');
    $(this.target).addClass('active');
    $(window).scrollTop(0);
  }
});