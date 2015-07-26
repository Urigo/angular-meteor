Template.tutorials.helpers({
  tutorials: function () {
    return TUTORIALS;
  }
});

Template.gitHubBox.helpers({
  gitHubBoxKeys: function () {
    var self = this;
    return self.sha && self.parent.ghRepoName;
  },
  stepNumber: function () {
    return parseInt(this.id,10) + 1
  }
});

var selectText = function (element) {
  var range, selection;

  if (document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(element);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

Template.codeBox.events({
  "click .select-all": function (event, template) {
    selectText(template.find(".code-box-content code"));
  }
});
