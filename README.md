<a href="http://angular-meteor.com/"><img src="http://angular-meteor.com/images/logo-large.png" width="60" height="60" /></a>  [angular-meteor](http://angular-meteor.com/tutorial) [![Build Status](https://travis-ci.org/Urigo/angular-meteor.svg?branch=master)](https://travis-ci.org/Urigo/angular-meteor) [![Bower version](https://badge.fury.io/bo/angular-meteor.svg)](http://badge.fury.io/bo/angular-meteor)
======================================================

> The power of Meteor and the simplicity and eco-system of AngularJS

[![ng-conf](http://img.youtube.com/vi/_mu6BWsnaPM/0.jpg)](https://www.youtube.com/watch?v=_mu6BWsnaPM)

## Getting started with Angular Meteor

[Getting started tutorial](http://angular-meteor.com/tutorial)

## Documentation
- [Official website](http://angular-meteor.com)
- [Example application](https://github.com/Urigo/meteor-angular-socially) (Final version of the tutorial)
- Questions and help - [stack-overflow `angular-meteor` tag](http://stackoverflow.com/questions/tagged/angular-meteor)
- [Discussions - the Meteor Forum](https://forums.meteor.com/)
- [Report issues](https://github.com/Urigo/angular-meteor/issues)
- [Change Log, updates and breaking changes](https://github.com/Urigo/angular-meteor/releases)
- [Meteor Blog](https://info.meteor.com/blog)
- [Official Meteor guide for best practices](http://guide.meteor.com/)
- [Awesome Meteor](https://github.com/Urigo/awesome-meteor) - A curated, community driven list of awesome Meteor packages, libraries, resources and shiny thing
- Starters - [Angular-Meteor Platform](https://github.com/planet-training/angular-meteor-platform), [angular-meteor Yeoman generator](https://github.com/ndxbxrme/generator-angular-meteor), [Angular-Meteor-Boilerplate with TypeScript](https://github.com/ShMcK/Angular-Meteor-Boilerplate)
- [Roadmap - Trello board](https://trello.com/b/Wj9U0ulk/angular-meteor)

### Meteor Project
1. Install [Meteor](http://docs.meteor.com/#quickstart) `$ curl https://install.meteor.com | /bin/sh`
2. Create a new meteor app using `$ meteor create myapp` or navigate to the root of your existing app
3. Install Angular `$ meteor add angular`
4. Remove unneeded packages `$ meteor remove blaze-html-templates ecmascript`

### Meteor client side - with Bower
> Use Meteor as a service in your existing non Meteor angular application

1. Install [meteor-client-side](https://github.com/idanwe/meteor-client-side) `$ bower install meteor-client-side`
2. Install angular-meteor `$ bower install angular-meteor`

## Contributing
We would love contributions in:

1. Code - We would love to get your pull requests, just don't forget the tests..
2. [Tutorial](http://angular-meteor.com/tutorial) - our goal with the tutorial is to add as many common use cases as possible. If you want to create and add your own chapter we would be happy to help you writing and adding it. Also if you want to record a video for a chapter we would love to help you.
3. [Roadmap](https://trello.com/b/Wj9U0ulk/angular-meteor) - you can add a card about what you want to see in the library or in the tutorial.
4. I ([Urigo](https://github.com/urigo)) live around the world with one small bag, so another way of contributing can be by offering me a place to sleep somewhere interesting around the world that I have to see :)

If you want to contribute and need help or don't know what should you do, you can [contact me directly](https://github.com/urigo)

## Contributor Developer Setup

### Run local angular-meteor in your project

Create your Meteor Project

```bash
meteor create myProject
cd myProject
```

Fork angular-meteor and clone the angular-meteor library to another directory named `angular`
```
mkdir angular
git clone https://github.com/[your_username]/angular-meteor.git angular
```

Create a `packages` directory under your project's root folder and link your forked repo

```bash
cd myProject
ln -s ~/path_to_your_repos/angular/packages/
```

Now you can start using your own copy of the `angular-meteor` project from `myProject`.

### Running tests

In the command line
```
. run_tests.sh
```

Then go to `localhost:3000` in your browser

### Contributing to documentation and tutorials.

Whether it's a typo, some clarification, or a whole new feature - here's how to get started:

1. Clone angular-meteor on your local machine
2. Go to the docs directory at `cd docs/angular-meteor`
3. Run the app for the documentation `meteor`
4. Start tweaking and updating!


## Usage

Go to the [official docs](http://www.angular-meteor.com/)

### Acknowledgement

This project started as [ngMeteor](https://github.com/loneleeandroo/ngMeteor), a pre-0.9 meteorite package. Since then a lot has changed but that was the main base.

Also, a lot of features were inspired by @superchris's [angular-meteor fork of ngMeteor](https://github.com/superchris/angular-meteor)
