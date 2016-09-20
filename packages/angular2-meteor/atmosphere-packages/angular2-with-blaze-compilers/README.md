## Angular 2 compilers for Meteor with Blaze

This package uses and registers the compilers that required for working with Angular 2.0 in Meteor.

The compilers are: 
* HTML templates compiler (which compiles `ng2.html` files) in the client side so you can use both Blaze templates and Angular 2 HTML templates.
* TypeScript compilers (which compiler `ts` files) in both client & server.

The TypeScript compiler in use is [barbatus/ts-compilers](https://github.com/barbatus/ts-compilers). 

### Installing the compilers

Add the compilers for Angular 2.0 by running:
```
$ meteor add angular2-compilers
```

Note that with this package, you do not have to remove `blaze-html-templates' package from your app.


### How to use those compilers?

So you do not have to do anything else besides adding the compilers to your project. 
The compilers will automatically compiles every `.ts` file and `.ng2.html` file you add to your project.
