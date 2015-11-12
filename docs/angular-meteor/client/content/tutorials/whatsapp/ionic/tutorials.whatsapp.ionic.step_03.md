{{#template name="tutorials.whatsapp.ionic.step_03.md"}}

Now let’s change with chat view to look and work like WhatsApp.

Let’s start with the HTML template:

{{> DiffBox tutorialName="ionic-tutorial" step="3.1"}}

Change the timestamp of the message to be like WhatsApp by displaying the time passed since the message received. we will use and `angular-moment` filter for that:

{{> DiffBox tutorialName="ionic-tutorial" step="3.2"}}

Don’t forget to add the dependency with Bower:

    $ bower install angular-moment --save

And update index.html:

{{> DiffBox tutorialName="ionic-tutorial" step="3.4"}}

And our Angular app’s dependencies:

{{> DiffBox tutorialName="ionic-tutorial" step="3.5"}}

Now let’s add styles to our chat details view. Create a `sass` file named `chat-detail.scss` and paste this code in there:

{{> DiffBox tutorialName="ionic-tutorial" step="3.6"}}

Don’t forget to import that `sass` file to your main `sass` app file:

{{> DiffBox tutorialName="ionic-tutorial" step="3.7" filename="scss/ionic.app.scss"}}

Also copy the following images to the `www/img` folder with their names:

[chat-background.jpg](https://raw.githubusercontent.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/6bc38ead9ec5d18f38314f7ce6ff091ec903e2c1/www/img/chat-background.jpg)
[message-mine.png](https://raw.githubusercontent.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/6bc38ead9ec5d18f38314f7ce6ff091ec903e2c1/www/img/message-mine.png)
[message-other.png](https://raw.githubusercontent.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/6bc38ead9ec5d18f38314f7ce6ff091ec903e2c1/www/img/message-other.png)

This is how it should look now:

{{tutorialImage 'ionic' '4.png' 500}}

Now that our view is ready, let’s bind the real Messages from the server to our chat details controller:

{{> DiffBox tutorialName="ionic-tutorial" step="3.9"}}

Notice that we are using Mongo’s query language to get only the Messages for this particular chat.

We can use the same API on the server and the client thanks to Meteor’s [Minimongo](https://www.meteor.com/mini-databases).

Now let’s add an input directive so we could send messages with.

We need an input directive that will handle all the event on mobile.

Here is a prepared one that handles the `focus`, `blur` and `keydown` events.

{{> DiffBox tutorialName="ionic-tutorial" step="3.10"}}

Add it to a new `input.directive.js` file under a `www/js/directives` folder.

Don’t forget to add the file to `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="3.11"}}

Now add that input directive into our chat details template:

{{> DiffBox tutorialName="ionic-tutorial" step="3.12"}}

Now add the following logic to the `ChatDetailsCtrl` to handle scrolling of the chat according to the state of the mobile keyboard:

{{> DiffBox tutorialName="ionic-tutorial" step="3.13"}}

Now let’s add a send button and event to our view:

{{> DiffBox tutorialName="ionic-tutorial" step="3.14"}}

and add the controller logic to handle that change:

{{> DiffBox tutorialName="ionic-tutorial" step="3.15"}}

And this is what we got so far:

{{tutorialImage 'ionic' '5.png' 500}}

We are calling a Meteor server method named `newMessage`.

Let’s create that server method - create a new file on the server folder named `methods` and add the code inside:

{{> DiffBox tutorialName="ionic-tutorial" step="3.16"}}

We are first checking to see if the parameters are correct using Meteor’s `check` function.
(Add the `check` package but running this command in the command line of the server):

    $ meteor add check

Then we are inserting a new message to the Messages collection and last message field in the containing Chat inside the Chats collection.

Then we are returning the message id to the client.

Notice how easy it is to declare and call server function in Meteor. no need to define end points and http calls. as easy as calling a function on the client.

So now we can call our server method and why for it to work.

But let’s introduce a new concept by Meteor called “[Optimistic UI](http://info.meteor.com/blog/optimistic-ui-with-meteor-latency-compensation)”.

Thanks to the fact the Meteor not only uses Javascript on the backend but also uses the same Database API on the client and the server, we can call the same method on the client first to get an instant response and then call the same function on the server.

Meteor is smart enough to sync the results after the method happened on the server with the connected clients.

For more information, read that blog about Optimistic UI:

[http://info.meteor.com/blog/optimistic-ui-with-meteor-latency-compensation](http://info.meteor.com/blog/optimistic-ui-with-meteor-latency-compensation)

So let’s add Optimistic UI method to newMessage. create a new file in `www/js/stubs.js` and paste the method in:

{{> DiffBox tutorialName="ionic-tutorial" step="3.18"}}

Don’t forget to add the file to `index.html:

{{> DiffBox tutorialName="ionic-tutorial" step="3.19"}}

Notice that we don’t need to change anything in our method call, Meteor already knows to call the Optimistic UI first and then the server one.

In Meteor we don’t need to create that method twice, Meteor’s build process does that for us.

{{tutorialImage 'ionic' '6.png' 500}}

You can download a ZIP file with the project at this point [here](https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/archive/c5039ed596ff07bf9101630823d655ad4e5281c1.zip).

{{/template}}
