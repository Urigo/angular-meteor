{{#template name="tutorials.whatsapp.meteor.step_08.md"}}

Our last step is adding ability to send image message in the chat. We will use the same package from the previous step!

So we will use the same logic of taking the picture in the controller, and call the same `newMessage` server method:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="8.1"}}

And now we need to add the `ng-click` to the image button on the view:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="8.2"}}

In the server, we need to add support for sending image messages - it’s just another validation scheme for the `newMessage` method:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="8.3"}}

Our next step is to add the view of the image messages in the chat detail view:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="8.4"}}

And some CSS to limit the images size:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="8.5"}}

We also want to add image icon on the chats list in case of the last message is an image message, so let’s add it:

{{> DiffBox tutorialName="whatsapp-meteor-tutorial" step="8.6"}}

And this is the result:

{{tutorialImage 'whatsapp-meteor' '17.png' 500}}



{{/template}}
