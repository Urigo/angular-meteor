Package.describe({
	summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages."
});

Package.on_use(function (api) {
	// Exports the ngMeteor package scope
	api.export('ngMeteor', 'client');

	// Files to load in Client only.
	api.add_files([
		// AngularJS Files
		'lib/angular/angular.js',
		'lib/angular/angular-route.js',
		// HammerJS Files
		'lib/hammer/hammer.js',
		// Select2 Files
		'lib/select2/select2.js',
		'lib/select2/ui-select2.js',
		'lib/select2/select2.css',
		'lib/select2/select2-bootstrap.css',
		'lib/select2/select2.png',
		'lib/select2/select2x2.png',
		'lib/select2/select2-spinner.gif',
		// Module Files
		'modules/ngMeteor.touch.js',
		'modules/ngMeteor.collections.js',
		'modules/ngMeteor.template.js',
		'modules/ngMeteor.router.js',
		// Finally load ngMeteor File
		'ngMeteor.js'
	], 'client');

});