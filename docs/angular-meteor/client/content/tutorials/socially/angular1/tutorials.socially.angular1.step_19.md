{{#template name="tutorials.socially.angular1.step_19.md"}}
{{> downloadPreviousStep stepName="step_18"}}

This part of the tutorial will cover the usage of third-party libraries with angular-meteor.

Parts of this tutorial are also relevant for users who uses only Meteor, without angular-meteor, because the solution for third-party libraries comes from Meteor packaging manager - **Atmosphere**.

In this part of the tutorial we will show multiple solution for the same problem - using third-party libraries with Meteor and angular-meteor.


Every Angular 1 developer knows and uses third-party libraries (like angular-ui-bootstrap, ui-router, etc..), but because we do not have the ability to easily include the ".js" file on our "head" tag - we need another solutions.

In order to add third-party libraries to your Meteor project - you can use the `meteor add PACKAGE_NAME` command to add the package.

Also, for **most** of the Angular 1 third-party libraries - there's already a Meteor package (which is an equivalent to bower or NPM).

You can search for those packages using the [Atmosphere](https://atmospherejs.com/) website.

For example, in order to use **[angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router)** in your project, easily run this command:
```
meteor add angularui:angular-ui-router
```
And then just use the angular-ui-router on your angular-meteor project, by adding it to the Angular 1 module initialization:
```
angular.module('myModule', [
  'angular-meteor',
  'ui.router'
]);
```
**But this is an easy one** - because angular-ui-router is one of the most common library for Angular 1.

In some cases, we want to use some packages that does not have an Atmosphere package exists - you can use the following instructions to solve your problem.

**But First**, we need to understand how Meteor and it's package manager - Atmosphere, works: Any package registered on Atmosphere has some meta-data and the real JS and CSS files that written on a file named "**package.js**".

The meta-data contain there parameters:

* Package name
* Package version (based on the [semver](http://semver.org/) standard)
* Package summary
* Package GIT repository
* Package documentation file (usually the README.md file)

Also, each package declares these:

* Package dependencies (on other 3rdParty libraries).
* Meteor minimal version.
* Files in use (usually the CSS and the JS files of the library).
* JavaScript exports (In case that there are any).

If you would like to know some more about Meteor packaging system and versioning, you can read [this](https://meteorhacks.com/meteor-packaging-system-understanding-versioning) article by MeteorHacks.

This is an example for angular-ui-router's package.js file:
```
// package metadata file for Meteor.js
var packageName = 'angularui:angular-ui-router'; // https://atmospherejs.com/angularui/angular-ui-router
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '0.2.14';

// Meta-data
Package.describe({
  name: packageName,
  version: version,
  summary: 'angular-ui-router (official): Flexible routing with nested views in Angular 1',
  git: 'git@github.com:angular-ui/ui-router.git',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions

  api.use('angular:angular@1.0.8', where); // Dependencies

  api.addFiles('release/angular-ui-router.js', where); // Files in use
});
```

# Solution #1
This solution is the most helpful solution of all - because in the end of this solution, you achieve these results:

* The package will be listed on the Atmosphere package manager and you'll be able to use it with "meteor add" command.
* You will create a pull request to the package author in order to provide Meteor support for the package.

**If you are not interested on this solution and just want to do some "monkey patch" in order to your an unlisted package - just the Solution #2.**

In order to learn in this example, we will use [angularjs-dropdown-multiselect](https://github.com/dotansimha/angularjs-dropdown-multiselect) as an example for a package.

First, we want to fork the repository and clone it to our computer by using `git clone FORKED_REPOSITORY_LINK`.

Then, create the "`package.js`" file on the root directory of the project, and use this basic template:
```
// package metadata file for Meteor.js
var packageName = 'PACKAGE_NAME';
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = 'PACKAGE_VERSION';
var summary = 'PACKAGE_SUMMARY';
var gitLink = 'GIT_LINK';
var documentationFile = 'README.md';

// Meta-data
Package.describe({
  name: packageName,
  version: version,
  summary: summary,
  git: gitLink,
  documentation: documentationFile
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions

  api.use('DEPENDENCY_NAME', where); // Dependencies

  api.addFiles('FILE_NAME', where); // Files in use
});   
```

Now, just fill the information inside the file, according to the package information, the `bower.json` could be helpful to fill missing information you can't find.

So in our case, the final `package.js` file will look like that:
```
// package metadata file for Meteor.js
var packageName = 'dotansimha:angularjs-dropdown-multiselect';
var where = 'client'; // where to install: 'client' or 'server'. For both, pass nothing.
var version = '1.5.2';
var summary = 'Angular 1 Dropdown Multiselect directive';
var gitLink = 'https://github.com/dotansimha/angularjs-dropdown-multiselect';
var documentationFile = 'README.md';

// Meta-data
Package.describe({
  name: packageName,
  version: version,
  summary: summary,
  git: gitLink,
  documentation: documentationFile
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions

  api.use('angular:angular@1.2.0', where); // Dependencies
  api.use('stevezhu:lodash@3.5.0', where); // Surprised?! Read the bower.json file!

  api.addFiles('src/angularjs-dropdown-multiselect.js', where); // Files in use
});   
```

**Important Notes:**

* The prefix for the package name should be the package author username - you can use YOUR username or create an Meteor organization and use that name you created.
* The dependencies are build in this form: AUTHOR\_NAME:PACKAGE\_NAME@VERSION, you can also FORCE a specific version by adding "=" before the version number.
* In this case, a dependency on *Lodash* is needed, so we will search the Atmposhere website for Lodash package and we will find the full package name.
* It's okay to use the source file and not the minified version of the package - because on production - Meteor minifies everything for you!

So now, after we created the `package.js` file, we just need to run the Meteor's publish command on the folder with the package file:
```
meteor publish
```

And if the package does not exists, we need to add `--create` flag:
```
meteor publish --create
```

So now - the package will be registered on Atmosphere package manager and you'll be able to use it.

The last part of this solution is to commit the `package.js` file into your forked repository, and then create a Pull Request in order to help the package's author to maintain the Meteor package on a regular basis.

**If you want to provide even some more helpful solution** - you can use [these instructions](https://github.com/MeteorPackaging/grunt-gulp-meteor) to create a Gulp/Grunt task that automatically published a new version of the package every time the developer publishes a new release.

# Solution #2
This is a more simple solution - this solution will be useful in case you want just to create an Atmosphere package without helping the developer to integrate Meteor in his versions publishing process.

You can just use `bower`, install the package locally on your computer, then create a `package.js` file and run `meteor publish`.

But you can even be more lazy! there is a tool named [angular-meteor-publisher](https://github.com/dotansimha/meteor-package-publisher) that provides a full solution for transferring a package from `bower` (will support NPM on the future) into `Atmosphere` just by providing the meta-data.

You  just need to provide the basic information of the source package (the `bower` meta-data, usually it's `bower install angular-ui-router@0.2.14` and the destination meta-data (the information that Atmosphere requires), add the JS and CSS files and the package dependencies and just run it by using:
```
node meteor-package-publisher myJSONfile.json
```

For example, this is how the ngInfiniteScroll package will be published using this tool (the JSON meta-data file):
```
{
  "source": {
    "type": "bower",
    "name": "ngInfiniteScroll",
    "version": "1.2.1"
  },
  "destination": {
    "atmospherePackageName": "ng-infinite-scroll",
    "atmosphereOrganizationName": "srozegh",
    "summary": "Infinite Scrolling for Angular 1",
    "git": "https://github.com/sroze/ngInfiniteScroll",
    "documentation": null,
    "versionsFrom": "METEOR@0.9.0.1",
    "filesToAdd": [
      {"name": "build/ng-infinite-scroll.js", "platforms": ["client"]}
    ],
    "use": [
      {"name": "jquery@1.11.3_2", "platforms": ["client"]},
      {"name": "angular:angular@1.3.15_1", "platforms": ["client"]}
    ]
  }
}
```

# Summary
As you can see, using existing packages in your angular-meteor application is simple, and when we encounter a third-party library without Meteor package support we can help by creating the "package.js" file and created a pull request (Solution #1).

Also, you can use a automatic publisher that helps us to publish packages real quick (Solution #2).

**We prefer that the first solution will be your choice in order to enrich the Meteor and angular-meteor community and help other developers to use third-party packages.**

{{/template}}
