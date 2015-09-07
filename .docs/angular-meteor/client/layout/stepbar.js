Template.stepbarButtons.helpers({
  prev: function () {
    var self = this;
    if(self.parent.pages) {
      return self.parent.pages[parseInt(self.id, 10) - 1]
    } else {
      var pathObject = {
        path: 'tutorialIntro'
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
        path: 'tutorialIntro'
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

    return 'http://socially-step' + zeroToStep + self.id + '.meteor.com/';
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
    if (rData.parent.route == 'tutorials.angular2'){
      return 'angular2';
    } else {
      return 'angular1'
    }
  }
});

Template.downloadPreviousStep.helpers({
  ghRepoName: function () {
    var rData = Router.current().data();
    if (rData.parent.route == 'tutorials.angular2'){
      return 'https://github.com/ShMcK/ng2-socially-tutorial';
    } else {
      return 'https://github.com/Urigo/meteor-angular-socially';
    }
  }
});
