function multiPatchHandler(compileStep) {
  const file = compileStep.read().toString();

  const patchStart = /^From /gm;

  let match = null;
  const patchIndices = [];
  while ((match = patchStart.exec(file)) != null) {
    patchIndices.push(match.index);
  }

  const patches = [];
  _.range(patchIndices.length).forEach((i) => {
    let patchContent = "";

    if (i + 1 < patchIndices.length) {
      patchContent = file.slice(patchIndices[i], patchIndices[i + 1]);
    } else {
      patchContent = file.slice(patchIndices[i]);
    }

    // Remove the weird -- 2.2.1 part at the end of every patch
    patchContent = patchContent.split(/^-- $/m)[0];

    patches.push(patchContent);
  });

  const datas = patches.map(parsePatch);

  const GitPatches = {};
  datas.forEach((data) => {
    const sha = data.sha;
    delete data.sha;
    GitPatches[sha] = data;
  });

  const jsonData = JSON.stringify(GitPatches);

  const code = `GitPatches = GitPatches || {};
_.extend(GitPatches, ${jsonData})`;

  compileStep.addJavaScript({
    data: code,
    sourcePath: compileStep.inputPath,
    path: compileStep.inputPath + ".js"
  });
}

function patchHandler(compileStep) {
  const file = compileStep.read().toString();
  const data = parsePatch(file);
  const sha = data.sha;
  delete data.sha;
  const jsonData = JSON.stringify({[sha]: data});

  const code = `GitPatches = GitPatches || {};
_.extend(GitPatches, ${jsonData})`;

  compileStep.addJavaScript({
    data: code,
    sourcePath: compileStep.inputPath,
    path: compileStep.inputPath + ".js"
  });
}

/**
 * Parse a string that represents a git patch
 * @param  {String} contents The contents of the patch to parse
 * @return {Object}          An object where the keys are filenames, and the
 * values are the contents of the diff
 */
function parsePatch(contents) {
  const sha = contents.split(" ")[1];
  const fileParts = contents.split(/^diff --git /m).slice(1);
  const data = {};

  _.each(fileParts, (part) => {
    const start = part.indexOf("@@");
    const diffContents = part.slice(start);

    // XXX won't work with spaces in filenames
    const fileNameMatch = /^\+\+\+ b\/(.+)$/m.exec(part);

    if (! fileNameMatch) {
      // This was probably a deleted file
      return;
    }

    const fileName = fileNameMatch[1]

    const fileData = {
      fileName: fileName,
      diff: diffContents
    };

    data[fileName] = fileData;
  });

  data.sha = sha;

  return data;
}

//Plugin.registerSourceHandler("multi.patch", {isTemplate: true}, multiPatchHandler);
//Plugin.registerSourceHandler("patch", {isTemplate: true}, patchHandler);