## Angular 2 compilers for Meteor

This package combines three compilers required to develop with Angular 2.0 in Meteor.

The compilers are: 
* [HTML processor](https://github.com/Urigo/meteor-static-html-compiler)
* [LESS compiler](https://github.com/Urigo/angular-meteor/tree/master/packages/angular2-meteor/atmosphere-packages/css-compiler)
* [TypeScript compiler](https://github.com/barbatus/typescript)

### Installing the compilers

In order to use those compilers, you need first to remove the default HTML compiler in Meteor, by running:
```
$ meteor remove blaze-html-templates
$ meteor remove less
```

And then add the compilers for Angular 2.0 by running:
```
$ meteor add angular2-compilers
```

### How to use those compilers?

So you do not have to do anything else besides adding the compilers to your project. 
The compilers will automatically compiles every `.ts`, `.html` or `.less` file you add to your project.
