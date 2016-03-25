# Contributing to Angular Meteor

We'd love for you to contribute to our source code and to make Angular Meteor even better than it is
today! Here are the guidelines we'd like you to follow:

 - [Code of Conduct](#coc)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Contribution Setup](#setup)
 - [Commit Message Guidelines](#commit)

## <a name="coc"></a> Code of Conduct
I love the Angular community so let's just use thier [Code of Conduct](https://github.com/angular/code-of-conduct/blob/master/CODE_OF_CONDUCT.md).

If you are subject to or witness unacceptable behavior, or have any other concerns, please email me at uri.goldshtein@gmail.com.

## <a name="question"></a> Got a Question or Problem?

If you have questions about how to use Angular Meteor, please direct these to [StackOverflow](http://stackoverflow.com/questions/tagged/angular-meteor) or the [Meteor forums](https://forums.meteor.com/).

## <a name="issue"></a> Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue to our [GitHub Repository](https://github.com/urigo/angular-meteor/). Even better you can submit a Pull Request
with a fix.

## <a name="feature"></a> Want a Feature?

### Submitting an Issue
[Guidelines](https://github.com/Urigo/angular-meteor/blob/master/.github/ISSUE_TEMPLATE.md)

### Roadmap

We manage the project roadmap in Github issues and milestones. There is a [public Waffle board](https://waffle.io/Urigo/angular-meteor)
dedicated to `angular-meteor`. You can add an issue about what you want to see in the library or in the tutorial.

#### [Tutorial](http://angular-meteor.com/tutorial)

Our goal with the tutorial is to add as many common use cases as possible. If you want to create and add your own
chapter we would be happy to help you writing and adding it.

Also if you want to record a video for a chapter we would love to help you.

## <a name="submit"></a> Submission Guidelines

### Submitting an Issue
[Guidelines](https://github.com/Urigo/angular-meteor/blob/master/.github/ISSUE_TEMPLATE.md)

### Submitting a Pull Request
[Guidelines](https://github.com/Urigo/angular-meteor/blob/master/.github/PULL_REQUEST_TEMPLATE.md)

If you want to contribute and need help or don't know what should you do, you can [contact me directly](https://github.com/urigo)

## <a name="setup"></a> Contribution Setup

### Setup repository

Fork angular-meteor and clone the angular-meteor library to another directory named `angular`
```
mkdir angular
git clone https://github.com/[your_username]/angular-meteor.git angular
```

## <a name="commit"></a> Git Commit Guidelines

### Commit message format

This project follows the `angular` project git commit message format.
Please refer to the [official documentation](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).

You can commit changes in interactive mode by running:

```
npm run commit
```

It is a step by step process.

## Run local angular-meteor in your project

### Meteor 1.3

```bash
meteor create myProject
```

Install `angular-meteor` for your application.

```bash
npm install angular-meteor --save
```

Create a globally-installed symbolic link to your forked repository.

```bash
cd /path_to_your_repos/angular-meteor/
npm link
```

Now create a symlink from the local node_modules folder to the global symlink

```bash
cd myProject
npm link angular-meteor
```

You can compile `angular-meteor` by running:

```bash
npm run build
```

If you don’t want to manually recompile after every change you can use watch mode.

```bash
npm run watch
```


### Meteor 1.2

```bash
meteor create myProject
```

Create a `packages` directory under your project's root folder and link your forked repo

```bash
cd myProject
ln -s ~/path_to_your_repos/angular-meteor/packages/
```

The `angular-meteor-data` package uses the main file of `angular-meteor` node module.

To start using a local file you should run:

```bash
npm run dev:start
```

To compile new file for `angular-meteor-data` package you can run:

```bash
npm run build:dev
```

If you don’t want to manually recompile after every change you can use watch mode.

```bash
npm run watch:dev
```

Both above commands run `npm run dev:start` automaticaly, so you don't have to trigger it by yourself.

Now you can start using your own copy of the `angular-meteor` project from `myProject`.

**You should remember one thing**.

Since `angular-meteor-data` package uses main file of `angular-meteor` npm package and you've already changed it using above commands, you should somehow restore that state. It's easy, just use this command:

```bash
npm run dev:stop
```

## Running tests

In the command line

```
npm run test:watch
```

Then go to `localhost:3000` in your browser

## Contributing to documentation and tutorials.

Whether it's a typo, some clarification, or a whole new feature - here's how to get started:

1. Clone angular-meteor on your local machine
2. Clone the docs repository at `https://github.com/urigo/angular-meteor-docs`
3. Run the app for the documentation `meteor`
4. Start tweaking and updating!
