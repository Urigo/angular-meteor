## Angular2 packaged for Meteor

Angular 2's modules are registered and loaded via the SystemJS loader.

Source code is taken from the official [Angular2 NPM](https://www.npmjs.com/package/angular2).

Current version of Angular2 in the package - **beta-9**.

Also, this package adds Babel and TypeScript languages compilers to develop with Angular2.

### Start importing Angular2 modules
After package installation, you can start importing Angular 2 core's components into your Meteor app the same way as you would do it in any other TypeScript or Babel app:

For example, create `app.ts` file and add the next lines:
````ts
import {Component} from 'angular2/core';

import {bootstrap}  from 'angular2/platform/browser';

@Component({
  name: 'demo'
})
class Demo {
}

bootstrap(Demo);
````

Besides core components, `angular2/router` is also available for importing.


### TypeScript
The package uses https://github.com/barbatus/typescript-compiler/tree/angular2-compiler TypeScript compiler package.

At first, you will likely see in the console that names like "Meteor" or "Mongo" are underfined.
To get rid of that issue, you will need to install Angular2 and Meteor definition files in your app.

This package installs Angular2 definition files itself since they can be taken only from the Angular 2 NPM.

For other typings, recommended way to do that is to use `typings` tool as follows:

```
npm install typings -g

typings install meteor --ambient

typings install es6-promise --ambient

typings install es6-shim --ambient
```
