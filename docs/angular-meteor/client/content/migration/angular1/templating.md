{{#template name="migration.angular1.templating.md"}}

## From Blaze templates to Angular templates

This chapter will show the common differences between blaze templates and angular templates.

> Though there are similarities between angular and blaze, each one implements the followings differently.
> It's encouraged to check the angular documents for further information.

#### browser events

In blaze, when you wanted to catch a browser event such as `click`, you added a property to the template events.

Let's say, you want to create a login button.

In blaze you would write the following code:

```html
<button class="my-login-button">login</button>
```

```javascript
Template.myTemplate.events({
  'click .my-login-button': function(event) {
    loginService.login();
  }
});
```

But in angular you achieve this goal with the following:

```html
<button class="my-login-botton" ng-click="loginCtrl.login()">login</button>
```

```javascript
class LoginCtrl {
  login() {
    loginService.login();
  }
}
```

Angular supports most browser events out-of-the-box as directives to attach on the DOM. Please refer to angular api documents for a complete list.

### if

The angular equivalent for the `if` statement in Spacebars is the `ngIf` directive.
They are quite similar but different.

When you insert the statement to elements, they produce a similar output:

Spacebars:
```html
{{|#if something}}
  <p>It's true</p>
{{|/if}}
```

Angular:
```html
<p ng-if="something">It's true</p>
```

Angular doesn't have an equivalent to the else statement, so in order to do if/else you need to use the `ngIf` directive twice, but the second use is inverted:

Spacebars:
```html
{{|#if something}}
  <p>It's true</p>
{{|else}}
  <p>It's false</p>
{{|/if}}
```

Angular:
```html
<p ng-if="something">It's true</p>
<p ng-if="!something">It's false</p>
```

Another difference is you can't insert `ngIf` to attributes.
In Spacebars, you could do: `<div class="{{|#if done}}done{{|else}}notdone{{|/if}}"></div>`.

However, In angular the syntax is quite different.
you can insert an angular expression to the class attribute and use the ternary operator: `<div class="{{|done ? 'done' : 'notdone'}}"></div>`.

In addition, angular has special directives that support dynamic attributes such as `class`, `style` etc.
So a better solution is to use the `ngClass` directive: `<div ng-class="done ? 'done' : 'notdone'"></div>`.

### each

The angular equivalent for the `each` statement in Spacebars is the `ngRepeat` directive.

example:

Spacebars:
```html
<ul>
{{|#each people}}
  <li>{{|name}}</li>
{{|/each}}
</ul>
```

Angular:
```html
<ul>
    <li ng-repeat="person in people">{{|person.name}}</li>
</ul>
```

### inclusion

The angular equivalent for inclusion tag (``{{|> template}}``) is the `ngInclude` directive.

example:

Spacebars:
```html
<template name="People">
    {{|#each people}}
        {{|> person}}
    {{|/each}}
</template>

<template name="person">
{{|name}}
</template>
```

Angular:
```html
<script type="text/ng-template" id="people.html">
  <ng-include ng-repeat="person in people" src="'person.html'"></ng-include>
</script>

<script type="text/ng-template" id="person.html">
  {{|person.name}}
</script>

```
The code above will work, but it's not the recommended way for performing inclusion.

The right way it to create a **component** for each template and then you can do the following:

```html
// app template
<body>
    <people></people>
</body>

// people template
<person ng-repeat="person in people"></person>

// person template
{{|person.name}}
```

### raw html

In Spacebars you can insert raw html with triple brackets `{{{|raw}}}`.
You can do the same with the `ngBindHtml` directive.

Spacebars:
```html
// rawHtml = 'this is raw html';....
<p>{{{|rawHtml}}</p>
```

Angular:
```html
// $scope.rawHtml = 'this is raw html';....
<p ng-bind-html="rawHtml"></p>
```

However, Spacebars implementation allows you to insert unsafe html (`script` tags etc.).
by default, angular forbids inserting unsafe html. Because of that, the example above will not work without other
additions.
In order to make it work, you'll need to add the `angular-sanitize` module to your project and include it as a dependency:
`angular.module('myModule', ['ngSanitize'])`.
If you are sure that the html that you wish to insert is safe, refer to
[$sce#trustAsHtml](https://docs.angularjs.org/api/ng/service/$sce#trustAsHtml) for further information.


### animations

In blaze, when you wanted to add animations to your templates you'd done it simply by adding `_uiHooks` to the appropriate element.

angular animations are more complex. Actually, the angular team took animations very seriously so they implemented
a whole module just to deal only with them (`ngAnimate`). I will not show an example of how to add animations,
because each scenario has it's own approach. For more information and instructions, please read the
[official animations guide](https://docs.angularjs.org/guide/animations).

{{/template}}
