{{#template name="react-step04"}}

# Adding tasks with a form

In this step, we'll add an input field for users to add tasks to the list.

First, let's add a form to our `App` component:

{{> CodeBox step="4.1" view="react"}}

> Tip: You can add comments to your JSX code by wrapping them in `{/* ... */}`

You can see that the `form` element has an `onSubmit` attribute that references a method on the component called `handleSubmit`. In React, this is how you listen to browser events, like the submit event on the form. The `input` element has a `ref` property which will let us easily access this element later.

Let's add a `handleSubmit` method to our `App` component:

{{> CodeBox step="4.2" view="react"}}

Now your app has a new input field. To add a task, just type into the input field and hit enter. If you open a new browser window and open the app again, you'll see that the list is automatically synchronized between all clients.

### Listening for events in React

As you can see, in React you handle DOM events by directly referencing a method on the component. Inside the event handler, you can reference elements from the component by giving them a `ref` property and using `React.findDOMNode`. Read more about the different kinds of events React supports, and how the event system works, in the [React docs](https://facebook.github.io/react/docs/events.html).

### Inserting into a collection

Inside the event handler, we are adding a task to the `tasks` collection by calling `Tasks.insert()`. We can assign any properties to the task object, such as the time created, since we don't ever have to define a schema for the collection.

Being able to insert anything into the database from the client isn't very secure, but it's okay for now. In step 10 we'll learn how we can make our app secure and restrict how data is inserted into the database.

### Sorting our tasks

Currently, our code displays all new tasks at the bottom of the list. That's not very good for a task list, because we want to see the newest tasks first.

We can solve this by sorting the results using the `createdAt` field that is automatically added by our new code. Just add a sort option to the `find` call inside `getMeteorData` on the `App` component:

{{> CodeBox step="4.3" view="react"}}

Let's go back to the browser and make sure this worked: any new tasks that you add should appear at the top of the list, rather than at the bottom.

In the next step, we'll add some very important todo list features: checking off and deleting tasks.
{{/template}}
