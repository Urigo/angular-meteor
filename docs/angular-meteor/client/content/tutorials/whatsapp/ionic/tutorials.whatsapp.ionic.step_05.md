{{#template name="tutorials.whatsapp.ionic.step_05.md"}}
We will add now the ability to create new chats with new users and remove existing chats.

Let’s add the open-new-chat button to the chat’s list:

{{> DiffBox tutorialName="ionic-tutorial" step="5.1"}}

Add simple logic to the Chats controller to open a modal to choose the users to add to the chat:

{{> DiffBox tutorialName="ionic-tutorial" step="5.2"}}

Create the new modal view in a new file called `new-chat.html` inside the `www/templates/` folder:

{{> DiffBox tutorialName="ionic-tutorial" step="5.3"}}

Add the controller for the modal in file named `new-chat.controller.js`:

{{> DiffBox tutorialName="ionic-tutorial" step="5.4"}}

The controller brings the users who are not the current user.

Now add the logic to create a new chat to the controller:

{{> DiffBox tutorialName="ionic-tutorial" step="5.5"}}

the controller checks if there is already a chat with the same user and direct to that chat or creates a new one in case there is non.

Don’t forget to add the controller to `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="5.6"}}

Now let’s add a server method to create a new chat:

{{> DiffBox tutorialName="ionic-tutorial" step="5.7"}}

And an Optimistic UI one:

{{> DiffBox tutorialName="ionic-tutorial" step="5.8"}}

Now let’s name the chat’s by the users using it.

Let’s create an Angular filter for that:

{{> DiffBox tutorialName="ionic-tutorial" step="5.11"}}

Don’t forget to update `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="5.12"}}

And add it to chat’s list:

{{> DiffBox tutorialName="ionic-tutorial" step="5.9"}}

And chat details:

{{> DiffBox tutorialName="ionic-tutorial" step="5.10"}}

And let’s a chat picture of the users using it or a default picture in case they don’t have profile pictures:

{{> DiffBox tutorialName="ionic-tutorial" step="5.15"}}

Don’t forget to update `index.html`:

{{> DiffBox tutorialName="ionic-tutorial" step="5.16"}}

And add it to chat’s list:

{{> DiffBox tutorialName="ionic-tutorial" step="5.13"}}

And chat details:

{{> DiffBox tutorialName="ionic-tutorial" step="5.14"}}

Add this svg file to the `www/img` folder as the default chat image:

[user-default.svg](https://raw.githubusercontent.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/08a077852d1e42df538fcb20b7719cd33e90c535/www/img/user-default.svg)

{{tutorialImage 'ionic' '10.png' 500}}


# Removing chat

Right now anyone can remove a chat and that’s not so secure…

That’s because we are using a client side function for that action and not securing it.

To start securing our server from client side actions we need to remove the `insecure` package.

In the Meteor command line type:

    $ meteor remove insecure

Now let’s create a secure server method:

{{> DiffBox tutorialName="ionic-tutorial" step="5.19"}}

And an Optimistic UI one:

{{> DiffBox tutorialName="ionic-tutorial" step="5.20"}}

And change the Chats controllers to use that method instead of the client side action:

{{> DiffBox tutorialName="ionic-tutorial" step="5.21"}}

You can download a ZIP file with the project at this point [here](https://github.com/idanwe/ionic-cli-meteor-whatsapp-tutorial/archive/6bc532ea61616bdf691205da0f9a133e5147822d.zip).

{{/template}}
