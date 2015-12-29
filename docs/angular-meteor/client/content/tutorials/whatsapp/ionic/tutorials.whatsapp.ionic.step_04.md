{{#template name="tutorials.whatsapp.ionic.step_04.md"}}
Our app needs Users and authentication.

Meteor’s authentication system has many possible authentication providers like Facebook, Google Account and [more](http://docs.meteor.com/#/full/meteor_loginwithexternalservice)).

WhatsApp uses SMS authentication so we are going to do the same.

We will use the [accounts-phone](https://github.com/okland/accounts-phone) package for that.

Let’s add that package to our Meteor server by running the following command on the Meteor command line:

    $ meteor add okland:accounts-phone

So save time and not use real SMS in development we can configure the package to have admin numbers that will always work without actually sending SMS message and a token that will always work.

To do that, create a `settings.json` file under the `server` folder and enter the following settings inside:

{{> DiffBox tutorialName="ionic-tutorial" step="4.2"}}

This means we can use the numbers `123456789` and `987654321` and they won’t send real SMS message, and then in the confirmation modal, we can always use `1234` and it will work.

And create `sms.js` file under `server` to define the `accounts` package to use those settings:

{{> DiffBox tutorialName="ionic-tutorial" step="4.3"}}

Now when you run the Meteor server, use the following command line:

    $ meteor run --settings settings.json

Now let’s add Accounts-Phone to our client app. in the client command line type:

    $ bower install accounts-phone --save

Don’t forget to update `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="4.5"}}

Now let’s create our login flow.

We will start from a login screen where the user can type in its phone number. Then we move the user to a confirmation screen where he can type his confirmation number.

From there we transfer the user to his profile page.

So let’s start with the logic screen.

Add the login state to our routes.js file:

{{> DiffBox tutorialName="ionic-tutorial" step="4.6"}}

and the login view:

{{> DiffBox tutorialName="ionic-tutorial" step="4.7"}}

and controller:

{{> DiffBox tutorialName="ionic-tutorial" step="4.8"}}

Don’t forget to update `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="4.9"}}

In our Login controller we poping up a modal for the user to include his phone number. then sending that number to the `Accounts.requestPhoneVerification` function. After it sends the SMS, we are redirecting the user to the `confirmation` state.

Let’s add the `confirmation` state to our `routes.js` file:

{{> DiffBox tutorialName="ionic-tutorial" step="4.10"}}

The confirmation view:

{{> DiffBox tutorialName="ionic-tutorial" step="4.11"}}

And the controller:

{{> DiffBox tutorialName="ionic-tutorial" step="4.12"}}

Don’t forget to update `index.html`: 

{{> DiffBox tutorialName="ionic-tutorial" step="4.13"}}

On the conformation controller we pass the phone number and the verification code to the `Accounts.verifyPhone` function and if successful, we redirect the user to his profile page.

Let’s add the `profile` state to our `routes.js` file:

{{> DiffBox tutorialName="ionic-tutorial" step="4.14"}}

The profile view where the user can update his name:

{{> DiffBox tutorialName="ionic-tutorial" step="4.15"}}

And the controller:

{{> DiffBox tutorialName="ionic-tutorial" step="4.16"}}

Don’t forget to update `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="4.17"}}

The profile controller is calling the `updateName` Meteor method so let’s create that:

{{> DiffBox tutorialName="ionic-tutorial" step="4.18"}}

Now let’s add some styles to login:

{{> DiffBox tutorialName="ionic-tutorial" step="4.19"}}

And profile:

{{> DiffBox tutorialName="ionic-tutorial" step="4.22"}}

and import them to our main `sass` file:

{{> DiffBox tutorialName="ionic-tutorial" step="4.23" filename="scss/ionic.app.scss"}}


Now that we have a login process, we can stop unlogged users from going into the app.

{{tutorialImage 'ionic' '7.png' 500}}

`angular-meteor-auth` provides us with the [$auth.requireUser](http://www.angular-meteor.com/api/auth) function that we can use in the `resolve` of ui-router to make sure unlogged user can’t go inside that route:

Update the `angular-meteor-auth` bundle dependency in the `index.html` file:

{{> DiffBox tutorialName="ionic-tutorial" step="4.24"}}

and add the `angular-meteor.auth` dependency to our Angular app:

{{> DiffBox tutorialName="ionic-tutorial" step="4.25"}}

Resolve the user at the routes:

{{> DiffBox tutorialName="ionic-tutorial" step="4.26"}}

And let’s handle those unlogged users and redirect them to the `login` state.

Create an `auth.js` file and place this code inside:

{{> DiffBox tutorialName="ionic-tutorial" step="4.27"}}

And don’t forget to update `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="4.28"}}

But of course that client side authentication is not enough and we need to protect our server as well.

Let’s add security checks inside our server methods:

{{> DiffBox tutorialName="ionic-tutorial" step="4.29"}}

Also, now that we know the logged-in user we can distinguish the message he sent and the messages others has sent.

We will use `$auth.currentUser` an `angular-meteor-auth` extension to the `$rootScope`.

Let’s update the chat-details view to handle that:

{{> DiffBox tutorialName="ionic-tutorial" step="4.32"}}

and add that information to our messages in the “newMessage” method:

{{> DiffBox tutorialName="ionic-tutorial" step="4.30"}}

and the Optimistic UI one as well:

{{> DiffBox tutorialName="ionic-tutorial" step="4.31"}}

One last things for this chapter - the ability to Logout.

Let’s add a settings view inside a new file called `tab-settings.html` inside the `www/templates/` folder:

{{> DiffBox tutorialName="ionic-tutorial" step="4.33"}}

Add a state for it:

{{> DiffBox tutorialName="ionic-tutorial" step="4.34"}}

A controller that simple call the `Meteor.logout`:

{{> DiffBox tutorialName="ionic-tutorial" step="4.35"}}

Don’t forget to update `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="4.36"}}

{{tutorialImage 'ionic' '8.png' 500}}

{{tutorialImage 'ionic' '9.png' 500}}


You can download a ZIP file with the project at this point [here](https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/archive/20252b19bb04ad71a3974835acacfe06034dfc6f.zip).

{{/template}}
