{{#template name="step11SelectivelyPublish"}}

### Selectively publishing tasks based on privacy status

Now that we have a way of setting which tasks are private, we should modify our
publication function to only send the tasks that a user is authorized to see:

```js
// Modify the publish statement
// Only publish tasks that are public or belong to the current user
Meteor.publish("tasks", function () {
  return Tasks.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
});
```

To test that this functionality works, you can use your browser's private browsing mode to log in as a different user. Put the two windows side by side and mark a task private to confirm that the other user can't see it. Now make it public again and it will reappear!

### Extra method security

In order to finish up our private task feature, we need to add checks to our `deleteTask` and `setChecked` methods to make sure only the task owner can delete or check off a private task:

```js
// At the top of the deleteTask method
var task = Tasks.findOne(taskId);
if (task.private && task.owner !== Meteor.userId()) {
  // If the task is private, make sure only the owner can delete it
  throw new Meteor.Error("not-authorized");
}

// At the top of the setChecked method
var task = Tasks.findOne(taskId);
if (task.private && task.owner !== Meteor.userId()) {
  // If the task is private, make sure only the owner can check it off
  throw new Meteor.Error("not-authorized");
}
```

> Notice that with this code anyone can delete any public task. With some small modifications to the code, you should be able to make it so that only the owner can delete their tasks.

We're done with our private task feature! Now our app is secure from attackers trying to view or modify someone's private tasks.

{{/template}}

{{#template name="step03CollectionsIntro"}}

Collections are Meteor's way of storing persistent data. The special thing about collections in Meteor is that they can be accessed from both the server and the client, making it easy to write view logic without having to write a lot of server code. They also update themselves automatically, so a view component backed by a collection will automatically display the most up-to-date data.

Creating a new collection is as easy as calling `MyCollection = new Mongo.Collection("my-collection");` in your JavaScript. On the server, this sets up a MongoDB collection called `my-collection`; on the client, this creates a cache connected to the server collection. We'll learn more about the client/server divide in step 12, but for now we can write our code with the assumption that the entire database is present on the client.

{{/template}}

{{#template name="step03InsertingTasksFromConsole"}}

### Inserting tasks from the console

Items inside collections are called _documents_. Let's use the server database console to insert some documents into our collection. In a new terminal tab, go to your app directory and type:

```bash
meteor mongo
```

This opens a console into your app's local development database. Into the prompt, type:

```js
db.tasks.insert({ text: "Hello world!", createdAt: new Date() });
```

In your web browser, you will see the UI of your app immediately update to show the new task. You can see that we didn't have to write any code to connect the server-side database to our front-end code &mdash; it just happened automatically.

Insert a few more tasks from the database console with different text. In the next step, we'll see how to add functionality to our app's UI so that we can add tasks without using the database console.

{{/template}}

{{#template name="step10OptimisticUI"}}

### Optimistic UI

So why do we want to define our methods on the client and on the server? We do this to enable a feature we call _optimistic UI_.

When you call a method on the client using `Meteor.call`, two things happen in parallel:

1. The client sends a request to the server to run the method in a secure environment, just like an AJAX request would work
2. A simulation of the method runs directly on the client to attempt to predict the outcome of the server call using the available information

What this means is that a newly created task actually appears on the screen _before_ the result comes back from the server.

If the result from the server comes back and is consistent with the simulation on the client, everything remains as is. If the result on the server is different from the result of the simulation on the client, the UI is patched to reflect the actual state of the server.

With Meteor methods and optimistic UI, you get the best of both worlds &mdash; the security of server code and no round-trip delay. Read more in our [blog post about optimistic UI](http://info.meteor.com/blog/optimistic-ui-with-meteor-latency-compensation).

{{/template}}
