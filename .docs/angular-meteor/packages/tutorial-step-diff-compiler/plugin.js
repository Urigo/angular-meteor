var gitPatchParser = Npm.require("am-git-patch-parser");

Plugin.registerSourceHandler("multi.patch", {isTemplate: true}, multiPatchHandler);

function multiPatchHandler(compileStep) {
  var parsedData = gitPatchParser.parseMultiPatch(compileStep.read().toString());

  // Modifies array in place, sorry!
  parsedData.forEach(parseOutStepNumberAndComment);

  var stepToPatch = {};
  parsedData.forEach(function (parsedPatch) {
    stepToPatch[parsedPatch.stepNumber] = parsedPatch;
  });

  var codeToDefineFilename = "StepDiffs['" + compileStep.inputPath + "'] = " + JSON.stringify(stepToPatch) + ";\n";

  compileStep.addJavaScript({
    sourcePath: compileStep.inputPath,
    path: compileStep.inputPath + ".js",
    data: codeToDefineFilename
  });
}

function prepareSummary(message) {
  return capitalizeFirstLetter(message.trim());
}

function capitalizeFirstLetter(message) {
  return message.charAt(0).toUpperCase() + message.slice(1);
}

// Expects commit messages of the form:
// "Step 2.2: Replace starter HTML code"
// 
// Who knows what it does if the format is not correct
function parseOutStepNumberAndComment(parsedPatch) {
  var splitMessage = parsedPatch.message.split(":");

  if (splitMessage.length > 1) {
    var stepNumber = splitMessage[0].split(" ")[1];
    if (!stepNumber) {
      stepNumber = splitMessage[0].split(" ")[0];
    }
    parsedPatch.stepNumber = stepNumber.trim();
    if (splitMessage[1]) {
      parsedPatch.summary = prepareSummary(splitMessage[1]); 
    }
  }
}
