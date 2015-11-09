var ngAnnotate = Npm.require('ng-annotate');

Plugin.registerSourceHandler('ng.js', {
    archMatching: 'web'
}, function(compileStep) {

    var ret = ngAnnotate(compileStep.read().toString('utf8'), {
        add: true
    });

    if (ret.errors) {
        throw new Error(ret.errors.join(': '));
    }
    else {
        compileStep.addJavaScript({
            path : compileStep.inputPath,
            data : ret.src,
            sourcePath : compileStep.inputPath
        });
    }

});