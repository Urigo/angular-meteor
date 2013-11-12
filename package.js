Package.describe({
	summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages."
});

Package.on_use(function (api) {
	// Exports the ngMeteor package scope
	api.export('ngMeteor', 'client');

	var path = Npm.require('path');
	var lib_path = path.join('lib');
	var module_path = path.join('modules');

	api.add_files(path.join(lib_path, 'angular.js'), 'client');
	api.add_files(path.join(lib_path, 'angular-route.js'), 'client');
	api.add_files(path.join(lib_path, 'hammer.js'), 'client');
	api.add_files(path.join(lib_path, 'select2.js'), 'client');
	api.add_files(path.join(lib_path, 'ui-select2.js'), 'client');
	api.add_files(path.join(lib_path, 'select2.css'), 'client');
	api.add_files(path.join(lib_path, 'select2-bootstrap.css'), 'client');
	api.add_files(path.join(lib_path, 'select2.png'), 'client');
	api.add_files(path.join(lib_path, 'select2x2.png'), 'client');
	api.add_files(path.join(lib_path, 'select2-spinner.gif'), 'client');

	api.add_files(path.join(module_path, 'ngMeteor.touch.js'), 'client');
	api.add_files(path.join(module_path, 'ngMeteor.collections.js'), 'client');
	api.add_files(path.join(module_path, 'ngMeteor.template.js'), 'client');
	api.add_files(path.join(module_path, 'ngMeteor.router.js'), 'client');

	api.add_files(path.join('ngMeteor.js'), 'client');
});