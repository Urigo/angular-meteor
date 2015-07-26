{{#template name="blaze-step05"}}

# Checking off and deleting tasks

Until now, we have only interacted with a collection by inserting documents. Now, we will learn how to update and remove them.

Let's add two elements to our `task` template, a checkbox and a delete button:

{{> CodeBox view="blaze" step="5.1"}}

We have added UI elements, but they don't do anything yet. We should add some event handlers:

{{> CodeBox view="blaze" step="5.2"}}

### Getting data in event handlers

Inside the event handlers, `this` refers to an individual task object. In a collection, every inserted document has a unique `_id` field that can be used to refer to that specific document. We can get the `_id` of the current task with `this._id`. Once we have the `_id`, we can use `update` and `remove` to modify the relevant task.

### Update

The `update` function on a collection takes two arguments. The first is a selector that identifies a subset of the collection, and the second is an update parameter that specifies what should be done to the matched objects.

In this case, the selector is just the `_id` of the relevant task. The update parameter uses `$set` to toggle the `checked` field, which will represent whether the task has been completed.

### Remove

The `remove` function takes one argument, a selector that determines which item to remove from the collection.

### Using object properties or helpers to add/remove classes

If you try checking off some tasks after adding all of the above code, you will see that checked off tasks have a line through them. This is enabled by the following snippet:

```html
<li class="{{dstache}}#if checked}}checked{{dstache}}/if}}">
```

With this code, if the `checked` property of a task is `true`, the `checked` class is added to our list item. Using this class, we can make checked-off tasks look different in our CSS. 
{{/template}}
