# Roadmap

We manage the project roadmap in Github issues and milestones. There is a [public Waffle board](https://waffle.io/Urigo/angular-meteor)
dedicated to `angular-meteor`. You can add an issue about what you want to see in the library or in the tutorial.

# [Tutorial](http://angular-meteor.com/tutorial)

Our goal with the tutorial is to add as many common use cases as possible. If you want to create and add your own
chapter we would be happy to help you writing and adding it.

Also if you want to record a video for a chapter we would love to help you.

# Code

We would love to get your pull requests. At any case, please make sure there is an issue for the thing you are trying to solve.

Your code should contain tests relevant for the problem you are solving.

If you want to contribute and need help or don't know what should you do, you can [contact me directly](https://github.com/urigo)

# Contribution setup

## Setup repository

Fork angular-meteor and clone the angular-meteor library to another directory named `angular`
```
mkdir angular
git clone https://github.com/[your_username]/angular-meteor.git angular
```

## Commit message format

This project follows the `angular` project git commit message format.
Please refer to the [official documentation](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).

## Run local angular-meteor in your project

Create your Meteor Project

```bash
meteor create myProject
cd myProject
```

Create a `packages` directory under your project's root folder and link your forked repo

```bash
cd myProject
ln -s ~/path_to_your_repos/angular/packages/
```

Now you can start using your own copy of the `angular-meteor` project from `myProject`.

## Running tests

In the command line
```
npm run test:watch
```

Then go to `localhost:3000` in your browser

## Contributing to documentation and tutorials.

Whether it's a typo, some clarification, or a whole new feature - here's how to get started:

1. Clone angular-meteor on your local machine
2. Go to the docs directory at `cd docs/angular-meteor`
3. Run the app for the documentation `meteor`
4. Start tweaking and updating!
