{{#template name="blaze-step02"}}
# Defining views with templates

To start working on our todo list app, let's replace the code of the default starter app with the code below. Then we'll talk about what it does.

{{> CodeBox view="blaze" step="2.1"}}

{{> CodeBox view="blaze" step="2.2"}}

In our browser, the app will now look much like this:

> #### Todo List
> - This is task 1
> - This is task 2
> - This is task 3

Now let's find out what all these bits of code are doing!

### HTML files in Meteor define templates

Meteor parses all of the HTML files in your app folder and identifies three top-level tags: **&lt;head>**, **&lt;body>**, and **&lt;template>**.

Everything inside any &lt;head> tags is added to the `head` section of the HTML sent to the client, and everything inside &lt;body> tags is added to the `body` section, just like in a regular HTML file.

Everything inside &lt;template> tags is compiled into Meteor _templates_, which can be included inside HTML with `{{dstache}}> templateName}}` or referenced in your JavaScript with `Template.templateName`.

### Adding logic and data to templates

All of the code in your HTML files is compiled with [Meteor's Spacebars compiler](https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md). Spacebars uses statements surrounded by double curly braces such as `{{dstache}}#each}}` and `{{dstache}}#if}}` to let you add logic and data to your views.

You can pass data into templates from your JavaScript code by defining _helpers_. In the code above, we defined a helper called `tasks` on `Template.body` that returns an array. Inside the body tag of the HTML, we can use `{{dstache}}#each tasks}}` to iterate over the array and insert a `task` template for each value. Inside the `#each` block, we can display the `text` property of each array item using `{{dstache}}text}}`.

In the next step, we will see how we can use helpers to make our templates display dynamic data from a database collection.

{{> addingCSS}}

{{/template}}
