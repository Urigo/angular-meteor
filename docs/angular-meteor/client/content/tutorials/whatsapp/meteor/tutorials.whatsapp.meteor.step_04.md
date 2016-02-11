{{#template name="tutorials.whatsapp.meteor.step_04.md"}}

On this step we will authenticate and identify users in our app.

We will use Meteor’s authentication packages, the basic package called Accounts and it has many extensions for Google, Facebook, Phone and many more.

We will use Accounts-phone package that verifies the user using a phone number with SMS messages.

To add this package, run this command:

    $ meteor add okland:accounts-phone

We just need to add some configuration to the server side in order to make it work, so let’s create `server/sms.js` and this is his content:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.2"}}

Let’s add configuration is for debug purposes:

    // Add in order to use with a real twilio account
    // SMS.twilio = {
    //   ACCOUNT_SID: Meteor.settings.TWILIO.SID,
    //   AUTH_TOKEN: Meteor.settings.TWILIO.TOKEN
    // };
    if (Meteor.isServer) {
      if (Meteor.settings && Meteor.settings.ACCOUNTS_PHONE) {
        Accounts._options.adminPhoneNumbers = Meteor.settings.ACCOUNTS_PHONE.ADMIN_NUMBERS;
        Accounts._options.phoneVerificationMasterCode = Meteor.settings.ACCOUNTS_PHONE.MASTER_CODE;
      }
    }

and the `json` settings themselves:

    {
      "TWILIO": {
        "FROM": "meteor-whatsapp",
        "SID": "",
        "TOKEN": ""
      },
      "ACCOUNTS_PHONE": {
        "ADMIN_NUMBERS": ["123456789", "987654321"],
        "MASTER_CODE": "1234"
      }
    }


* This means we can use the numbers `123456789` and `987654321` and they won’t send real SMS message, and then in the confirmation modal, we can always use `1234` and it will work.

* When using real numbers - You should enter a valid phone number - which means a phone number with country code, prefix and the number. for example, for Israel it would be (+972) (54) (554-54-54) so the number is +972545545454, if you need more help, try to get your country code here: https://countrycode.org/ 
 

* While running Meteor and the server in the development stage - you do not need to see the twilio's SMS settings - and every SMS the should be sent to the phone number is actualy just printed to the Meteor's log... so take a look there to get the verification code. 
More info is in the package's page : [https://github.com/okland/accounts-phone](https://github.com/okland/accounts-phone)

Now let’s create the same flow of WhatsApp for authentication: first we need to ask for the user’s phone number, verify it with SMS message and then ask the user to pick his name.

So these flow is created by 3 new views: login, confirmation and profile.

Let’s add these states, each with HTML template and controller:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.3"}}

We will now add the view of login state - it includes an input and a save button and later we will add a modal dialog to verify the user’s phone:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.4"}}

And the controller - the logic is simple - we ask the user to check again his phone number, and then we will use Accounts API in order to ask for SMS verification:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.5"}}

Note the we did not provide all the settings for Account-Phone - so it will run in debug mode - so real SMS won’t be sent now - but to check your app you can see the confirmation in the Meteor’s app log.

Our next step is limit the current views to logged in users only - we will use angular-meteor’s API for that - we will limit the `tab` and `profile` states using `Meteor.user()` which returns the user objct only if the user is logged in:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.6"}}

And now we want to handle a case that this promise does not resolves (in case that the user is not logged in), so let’s create new file - `client/scripts/auth.js` that uses Angular’s config phase:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.7"}}

And now let’s add some CSS:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.8"}}

And this is how it looks like:

{{tutorialImage 'whatsapp-meteor' '13.png' 500}}

The next step is to add the confirmation view, starting with the HTML:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.9"}}

And the controller:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.10"}}

We will use Accounts API again to verify the user and in case of successful authentication we will transition to the `profile` state, which we add in the next step.

This is the `profile` view, which provides the ability to enter the user’s nickname and profile picture (which we will add in the next step).

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.11"}}

And the controller:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.12"}}

And some CSS:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.13"}}

As you can see, the controller uses a server method - `updateName` which we need to implement in the `lib/methods.js`:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.14"}}

Meteor sets the user identity in case of a logged in user into the `this.userId` variable, so we can check if this variable exists in order to verify that the user is logged in.

Now let’s add this validation to the `newMessage` we created earlier, and also add the identity of the user to each message he sends.

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.15"}}

Great, now the last missing feature is logout - let’s add a state for the settings view:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.16"}}

And create the view - it only contains the logout button which calls a method we implemted on the controller:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.17"}}

And let’s implement this method inside the `SettingsCtrl`:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.18"}}

And this is our settings view:

{{tutorialImage 'whatsapp-meteor' '14.png' 500}}

We also need to modify the way we identify our users inside the messages list, so let’s do it:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.19"}}

And the last missing feature is about adding auto-scroll to the messages list in order to keep the view scrolled down when new message arrives!

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="4.20"}}


{{/template}}
