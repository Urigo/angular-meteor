# Meteor-Angular2
Angular2 + Meteor integration.

##### Angular2 version: alpha-37.

## Quick start

### Install package:
    meteor add urigo:angular2-meteor

### Import Angular2 into your app:
Package supports TypeScript and Babel (.jsx files) as languages for development with Angular2.

Angular2 template files are supported through ````ng.html```` extension, same as in [angular-meteor](https://github.com/Urigo/angular-meteor) package.

ES6 modules are supported through SystemJS module loader library.

To start, create ````app.ts```` file, import ````Component```` and ````View```` and then bootstrap the app:
````ts
    import {Component, View, bootstrap} from 'angular2/angular2';
    
    @Component({
      selector: 'app'
    })
    @View({
      template: "<p>Hello World!</p>"
    })
    class Socially {}
    
    bootstrap(Socially);
````
Add ````index.html```` file with the folowing content:
````html
    <body>
        <script>System.import('client/app');</script>
    </body>
````

### Start using Meteor in your Angular2 app:
We need to load bindings that will help us to use Meteor smoothly.

To do that, import ````bootstrap```` from Meteor-Angular2 package and remove previous one imported from ````angular2/angular2````:

````ts
    import {bootstrap} from 'angular2-meteor';
    
    ....
    
    bootstrap(Socially);
````

Since that, you can use Meteor collections in the same way as you would do in a regular Meteor app with Blaze:

In ````client/app.ts````:
````ts
    ....
    
    @View({
      templateUrl: 'client/app.ng.html'
    })
    class Socially {
        constructor() {
          this.parties = Parties.find();
        }
    }
    
    ....
````

Add Angular2 template file ````app.ng.html```` with the following content:
````html
    <div *ng-for="#party of parties">
      <p>Name: {{party.name}}</p>
    </div>
````


**At that moment, you are ready to go!**

To unleash full power of what mixing Angular2 and Meteor gives us,
please refer to Parties app example.

## TODO:
- Update Angular2 tutorial at http://angular-meteor.com/tutorials/angular2;
- Add TypeScript's Meteor typings;
- Integrate other Angular2 modules which can be used with Meteor in a more convenient way (e.g. ````ControlGroup````);
- Increase test coverage.

