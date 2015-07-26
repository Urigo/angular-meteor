{{#template name="blaze-step03"}}

# Storing tasks in a collection

{{> step03CollectionsIntro}}

Let's update our JavaScript code to get our tasks from a collection instead of a static array:

{{> CodeBox view="blaze" step="3.1"}}

When you make these changes to the code, you'll notice that the tasks that used to be in the todo list have disappeared. That's because our database is currently empty &mdash; we need to insert some tasks!

{{> step03InsertingTasksFromConsole}}

{{/template}}
