Package.describe({
	summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages."
});

Package.on_use(function (api) {
	// Exports the ngMeteor package scope
	api.export('ngMeteor', 'client');
	
	// Files to load in Client only.
	api.add_files([
		// Lib Files
		'lib/angular.js',
		'lib/angular-route.js',
		'lib/angular-animate.js',
		'lib/angular-cookies.js',
		'lib/angular-resource.js',
		'lib/angular-sanitize.js',
		'lib/angular-csp.css',
		'lib/angular-touch.js',
		'lib/angular-hash-key-copier.js',
		// Module Files
		'modules/ngMeteor-collections.js',
		'modules/ngMeteor-template.js',
		// Finally load ngMeteor File
		'ngMeteor.js'
	], 'client');
});