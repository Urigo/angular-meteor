Template.stepbarButtons.helpers({
  prev: function () {
    var self = this;
    if(self.parent.pages) {
      return self.parent.pages[parseInt(self.id, 10) - 1]
    } else {
      var pathObject = {
        path: 'tutorials/socially'
      };
      return pathObject;
    }
  },
  next: function () {
    var self = this;
    if(self.parent.pages) {
      return self.parent.pages[parseInt(self.id, 10) + 1]
    }
  }
});

Template.stepbarButtonsPrevious.helpers({
  prev: function () {
    var self = this;
    if(self.parent.pages) {
      return self.parent.pages[parseInt(self.id, 10) - 1]
    } else {
      var pathObject = {
        path: 'tutorials/socially'
      };
      return pathObject;
    }
  }
});

Template.stepbarButtonsNext.helpers({
  next: function () {
    var self = this;
    if(self.parent.pages) {
      return self.parent.pages[parseInt(self.id, 10) + 1]
    }
  }
});

Template.stepbarLiveDemo.helpers({
  liveDemoLink: function () {
    var self = this;
    var zeroToStep = '';
    if (self.id < 10)
      zeroToStep = '0';

    var route = Router.current().route.path(this) || 'angular';

    if (route.indexOf('tutorials/whatsapp/ionic') !== -1) {
      return 'http://dotansimha.github.io/ionic-meteor-whatsapp-clone-step-' + zeroToStep + self.id;
    }
    else if (route.indexOf('tutorials/whatsapp/meteor') !== -1) {
      return '';
    }
    else {
      return 'http://socially-step' + zeroToStep + self.id + '.meteor.com/';
    }
  },
  next: function () {
    var self = this;
    if(self.parent.pages) {
      return self.parent.pages[parseInt(self.id, 10) + 1]
    }
  }
});

Template.stepbarCodeDiff.helpers({
  CommitDiff: function () {
    var self = this;
    return self.commitDiff;
  },
  ghRepoName: function () {
    var self = this;
    return self.parent.ghRepoName;
  },
  currentCommit: function () {
    var self = this;
    var zeroToStep = '';
    if (self.id < 10)
      zeroToStep = '0';
    return zeroToStep + self.id;
  },
  previousCommit: function() {
    var self = this;
    var zeroToStep = '';
    if ((self.id - 1) < 10)
      zeroToStep = '0';
    return zeroToStep + (self.id - 1);
  },
  next: function () {
    var self = this;
    if(self.parent.pages) {
      return self.parent.pages[parseInt(self.id, 10) + 1]
    }
  }
});

Template.improveDoc.helpers({
  tutorialName: function () {
    var rData = Router.current().data();
    if (rData.parent.route == 'tutorials.socially.angular2') {
      return 'socially/angular2';
    } else if (rData.parent.route == 'tutorials.whatsapp.ionic') {
      return 'whatsapp/ionic'
    } else {
      return 'socially/angular1'
    }
  }
});

Template.downloadPreviousStep.helpers({
  ghRepoName: function () {
    var rData = Router.current().data();
    if (rData.parent.route == 'tutorials.socially.angular2'){
      return 'https://github.com/Urigo/meteor-angular2.0-socially';
    } else {
      return 'https://github.com/Urigo/meteor-angular-socially';
    }
  }
});
