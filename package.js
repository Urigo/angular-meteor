Package.describe({
    summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages."
});

Package.on_use(function(api) {
    // Use bower
    api.use('bower', 'client');

    // Exports the ngMeteor package scope
    api.export('ngMeteor', 'client');

    // Files to load in Client only.
    api.add_files([
        // Bower Dependencies
        'bower.json',
        // Lib Files
        'lib/angular-hash-key-copier.js',
        // Module Files
        'modules/ngMeteor-collections.js',
        'modules/ngMeteor-template.js',
        // Finally load ngMeteor File
        'ngMeteor.js'
    ], 'client');
});