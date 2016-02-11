Template.sidebarDesktop.helpers({
  sidebarType: function() {
    return this.subSidebarType ? this.subSidebarType : "sidebarDefault";
  }
});

Template.tutorialSelector.helpers({
  tutorialLink: function() {
    var route = Router.current().route.path(this) || 'angular';

    if (route.indexOf('tutorials/whatsapp/ionic') !== -1 || route.indexOf('tutorials/whatsapp/meteor') !== -1) {
      return 'tutorials/whatsapp';
    }
    else {
      return 'tutorials/socially';
    }
  },
  pages: function() {
    var route = Router.current().route.path(this) || 'angular';

    if (route.indexOf('tutorials/whatsapp/ionic') !== -1 || route.indexOf('tutorials/whatsapp/meteor') !== -1) {
      return [];
    }
    else {
      return [PAGES[0], PAGES[1]];
    }
  }
});

Template.tutorialSelector.helpers({
  selected: function() {
    var self = this;
    var rData = Router.current().data();
    return rData.route == self.route || rData.parent.route == self.route ? "active" : "";
  }
});

Template.sidebarDefault.helpers({
  pages: function() {
    var route = Router.current().route.path(this) || 'angular';

    if (route.indexOf('tutorials/whatsapp/ionic') !== -1) {
      return WHATSAPP_IONIC;
    }
    if (route.indexOf('tutorials/whatsapp/meteor') !== -1) {
      return WHATSAPP_METEOR;
    }
    else {
      return SOCIALLY_ANGULAR1;
    }
  }
});

Template.sidebarDefault.helpers({
  index: function () {
    return Number(this.id);
  }
});

Template.sidebarMobile.helpers({
  selectedMobile: function () {
    return Router.current().data().route == this.route ? {selected: ""} : null;
  }
});
Template.sidebarMobile.events({
  "change .component-sidebar-mobile": function(event, template){
    $(event.currentTarget).blur();
    var dest = $(event.target).val();
    if(dest) {
      window.location = dest;
    }
  }
});

Template.sidebarLink.helpers({
  selected: function() {
    var self = this;
    var rData = Router.current().data();
    var chapter = rData.path.substr(rData.path.lastIndexOf('/'));
    var routeChapter = self.path.substr(self.path.lastIndexOf('/'));
    return chapter == routeChapter ? "active" : "";
  },
  sidebarPath: function() {
    var rData = Router.current().data();
    var parent = rData.path.substr(0, rData.path.lastIndexOf('/'));
    var chapter = this.path.substr(this.path.lastIndexOf('/'));
    return parent + chapter;
  }
});

Template.tutorialsLink.helpers({
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
    return rData.route == self.route || rData.parent.route == self.route ? "active" : "";
  },
  chapter: function () {
    if (Router.current().data) {
      var rData = Router.current().data();
      return rData.path.substr(rData.path.lastIndexOf('/'));
    }
    else {
      return [];
    }
  }
});

Template.sidebarStepsCollapse.onRendered(function() {
  var self = this;
  var rData = Router.current().data();
  var childElem = '.' + self.data.id + '-steps';
  $('.collapse').collapse({toggle: false});
  if(rData.route == self.data.route || rData.parent.route == self.data.route) {
    $(childElem).collapse('show');
  } else {
    $(childElem).collapse('hide');
  }
});
