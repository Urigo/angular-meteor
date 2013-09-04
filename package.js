Package.describe({
	summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages."
});

Package.on_use(function (api) {
	// Exports the ngMeteor package scope
	api.export('ngMeteor', 'client');
	
	// Load files for client
	api.add_files([
		'lib/angular.js',
		'lib/angular-route.js', 
		'lib/hammer.js',
		'modules/ngMeteor.touch.js',
		'modules/ngMeteor.template.js', 
		'modules/ngMeteor.router.js',
		'ngMeteor.js'
	], 'client');
});