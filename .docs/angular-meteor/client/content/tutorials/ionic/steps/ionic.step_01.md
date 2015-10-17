{{#template name="ionic.step_01.md"}}
Now we have an app.  let’s make it look like Whatsapp.
We are going to start with the Chats list.

As this chapter is just about UI, to make things short, you can download the end result of this step [here](https://github.com/idanwe/ionic-whatsapp/archive/7b5569653f8ef732c10f7b261e4334b15a883099.zip).

To follow the complete list of step by step changes, please check out the commit list here (From 2.1 to 2.24):

[https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/commits/master?page=4](https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/commits/master?page=4)

Running the result of step 2 on the iOS simulator

    $ npm install -g ios-sim
    $ cordova platform add ios
    $ ionic emulate

And it should look like that:

{{tutorialImage 'ionic' '1.png' 500}}

And if you swipe a menu item to the left:

{{tutorialImage 'ionic' '2.png' 400}}

{{/template}}
