## Angular 2 compilers for Meteor

This package uses and registers the compilers that required for working with Angular 2.0 in Meteor.

The compilers are: 
* HTML templates compiler (which compiles `html` files) in the client side.
* TypeScript compilers (which compiler `ts` files) in both client & server.

The TypeScript compiler in use is [barbatus/ts-compilers](https://github.com/barbatus/ts-compilers). 

### Installing the compilers

In order to use those compilers, you need first to remove the default HTML compiler in Meteor, by running:
```
$ meteor remove  blaze-html-templates
```

And then add the compilers for Angular 2.0 by running:
```
$ meteor add angular2-compilers
```

### How to use those compilers?

So you do not have to do anything else besides adding the compilers to your project. 
The compilers will automatically compiles every `.ts` file and `.html` file you add to your project.
