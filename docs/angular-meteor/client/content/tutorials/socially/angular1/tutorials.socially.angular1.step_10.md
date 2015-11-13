{{#template name="tutorials.socially.angular1.step_10.md"}}
{{> downloadPreviousStep stepName="step_10"}}

Now that we have a working app, we can go public!
Meteor makes it really easy to put an app up on the internet where other people can use it.

Simply type in the command line of your app directory
(replace `myappname` with your own name and make sure there is no existing site already deployed in the same address):

    meteor deploy myappname.meteor.com

Once you answer all of the prompts and the upload completes, you can go to `http://myappname.meteor.com` and use your app from anywhere.

Try opening the app on multiple devices such as your phone and your friend's computer.
Add, remove, and invite some parties and you will see that the UI of your app is really fast.
That's because Meteor doesn't wait for the server to respond before updating the interface - thanks to Meteor's latency compensation mechanism.

# Summary

Congratulations, you've made a working app that you can now use with your friends!

Now, we'll take a detour to see that while we were building a web app, we also created a pretty nice mobile app along the way.

{{/template}}

