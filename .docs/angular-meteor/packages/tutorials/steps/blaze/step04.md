{{#template name="blaze-step04"}}

# Adding tasks with a form

In this step, we'll add an input field for users to add tasks to the list.

First, let's add a form to our HTML:

{{> CodeBox view="blaze" step="4.1"}}

Here's the JavaScript code we need to add to listen to the `submit` event on the form:

{{> CodeBox view="blaze" step="4.2"}}

Now your app has a new input field. To add a task, just type into the input field and hit enter. If you open a new browser window and open the app again, you'll see that the list is automatically synchronized between all clients.

### Attaching events to templates

Event listeners are added to templates in much the same way as helpers are: by calling `Template.templateName.events(...)` with a dictionary. The keys describe the event to listen for, and the values are _event handlers_ that are called when the event happens.

In our case above, we are listening to the `submit` event on any element that matches the CSS selector `.new-task`. When this event is triggered by the user pressing enter inside the input field, our event handler function is called.

The event handler gets an argument called `event` that has some information about the event that was triggered. In this case `event.target` is our form element, and we can get the value of our input with `event.target.text.value`. You can see all of the other properties of the `event` object by adding a `console.log(event)` and inspecting the object in your browser console.

The last two lines of our event handler perform some cleanup &mdash; first we make sure to make the input blank, and then we return `false` to tell the web browser to not do the default form submit action since we have already handled it.

### Inserting into a collection

Inside the event handler, we are adding a task to the `tasks` collection by calling `Tasks.insert()`. We can assign any properties to the task object, such as the time created, since we don't ever have to define a schema for the collection.

Being able to insert anything into the database from the client isn't very secure, but it's okay for now. In step 10 we'll learn how we can make our app secure and restrict how data is inserted into the database.

### Sorting our tasks

Currently, our code displays all new tasks at the bottom of the list. That's not very good for a task list, because we want to see the newest tasks first.

We can solve this by sorting the results using the `createdAt` field that is automatically added by our new code. Just add a sort option to the `find` call inside the `tasks` helper:

{{> CodeBox view="blaze" step="4.3"}}

In the next step, we'll add some very important todo list functions: checking off and deleting tasks.
{{/template}}
