Template.navbar.onCreated(function () {
  //this.data.tutorialSteps = ANGULAR1_TUT;
});

Template.navbar.helpers({
  isInstall: function () {
    var name = Router.current().route.getName();
    if (name.startsWith("install") ||
        name.startsWith("tutorial")) {
      return "selected";
    }
  },
  isApi: function () {
    if (Router.current().route.getName().startsWith("api")) {
      return "selected";
    }
  },
  index: function () {
    return Number(this.id);
  },
  sociallyLinks: function() {
    return SOCIALLY_ANGULAR1;
  }
});

Template.navbar.events({
  'click a[class!="dropdown-toggle"], click .login-button': function () {
    $(".navbar-collapse").removeClass("in");
  }
});

Template.navbarLink.helpers({
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
    var rData = Router.current().data();
    return rData.path.substr(rData.path.lastIndexOf('/'));
  },
  sidebarPath: function() {
    var rData = Router.current().data();
    var parent = rData.path.substr(0, rData.path.lastIndexOf('/'));
    var chapter = this.path.substr(this.path.lastIndexOf('/'));
    return parent + chapter;
  }
});
