## Angular 2 styles compiler for Meteor

Processes styles and makes them accessible in the ways styles are used in Angular 2.

> Currenly simple CSS files are not supported, only LESS and SASS ones.
> Make sure to remove `less` and `sass` (if installed) packages to avoid conflicts.

### Usage

If a style file is placed in the `client` folder, it'll be processed as 
a regular Meteor style file, i.e., bundled together with other style files.

But if it's placed in the `imports` folder of your app, then there become available
two other ways to access styles for a Angular 2 component.

 - One way is to access them via URL using `styleUrls` property.
   If there is a component named Foo, and you want it to download own styles file
   `./foo.less` (i.e., placed in the same folder with component) from the server,
   then the following snippet will do the job:

   ```ts

    import styleUrl from './foo.less!url';

    @Component({
      selector: 'foo',
      styleUrls: [styleUrl]
    })
    class Foo {
    }

   ```
  
 - Another way is to have styles delivered to the client along with the component itself.
   In this way, you'll need to import the style file explicitly and use `styles` property, i.e.:

   ```ts

    import style from './foo.less'

    @Component({
      selector: 'foo',
      styles: [style]
    })
    class Foo {
    }

   ```

### Examples
 
Check out [TODO demo](https://github.com/Urigo/angular-meteor/tree/master/packages/angular2-meteor/examples/todos-meteor-1.3) and its `imports` folder particularly for more info.
 
