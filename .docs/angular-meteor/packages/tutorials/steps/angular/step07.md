{{#template name="angularSpecialPart07"}}
### Bootstrapping Angular for mobile

Angular needs the main document to be ready so it can bootstrap, but different devices has different events for `ready`.

To solve this, we need to change the way we bootstrap our Angular app.  Remove the current bootstrap by removing:

    ng-app='simple-todos'

from the BODY tag.

Then add the following code right after `Meteor.isClient`:

```js
angular.module("simple-todos",['angular-meteor']);

function onReady() {
  angular.bootstrap(document, ['simple-todos']);
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);
```
{{/template}}

{{#template name="angular-step07"}}
{{> sharedStep07 specialContent="angularSpecialPart07"}}
{{/template}}
