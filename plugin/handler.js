/**
 * Created by netanel on 01/01/15.
 */
Plugin.registerSourceHandler('tpl', {
  isTemplate: true,
  archMatching: "web"
}, function(compileStep) {
  var contents = compileStep.read().toString('utf8');

  compileStep.addAsset({
    path : compileStep.inputPath,
    data : contents
  });
});