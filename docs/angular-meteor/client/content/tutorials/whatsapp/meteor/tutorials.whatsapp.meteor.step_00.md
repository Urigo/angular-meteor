{{#template name="tutorials.whatsapp.meteor.step_00.md"}}
Start by installing the Meteor platform if you haven't already.

Create a new project by running this commands in your Terminal:

    $ meteor create whatsapp
    $ cd whatsapp

Your app now contains a live and ready example app. let’s delete those files:

    $ rm whatsapp.*

To run our app simple type `meteor` on the command line:

    $ meteor

We can also run our app inside the iOS Simulator or Android Emulator - we just need to add the platform so Meteor will build the project for the new platform.

    $ meteor add-platform ios

Or

    $ meteor add-platform android


And now to run our project in a mobile environment, we just need to tell Meteor which platform we want to run (running the mobile is an addition to the server and client run):

    $ meteor run ios

Or

    $ meteor run android


You can find more information about Meteor CLI and build tool here:

[https://www.meteor.com/tool](https://www.meteor.com/tool)


Our next step is to remove Blaze (Meteor default templating engine) and add the Angular and Ionic packages to the project:

    $ meteor remove blaze-html-templates

We also need to remove Meteor's default ECMAScript2015 package named `ecmascript` because Angular-Meteor uses a package named `angular-babel` in order to get both ECMAScript2015 and AngularJS DI annotations:
    
    $ meteor remove ecmascript

and now let's add Angular and Ionic:

    $ meteor add angular
    $ meteor add driftyco:ionic

If you’re familiar with the Meteor folder structure and AngularJS module initialization, you can go ahead and skip to the end of this step and just download the ZIP file.

{{/template}}
