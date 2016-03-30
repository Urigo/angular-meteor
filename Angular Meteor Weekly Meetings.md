
# Angular Meteor community team Weekly Meeting
(format copied from the Angular team)

### Date - 3/30/16
* Meteor 1.3 [has been released](http://info.meteor.com/blog/announcing-meteor-1.3)!!!  
    * Many exciting features for Angular developers:
        * ES2015 Modules
        * Testing
        * npm support - use packages directly from npm
        * Many Cordova improvements
    * The latest Angular1-Meteor and Angular2-Meteor versions have been updated to support both Meteor 1.2 and 1.3
    * [angular-meteor](https://www.npmjs.com/package/angular-meteor) and [angular2-meteor](https://www.npmjs.com/package/angular2-meteor) are now available on npm!
    * Now you can use all of Angular's best practices
        * Angular 1.x - I (Uri) recommend the [Upgrading from 1.x article](https://angular.io/docs/ts/latest/guide/upgrade.html) as the best practice guide. With Meteor 1.3 it's much easier to use those recommendations
        * Tutorials update to Meteor 1.3 and the new Angular best practices
            * [simple-todos-angular](https://www.meteor.com/tutorials/angular/creating-an-app) has been updated
            * [Socially 1.0](http://www.angular-meteor.com/tutorials/socially/angular1/bootstrapping) and [Socially 2.0](http://www.angular-meteor.com/tutorials/socially/angular2/bootstrapping) will be updated by the end of this week
            * [Whatsapp clones](http://www.angular-meteor.com/tutorials/whatsapp/) will be updated next week
* Angular1 Meteor 
    * Current latest version - `1.3.9_2`
    * [changelog](https://github.com/Urigo/angular-meteor/blob/master/CHANGELOG.md)
    * Support for both Meteor 1.2 and 1.3
    * Many many fixes - probably the most solid version to date.
    * Support for older syntax - make deprecation warning to not display by default so you can feel safe to update to the latest version even if you like the older syntax. you can always turn the depracation warnings on [here](http://www.angular-meteor.com/api/1.3.6/settings)
    * I recommend all developers who waited with updating to the latest version to update now to latest.  
* Angular2 Meteor
    * Current Latest version - `0.5.2`
    * Support for both Meteor 1.2 and 1.3
    * Updated to Angular 2.0 latest beta
    * Many fixes and docs
* Typescript
    * [Work](https://github.com/Urigo/angular2-meteor/issues/102) for the official Meteor `typescript` package is at it's latest stages
    * Latest version can be used with the `barbatus:typescript` version `0.2.0`
    * `meteortypescript:compiler` package as been changed to simply imply the latest `barbatus:typescript` package
    * We will rename `barbatus:typescript` to `typescript` in the middle of next week
    * Also looking for help writing a chapter on Typescript to the [Meteor guide](http://guide.meteor.com/)
* Biggest next things we want help with:
    * Angular 1.x to Angular 2.0 migration on top of Meteor
    * Blaze migration guide to Angular 2.0
    * Add SSR for fast loading times with Angular Universal [track](https://github.com/Urigo/angular2-meteor/issues/82)
    * Tell everyone about the great things that are happening in Angular Meteor :)

### Date - 2/17/16
* Angular1-Meteor 1.3.6 released with many fixes
* Meteor 1.3 support for Angular 1.x in version 1.3.7
    * [PR](https://github.com/Urigo/angular-meteor/pull/1239) is after review and almost done
* Typescript
    * The new [merged](https://github.com/urigo/angular2-meteor/issues?utf8=%E2%9C%93&q=label%3A%22component%3A+build%3Atypescript%22+) Typescript package is out in beta - `barbatus:typescript@0.2.0-beta.4`.  [Source code](https://github.com/barbatus/typescript)
* As usual, anyone who wants to help - my email in on my [Github profile page](https://github.com/urigo/)

### Date - 2/10/16
* First Weekly community team meeting with open meeting notes!
* Community participants from Poland, Israel, Croatia and Thailand :)
* Roadmap and tasks moved to Github from Trello  (can also look at [Waffle.io](https://waffle.io/Urigo/angular-meteor))
* Meteor 1.3 support
    * Angular 2
        * Ability to Npm just like any other Angular 2.0 app
        * ES2015 modules support out of the box (no need for System.js)
        * [Track progress](https://github.com/Urigo/angular2-meteor/issues?utf8=%E2%9C%93&q=label%3A%22code+review%3A+0.5.0+milestone%22+)
        * [Meteor issues related to Angular 2.0](https://github.com/meteor/meteor/labels/Project%3AAngular)
        * Meteor-Angular2-Socially - 90% done
        * Ionic 2 - works with 1.3 after our fix merged ([issue](https://github.com/driftyco/ionic/pull/5367))
    * Angular 1.x
        * After 1.3.6-Beta.1
        * [Track progress](https://github.com/Urigo/angular-meteor/issues/1178)
    * Angular1-Meteor 1.3.6
        * [Follow here](https://github.com/Urigo/angular-meteor/issues?utf8=%E2%9C%93&q=milestone%3A1.3.6-beta.1+)
        * [Opened PR](https://github.com/Urigo/angular-meteor/pull/1216)
        * [DAB0mB](https://github.com/DAB0mB/)’s refactoring
        * API compatible with 1.3.5
        * Separate auth package to separate [repo](https://github.com/Urigo/angular-meteor-auth) and versions
        * First beta should be released tomorrow
    * Angular2-Meteor-Data
        * Works great for current apps
        * Discussions about possible improvements
            * [Array access for Mongo.cursor](https://github.com/Urigo/angular2-meteor/issues/143)
            * [Separate MeteorComponent to separate services](https://github.com/Urigo/angular2-meteor/issues/142)
            * Think about the connection with the [Reactive-GraphQL data solution](http://info.meteor.com/blog/reactive-graphql) - should be the solution for any Angular app using Reactive-GraphQL because it won’t be a Meteor specific solution
    * Typescript
        * Merge all existing compilers into one official package
        * All the other Typescript package manager are on board with us
        * [Track here](https://github.com/urigo/angular2-meteor/issues?utf8=%E2%9C%93&q=label%3A%22component%3A+build%3Atypescript%22+)
        * Alex is on it ([@barbatus](https://github.com/barbatus))
        * Making it similar as possible to the official `ecmascript` structure
        * Should we notify or approach someone from the Typescript team at Microsoft?
    * Chores
        * [Auto changelog](https://github.com/Urigo/angular-meteor/issues/1210)
        * Docs updating to Meteor 1.3
        * Tutorials
            * Easy way for beginning contributors to join in
            * [Guide for how to update a tutorial](https://github.com/Urigo/meteor-angular-socially/blob/master/EDIT_THIS_TUTORIAL.md)
            * Socially 1 & 2
            * Whatsapp
            * Create a Whatsapp clone with Ionic 2.0, Angular 2.0 and Meteor 1.3!
            * Record yourself doing the tutorial to update the videos
        * [Meteor guide](http://guide.meteor.com/)
            * Angular 1.x article
            * Angular 2.0 article
            * Typescript article
* As usual, anyone who wants to help - my email in on my [Github profile page](https://github.com/urigo/)
