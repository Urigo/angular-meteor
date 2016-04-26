## Style Guide

For the coding style guide, we use AirBnB [rules](https://github.com/airbnb/javascript) with TypeScript specifics and max line width set to 100 symbols. Rules are partly enforced by the tslint.json file in the root (if you are not familiar with TSLint, read more [here](https://github.com/palantir/tslint)). Please, check that your code conforms with the rules before PR.

### Clone the source to your computer

In order to work with this package locally when using Meteor 1.3 project, follow these instructions:

1. Clone this repository to any folder. 
   Note that if you clone into Meteor project directory - you need to put the cloned folder inside a hidden file, so Meteor won't try to
   build it! Just create a folder that starts with `.` under your project root, it should look like that:
   ````
   MyProject
      .local-work
         angular2-meteor
      .meteor
      client
      server
      public
   ````

2. Make sure that you already have `node_modules` directory under your root, if not — create it:
   ````
   $ mkdir node_modules
   ````

   Also, make sure that you have a NPM project initialized in your directory (you should have `package.json`), if not — use:
   ````
   $ npm init
   ````

3. Make sure that you do not have angular2-meteor already - check under `node_modules` — if you do, delete it.

4. Now you have two options, you can specify the local copy in the `package.json` of your project, as follow:
   ````json
   {
      "dependencies": {
         "angular2-meteor": "./local-work/angular2-meteor"
      }
   }
   ````

   And then make sure to run the NPM install command:
   ````
   $ npm install
   ````
   
   **Or, ** you can link the directory using NPM command like tool, as follow:
   ```
   $ npm link ./local-work/angular2-meteor
   ```
   
### Building the project from sources

In order to use your local copy of Angular2-Meteor, you have two options:

1. Import the TypeScript source code from the package, for example:

   ````
   import {MeteorComponent} from 'angular2-meteor/modules/meteor_component.ts';
   ````
   
2. Or, you can keep the same code you have now, but you will need to build Angular2-Meteor source code each change you perform, by
   running `gulp build`.

### Troubleshoot

When working with local package, note that you should never have two local packages of `angular2` package, you should have it only under `node_modules/angular2` of the root directory. 
In case of weird errors regarding missing direcrtives - make sure that you do not have a copy of `angular2` package under `node_modules/angular2-meteor/node_modules/angular2`!
