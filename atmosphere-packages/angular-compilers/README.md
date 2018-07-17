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
 $ meteor add angular-compilers
 ```

 Angular's compiler-cli and other libraries are peer dependencies of this package, so you need to add them to you project.
 ```
 $ meteor npm install @angular/core @angular/common @angular/compiler @angular/compiler-cli typescript --save-dev
 ```

## Compiler modes

### Default mode (development)
By default, this compiler compiles ts-files into CommonJS modules and serves component assets (HTML, LESS, and SASS) dynamically, which then are passed to Meteor to load.
In this case, the app is bootstrapped using regular dynamic bootstrapping:
```ts
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

In this case, Angular uses just-in-time template compiler to parse component
templates before the app is loaded.

## AoT mode (Enabled by default in production)
If the app is launched with the `AOT` environment variable preset, i.e, `AOT=1 meteor`,
the compiler's AoT mode comes into play. Compiler uses internally
Angular's CLI metadata and Angular's template compilers in order to
pre-compile component assets, first, into ES6 ts-modules, and then TypeScript compiler to
compile those ts-modules to regular ES6 js-modules. As a result,
each file with `@Component`, `@Directive`, or `@NgModule` annotations will
correspond internally to an ES6 js-module with the special Angular module component or module factories
(they usually have `.ngfactory` extension if processed with `ngc` directly).

## Tree-shaking mode (Disabled by default in production)
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

### Templates (HTML) and Stylesheets (SCSS)
If the asset files (templates and stylesheets) located in imports folder, they would be added to the application module lazily to be added in any components. Otherwise, they would be merged, and added to main boilerplate.

# Use in components or global
`/client/main.scss` and `/client/main.html` directly added to `/merged-stylesheets.css`
`/client/imports/app.scss` and `/client/imports/app.html` would be used in `/client/imports/app.component.ts` via regular `Component` declaration
```ts
  @Component({
    templateUrl: 'app.html',
    styleUrls: ['app.scss']
  })
  export class AppComponent {}
```
Be careful about `ViewEncapsulation` for UI frameworks like Angular Material and Ionic, if you are using `AppComponent` as global stylesheet source.
In this case you should disable encapsulation by using `ViewEncapsulation.None` as noted in `Angular Material` [docs](https://material.angular.io/guide/theming#defining-a-custom-theme)
```ts
  import { ViewEncapsulation } from '@angular/core';
  @Component({
    templateUrl: 'app.html',
    styleUrls: ['app.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class AppComponent {}
```

# Import from node_modules
`Angular SCSS Compiler` is able to understand `NPM` modules.
- For example in `Angular Material`
```scss
    @import '@angular/material/theming';
    // Plus imports for other components in your app.

    // Include the common styles for Angular Material. We include this here so that you only
    // have to load a single css file for Angular Material in your app.
    // Be sure that you only ever include this mixin once!
    @include mat-core();

    // Define the palettes for your theme using the Material Design palettes available in palette.scss
    // (imported above). For each palette, you can optionally specify a default, lighter, and darker
    // hue.
    $candy-app-primary: mat-palette($mat-indigo);
    $candy-app-accent:  mat-palette($mat-pink, A200, A100, A400);

    // The warn palette is optional (defaults to red).
    $candy-app-warn:    mat-palette($mat-red);

    // Create the theme object (a Sass map containing all of the palettes).
    $candy-app-theme: mat-light-theme($candy-app-primary, $candy-app-accent, $candy-app-warn);

    // Include theme styles for core and each component used in your app.
    // Alternatively, you can import and @include the theme mixins for each component
    // that you are using.
    @include angular-material-theme($candy-app-theme);
```

### Lazy Loading
Meteor is able to work like `SystemJS` which is used with Angular to load components, routes and assets dynamically thanks to (`dynamic-import`)[https://blog.meteor.com/dynamic-imports-in-meteor-1-5-c6130419c3cd] package.
You can use (Lazy Loading)[https://angular.io/guide/ngmodule#lazy-loading-modules-with-the-router] with `angular-compilers`.
Add a route like `angular.io` example:
```ts
  {
    path: '/lazyRoutePath',
    loadChildren: '/path/to/your-lazy-module#YourLazyModule'
  }
```

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
