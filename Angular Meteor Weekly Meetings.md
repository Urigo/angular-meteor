
# Angular Meteor community team Weekly Meeting
(format copied from the Angular team)


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
