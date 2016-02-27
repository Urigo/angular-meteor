Template['api.1.3.6.auth'].events({
  'click #pane-activator-0-2-0': function(event, template) {
    var selector = template.$('#authVersion-contents');
    var items = selector.find('> li');
    items.removeClass('active');
    // Activating 0-2-0
    items.eq(1).addClass('active');
  }
});