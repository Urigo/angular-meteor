Template.sidebarDesktopAPI.helpers({
  sidebarType: function() {
    return this.subSidebarType ? this.subSidebarType : "sidebarDefaultAPI";
  }
});

Template.sidebarMobileAPI.helpers({
  selectedMobile: function () {
    return Router.current().data().route == this.route ? {selected: ""} : null;
  }
});
Template.sidebarMobileAPI.events({
  "change .component-sidebar-mobile": function(event, template){
    $(event.currentTarget).blur();
    var dest = $(event.target).val();
    if(dest) {
      window.location = dest;
    }
  }
});

Template.sidebarLinkAPI.helpers({
  selected: function() {
    var self = this;
    var rData = Router.current().data();
    if(this.subSidebarType === "sidebarStepsCollapse") {
      var childElem = '.' + this.id + '-steps';
      if(rData.route == self.route || rData.parent.route == self.route) {
        $(childElem).collapse('show');
      } else {
        $(childElem).collapse('hide');
      }
    }
    return rData.route == self.route || rData.parent.route == self.route ? "selected" : "not-selected";
  },
  sidebarPath: function() {
    return this.pathRedirect ? this.pathRedirect : this.path;
  }
});
