{{#template name="tutorials.socially.angular2.step_10.md"}}

Now that we have a working app, we can go public!
Meteor makes it really easy to put an app up on the internet where other people can use it.

Simply type in the command line of your app directory
(replace `myappname` with your own name and make sure there is no existing site already deployed in the same address):

    meteor deploy myappname.meteor.com

Once you answer all of the prompts and the upload completes, you can go to `http://myappname.meteor.com` and use your app from anywhere.

Now try to play around with the deployed app on different devices.
This might be in a browser on your mobile phone, a laptop or a desktop computer.

Add, remove and change some parties and you will see that all opened versions of the app update
almost simultaneously on different devices.

UI updates of a Meteor app are fast, user-friendly and reliable,
thanks to WebSockets, latency compensation and different complex concepts realized in Meteor.

# Summary

Congratulations, you've made a working app that you can now use with your friends!

You can download the source code of the app up to this point [here](https://github.com/Urigo/meteor-angular2.0-socially/archive/step_09.zip).

In the next step, we'll take a detour to see that while we were building a web app, we've also created a pretty nice mobile app along the way.

{{/template}}
