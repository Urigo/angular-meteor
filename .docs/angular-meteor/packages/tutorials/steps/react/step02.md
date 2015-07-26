{{#template name="react-step02"}}
# Defining views with React components

To start working with React as our view library, let's add the `react` package, which includes everything you need to get started using React in Meteor: the React library itself, automatic compilation of `.jsx` files, and a `ReactMeteorData` mixin for loading data. We'll see how to use all of these parts in the coming steps.

Open a new terminal in the same directory as your running app, and type:

```sh
meteor add react
```

### Replace the starter code

To get started, let's replace the code of the default starter app. Then we'll talk about what it does.

First, replace the content of the initial HTML file:

{{> CodeBox view="react" step="2.2"}}

Second, **delete `simple-todos-react.js`** and create three new files:

{{> CodeBox view="react" step="2.3"}}

{{> CodeBox view="react" step="2.4"}}

{{> CodeBox view="react" step="2.5"}}

We just added three things to our app:

1. An `App` React component
2. A `Task` React component
3. Some code wrapped inside `if (Meteor.isClient) { ... }`, which defines code to execute in the browser, and `Meteor.startup`, which knows how to call code when the page is loaded and ready.

Later in the tutorial, we will refer to these components when adding or changing code.

### Check the result

In our browser, the app should now look much like this:

> #### Todo List
> - This is task 1
> - This is task 2
> - This is task 3

If your app doesn't look like this, use the GitHub link at the top right corner of each code snippet to see the entire file, and make sure your code matches the example.

### HTML files define static content

Meteor parses all of the HTML files in your app folder and identifies three top-level tags: **&lt;head>**, **&lt;body>**, and **&lt;template>**.

Everything inside any &lt;head> tags is added to the `head` section of the HTML sent to the client, and everything inside &lt;body> tags is added to the `body` section, just like in a regular HTML file.

Everything inside &lt;template> tags is compiled into Meteor _templates_, which can be included inside HTML with `{{dstache}}> templateName}}` or referenced in your JavaScript with `Template.templateName`. In this tutorial, we won't be using this feature of Meteor because we will be defining all of our view components with React.

### Define view components with React

In React, view components are classes defined with `React.createClass`. Your component can have any methods you like, but there are several methods such as `render` that have special functions. Components can also receive data from their parents through attributes called `props`. We'll go over some of the more common features of React in this tutorial; you can also check out [Facebook's React tutorial](https://facebook.github.io/react/docs/tutorial.html).

### Return markup from the render method with JSX

The most important method in every React component is `render()`, which is called by React to get a description of the HTML that this component should display. The HTML content is written using a JavaScript extension called JSX, which kind of looks like writing HTML inside your JavaScript. You can see some obvious differences already: in JSX, you use the `className` attribute instead of `class`. An important thing to know about JSX is that it isn't a templating language like Spacebars or Angular - it actually compiles directly to regular JavaScript. Read more about JSX [in the React docs](https://facebook.github.io/react/docs/jsx-in-depth.html).

### JSX files can use ES2015 features

If you haven't tried next-generation JavaScript features yet, some of the syntax in the code snippet might look weird. This is because `.jsx` files compiled with the `react` package also include support for some commonly used features of ES2015, the next version of JavaScript. Some of these features include:

1. Arrow functions: `(arg) => {return result;}`
2. Shorthand for methods: `render() { ... }`
3. `const` and `let` instead of `var`

Read more about these features here: XXX

{{> addingCSS}}

Now that you've added the CSS, the app should look a lot nicer. Check in your browser to see that the new styles have loaded.

{{/template}}
