Template['api.1.3.6.auth'].events({
  'click #pane-activator': function(event, template) {
    var target = $(event.target).attr('pane-target');
    var panes = $('.tab-pane');
    panes.removeClass('active');
    $(target).addClass('active');
  }
});