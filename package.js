Package.describe({
	summary: "AngularJs for Meteor"
});

Package.on_use(function (api) {
	// Exports the ngMeteor package scope
	api.export('ngMeteor', 'client');
	
	// Load files for client
	api.add_files([
		'lib/angular.js', 
		'lib/hammer.js',
		'modules/ngMeteor.template.js', 
		'modules/ngMeteor.touch.js',
		'ngMeteor.js'
	], 'client');
});