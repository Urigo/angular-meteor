GitPatches = {};

Template.GitPatch.onCreated(function () {
  this.fileName = new ReactiveVar(null);
  this.fileData = new ReactiveVar(null);
  this.ready = new ReactiveVar(false);

  let argsPassed = false;

  this.autorun(() => {
    if (! Template.currentData()) {
      // No arguments provided
      return;
    }

    const {
      commit,
      repoName,
      fileName,
      summary
    } = Template.currentData();

    if (! (commit && repoName && fileName && summary)) {
      // Not all arguments were provided
      return;
    }

    argsPassed = true;
    this.fileName.set(fileName);
    this.fileData.set(GitPatches[commit][fileName]);
  });

  if (! argsPassed) {
    console.info("GitPatch template needs four arguments: repoName, commit, summary, and fileName");
  }
});

Template.GitPatch.helpers({
  fileName() {
    return Template.instance().fileName.get();
  },
  lineNumbers() {
    const fileData = Template.instance().fileData.get();

    if (! fileData) {
      return null;
    }

    const patchLines = fileData.diff.split("\n");
    const lineNumbers = patchLines[0];

    const firstLineNumber = parseInt(
      lineNumbers.split(" ")[2].split(",")[0].slice(1), 10);

    const numLines = parseInt(
      lineNumbers.split(" ")[2].split(",")[1], 10);

    return _.range(firstLineNumber, firstLineNumber + numLines);
  },
  lines() {
    const fileData = Template.instance().fileData.get();

    if (! fileData) {
      return null;
    }

    const patchLines = fileData.diff.split("\n");
    const lineNumbers = patchLines[0];

    // Take off first line which is just line numbers, and last line which
    // is just empty
    const contentPatchLines = patchLines.slice(1, patchLines.length - 1);

    const firstLineNumber = parseInt(
      lineNumbers.split(" ")[2].split(",")[0].slice(1), 10);

    return _.map(contentPatchLines, (line) => {
      if (! line) {
        // The last line ends up being an empty string
        return null;
      }

      let type = "context";

      if (/^\+/.test(line)) {
        type = "added";
      } else if (/^-/.test(line)) {
        type = "removed";
      }

      const content = line.slice(1);
      let highlightedContent = null;
      if (content) {
        const ext = _.last(fileData.fileName.split("."));
        let fileType = ext;
        if (ext === "jsx") {
          fileType = "js";
        }

        highlightedContent = hljs.highlight(fileType, content, true).value;
      }

      return {
        type,
        content: highlightedContent || " "
      };
    });
  },
  equals(a, b) {
    return a === b;
  },
  gitHubLink() {
    return `https://github.com/${this.repoName}/commit/${this.commit}`;
  }
});
