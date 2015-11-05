// This is a wrapper around the GitPatch template for the tutorial
Template.CodeBox.onCreated(function () {
  if (! Template.currentData()) {
    throw new Error("Must pass arguments to CodeBox");
  }

  var data = Template.currentData();

  if (! (data.view && data.step)) {
    throw new Error("Must pass view and step args to CodeBox");
  }
});

Template.CodeBox.helpers({
  repoName: function () {
    var view = Template.currentData().view;

    if (view === "react") {
      return "meteor/simple-todos-react";
    } else if (view === "angular") {
      return "meteor/simple-todos-angular";
    } else if (view === "blaze") {
      return "meteor/simple-todos";
    } else {
      throw Error("Unrecognized view option: " + view);
    }
  },
  commit: function () {
    return getCommitData()[Template.currentData().step].sha;
  },
  summary: function () {
    var step = Template.currentData().step;
    return getCommitData()[step].message;
  },
  fileName: function () {
    if (Template.currentData().fileName) {
      return Template.currentData().fileName;
    }

    var gitSha = getCommitData()[Template.currentData().step].sha;
    var patch = GitPatches[gitSha];
    var fileNames = _.keys(patch);

    if (fileNames.length === 1) {
      return fileNames[0];
    }

    throw new Error("Multiple files in patch. Must specify fileName.");
  }
});

function getCommitData() {
  var view = Template.currentData().view;

  var commitData = null;
  if (view === "react") {
    commitData = REACT_COMMITS;
  } else if (view === "angular") {
    commitData = ANGULAR_COMMITS;
  } else if (view === "blaze") {
    commitData = BLAZE_COMMITS;
  } else {
    throw Error("Unrecognized view option: " + view);
  }

  return commitData;
}
