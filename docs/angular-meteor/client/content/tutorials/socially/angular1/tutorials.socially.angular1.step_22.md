{{#template name="tutorials.socially.angular1.step_22.md"}}
{{> downloadPreviousStep stepName="step_21"}}

Ionic is a CSS and JavaScript framework. It is highly recommended that before starting this step you will get yourself familiar with its [documentation](http://ionicframework.com/docs/).

In this step we will learn how to add Ionic library into our project, and use its powerful directives to create cross platform mobile (Android & iOS) applications. 

We will achieve this by creating separate views for web and for mobile  so be creating a separate view for the mobile applications, but we will keep the shared code parts as common code!

### Separate the main view file

So we already have `socially` component, which is the main component, for browser, so we need to move it to the browser package, and update it's AngularJS module name:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.1" filename="packages/socially-browser/client/socially/socially.component.js"}}

> Note that we also changed the `templateUrl` path.

And now let's update the `package.js` of the `socially-browser` package:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.2"}}

So we got the point - let's just do the same with the signup, reset password, parties list, add new party modal and the party details views.

I did it in [this commit](https://github.com/Urigo/meteor-angular-socially/commit/89b159e7e6b42a2540e8886ca6f82f5364ff4f88), and updated the `package.js` in [this commit](https://github.com/Urigo/meteor-angular-socially/commit/f4e927d21fc8fa74f008eec9230f534f9defa7fb).

Also, the filters are one of the thing we can make common right now, because we can use them in both Mobile and Browser, so we move them out of the `parties` folder, but still keep the in the root project (changed it in [this commit](https://github.com/Urigo/meteor-angular-socially/commit/b078a263799e817b7381de516f1ff43559ee7c1b))

In this point - you probably understood that we might need to implement the whole logics of the components again - but do not worry! in the next steps of the tutorial, we will take some of the logics and use them as "common" logics for both platforms!

### Adding Ionic

Using ionic is pretty simple - first, we need to add a dependency in the `package.js` of our `socially-mobile`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.6"}}

Ionic is based on AngularJS, therefore we also need to load the `ionic` as a module dependency in the `socially.mobile` module:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.7"}}

So now we will use Ionic and create the `socially` view again, now with ionic's directives.

This is a simple navigation layout that is copied & pasted from the Ionic documentation.

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.9" filename="packages/socially-mobile/client/socially/socially.html"}}

> The `ion-nav-view` tag is similar to the `ui-view` tag, so we can use the same view (`main`) here.

And add it to the `package.js`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.10"}}

And now the component:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.8"}}

But hey! it's the same component logic! exactly! 

So what can we do? 

We can share the `socially` logic, and load the view according to the platform that we run at the moment!

### Share and make components common

So the basic of sharing components is to put the `.component.js` file in the root project, and put the view of each platform in separated package.

So now we already have view in each package (mobile and browser), so let's make sure that we delete completely the `socially.component.js` from those packages (also from it's `package.js`), and put this implementation of `socially.component.js` under the root project:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.11"}}

> Note that usage of `templateUrl` - we can provide a function, and AngularJS will use it's return value as template url.

So now we have the *same logic* of `socially` component, and the only different thing is the view!


### Using Ionic

And now we need to create the view of the parties list for the mobile platform, using Ionic's directives and CSS.

Now we add the content of the parties list. This is pretty straight forward using Angular directives and Ionic classes:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.13"}}

As with any other file inside a package, this one also need to be added to the `package.js` file :

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.14"}}

So now as we did with `socially` component, we understand that the only difference between the mobile parties list and the browser parties list is the view!

So we can move the `parties-list.component.js` back to the root project (and remove it from the `package.js`!), and use the same trick to load the `templateUrl`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="22.15"}}

And... we're done!

We will use the techniques we learned in Step 21 of the tutorial and run the project in our favorite emulator, I used iOS so

    $ meteor run ios

And this is the result:

{{tutorialImage 'angular1' 'step22_1.png' 500}}

## Summary

In this tutorial we showed how to use Ionic and how to separate the whole view into two different application, using packages isolation and AngularJS modules.

We also learnt how to share component between platforms, and change the view only!

We also used Ionic directives in order to provide user-experience of mobile platform instead of regular responsive layout of website.

Using these techniques we can create a separated code and logic for each platform, but still share some code parts (for example, AngularJS filters, services or components).

{{/template}}