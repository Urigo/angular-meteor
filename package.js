Package.describe({
    summary: "A Javascript MVW Framework"
});

Package.on_use( function(api) {
    api.use('deps');

    api.add_files(['angular.min.js','ngMeteor.js'], 'client');
});