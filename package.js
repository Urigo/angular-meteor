Package.describe({
	summary: "AngularJs for Meteor"
});

Package.on_use(function (api) {
	// Exports the ngMeteor package scope
	api.export('ngMeteor', 'client');
	
	// Load files for client
	api.add_files(['angular.min.js','ngMeteor.js'], 'client');
});