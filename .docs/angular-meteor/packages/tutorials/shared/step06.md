{{#template name="shared-step06"}}

# Deploying your app

Now that we have a working todo list app, we can share it with our friends! Meteor makes it really easy to put an app up on the internet where other people can use it.

Simply go to your app directory, and type:

```bash
meteor deploy my_app_name.meteor.com
```

Once you answer all of the prompts and the upload completes, you can go to `http://my_app_name.meteor.com` and use your app from anywhere. 

Try opening the app on multiple devices such as your phone and your friend's computer. Add, remove, and check off some tasks and you will see that the UI of your app is really fast. That's because Meteor doesn't wait for the server to respond before updating the interface - we'll talk about this more in step 11.

Congratulations, you've made a working app that you can now use with your friends! In later steps we will add more functionality involving multiple users, private tasks, and search. First, we'll take a detour to see that while we were building a web app, we also created a pretty nice mobile app along the way.
{{/template}}
