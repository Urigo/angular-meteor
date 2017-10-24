## All-in-One Angular Compiler for Meteor
Package contains one combined Angular compiler for Meteor that provides:
 - Typescript compilation
 - Assets compilation (HTML, styles)
 - Angular's AoT compilation
 - Rollup's bundling with Tree Shaking

### Installing the compilers

 In order to use those compilers, you need first to remove the default HTML compiler in Meteor, by running:
 ```
 $ meteor remove blaze-html-templates
 $ meteor remove less
 ```

 And then add the compilers for Angular by running:
 ```
 $ meteor add ardatan:angular-compilers
 ```

## Compiler modes

### Default mode
By default, this compiler compiles ts-files into CommonJS modules and serves component assets (HTML, LESS, and SASS) dynamically, which then are passed to Meteor to load.
In this case, the app is bootstrapped using regular dynamic bootstrapping:
```ts
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

In this case, Angular uses just-in-time template compiler to parse component
templates before the app is loaded.

## AoT mode
If the app is launched with the `AOT` environment variable preset, i.e, `AOT=1 meteor`,
the compiler's AoT mode comes into play. Compiler uses internally
Angular's CLI metadata and Angular's template compilers in order to
pre-compile component assets, first, into ES6 ts-modules, and then TypeScript compiler to
compile those ts-modules to regular ES6 js-modules. As a result,
each file with `@Component`, `@Directive`, or `@NgModule` annotations will
correspond internally to an ES6 js-module with the special Angular module component or module factories
(they usually have `.ngfactory` extension if processed with `ngc` directly).

## Tree-shaking mode
If the app is launched with `ROLLUP` environment variable preset, i.e, `AOT=1 ROLLUP=1 meteor`;
On the final step all generated factory and component ES6 js-modules
are bundled together using Rollup bundler in the Tree Shaking mode.
Tree Shaking is a special algorithm that traverses graph of the js-modules
(mostly of NPMs but not only) to find modules that are imported but
not used (or to be exact, exports of which are not used).
Then, they are excluded from the bundle.
For more info on that read [here](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html#!#tree-shaking) and [here](https://github.com/rollup/rollup).

As you can see above, this mode introduces a couple of optimizations that take additional time to process
making it a good fit for the production (more reasons you can find below) rather
then for the development where you add new changes often and demand quick response from the compiler.

### Bootstrapping
After the compilation, main Angular module factory should be bootstrapped as follows:
```ts
  import {platformBrowser} from '@angular/platform-browser';
  import {AppModuleNgFactory} from './app.module.ngfactory';
  platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
```
But the compiler takes care of you on this stage as well:
you'll need only to add dynamic bootstrapping (as above),
everything else is taken care of for you. Compiler will find most top
Angular module of your app to boostrap and add bootstrapping code for you.

### Advantages of AOT over the default
Main advantages of the additional processing:
 - Components are loaded faster, hence app itself;
 - Angular template compiler is not needed on the client side,
   hence the final js-bundle is smaller;
 - Compiled code is considered more secure;
 - You have chance to verify that templates are free of bugs,
   which is not fully available with the dynamic compilation;
 - Tree Shaking reduces size of the final bundle.

For more info on the pluses and other details, please, read [here](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html).
