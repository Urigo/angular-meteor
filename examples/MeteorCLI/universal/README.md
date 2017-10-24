# Angular Meteor Universal w/ AOT
This project shows the usage of *@angular/platform-server* and *@angular/compiler-cli* with *Meteor*

 - Dynamic import without AOT is in dynamic-import branch

How AOT works?
--
- On both server and client, it loads AOT-compiled factories by using angular-compiler

How Universal works?
--
 -  renderModule(JIT) and renderModuleFactory(AOT) with Meteor's server-render

How-to
--
 - Add `server-render` package into your project
 - Move your Angular files into `imports/app`
 - Create `ServerAppModule` in `server-app.module.ts` w/ importing `ServerModule` from `@angular/platform-server` and `AppModule` from `app.module` in `imports/app` folder
 - Change `BrowserModule` in imports to `BrowserModule.withServerTransition({ appId: 'yourAppId' })`
 - Write server bootstrap code into `server/main.ts` like in this example
 - Run your project with command -> `AOT=1 meteor`
 - You have Angular Meteor Universal w/ AOT !!!
 - If you want to disable Universal in Development, you can do `Meteor.isProduction` check before `onPageLoad`
 - If you want to disable AOT compilation, you can run Meteor w/o `AOT=1`

Known issues
--
  - Ionic w/ Universal doesn't work due to this issue - https://github.com/ionic-team/ionic/issues/10699 - You can use Angular Material instead!
