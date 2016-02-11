{{#template name="tutorials.whatsapp.meteor.step_07.md"}}

So now we will add an ability to add a user profile image - using the device’s camera (mobile phone or laptop camera).

The first part is to add the Meteor package that provide us this ability:

    $ meteor add okland:camera-ui

We will add now a server method for updating the user’s profile image, which is just like updating any other string field of the user’s profile:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="7.2"}}

The next step is to add the button for adding/editing the user’s profile image, we will add it in the `profile` state, so update the view first:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="7.3"}}

And now we will implement the controller methods, which users Camera-UI API for getting the image from the device, and then we will use that image and run the server method for updating the image:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="7.4"}}

We will add now some CSS for better layout of the profile page:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="7.5"}}

And this is an example for taking an image from the browser:

{{tutorialImage 'whatsapp-meteor' '16.png' 500}}

Now to ease the access to the profile page, we will add a link in the Settings view:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="7.6"}}


{{/template}}
