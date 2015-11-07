{{#template name="react-step11"}}

# Filtering data with publish and subscribe

Now that we have moved all of our app's sensitive code into methods, we need to learn about the other half of Meteor's security story. Until now, we have worked assuming the entire database is present on the client, meaning if we call `Tasks.find()` we will get every task in the collection. That's not good if users of our application want to store privacy-sensitive data. We need a way of controlling which data Meteor sends to the client-side database.

Just like with `insecure` in the last step, all new Meteor apps start with the `autopublish` package, which automatically synchronizes all of the database contents to the client. Let's remove it and see what happens:

```bash
meteor remove autopublish
```

When the app refreshes, the task list will be empty. Without the `autopublish` package, we will have to specify explicitly what the server sends to the client. The functions in Meteor that do this are `Meteor.publish` and `Meteor.subscribe`.

Let's add them now.

{{> CodeBox step="11.2" view="react"}}

Once you have added this code, all of the tasks will reappear.

Calling `Meteor.publish` on the server registers a _publication_ named `"tasks"`. When `Meteor.subscribe` is called on the client with the publication name, the client _subscribes_ to all the data from that publication, which in this case is all of the tasks in the database. To truly see the power of the publish/subscribe model, let's implement a feature that allows users to mark tasks as "private" so that no other users can see them.

### Adding a button to make tasks private

Let's add another property to tasks called "private" and a button for users to mark a task as private. This button should only show up for the owner of a task. We want the label to indicate the current status: public or private.

First, we need to add a new method that we can call to set a task's private status:

{{> CodeBox step="11.3" view="react"}} 

Now, we need to pass a new property to the `Task` to decide whether we want
to show the private button; the button should show up only if the currently
logged in user owns this task:

{{> CodeBox step="11.4" view="react"}}

{{> CodeBox step="11.5" view="react"}}

Let's add the button, using this new prop to decide whether it should be displayed:

{{> CodeBox step="11.6" view="react"}}

We need to define the event handler called by the button:

{{> CodeBox step="11.7" view="react"}}

One last thing, let's update the class of the `<li>` element in the `Task` component to reflect it's privacy status:

{{> CodeBox step="11.8" view="react"}}

### Selectively publishing tasks based on privacy status

Now that we have a way of setting which tasks are private, we should modify our
publication function to only send the tasks that a user is authorized to see:

{{> CodeBox step="11.9" view="react"}}

To test that this functionality works, you can use your browser's private browsing mode to log in as a different user. Put the two windows side by side and mark a task private to confirm that the other user can't see it. Now make it public again and it will reappear!

### Extra method security

In order to finish up our private task feature, we need to add checks to our `deleteTask` and `setChecked` methods to make sure only the task owner can delete or check off a private task:

{{> CodeBox step="11.10" view="react"}}

> Notice that with this code anyone can delete any public task. With some small modifications to the code, you should be able to make it so that only the owner can delete their tasks.

We're done with our private task feature! Now our app is secure from attackers trying to view or modify someone's private tasks.

{{/template}}
