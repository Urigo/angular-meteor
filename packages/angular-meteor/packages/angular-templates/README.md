# angular-templates

Compiles angular templates into the template cache.

## Installing

In order to use this compiler, you need first to remove the default HTML compiler in Meteor, by running:

```
$ meteor remove blaze-html-templates
```

And then add the compiler for Angular 1.0 by running:

```
$ meteor add angular-templates
```

## How to use the compiler?

So you do not have to do anything else besides adding the compiler to your project. The compiler will automatically compiles every `.html` file you add to your project.

### Manually

```js
angular.module('app')
.component('app', {
    templateUrl: '/ui/component/app.html'
    // ... rest of options
  });
```

### Using url of a template

```js
import templateUrl from './ui/component/app.html';

angular.module('app')
  .component('app', {
    templateUrl, // equivalent to `templateUrl: templateUrl`
    // ... rest of options
  });
```

### Using template as a string

```js
import template from '../ui/component/app.html!raw';

angular.module('app')
  .component('app', {
    template, // equivalent to `template: template`
    // ... rest of options
  });
```

## Our recommendations

Since a component doesn't exist without its template, in our opinion it is the best approach to import the content.
This is why we created [`urigo:static-templates`](https://github.com/Urigo/meteor-static-templates).

We recommend you to use the `template as a string` method, this way you can easily migrate to `urigo:static-templates`.

**Migration process**:

1. Partly move all of your components to work with `template` (`!raw` suffix) instead of `templateUrl`.
1. Remove `angular-templates`.
1. Add `urigo:static-templates`.
1. Remove `!raw` suffix from template imports. *It could be done component by component since `!raw` suffix also exists in `urigo:static-templates`. We've done this to make the migration process easier.*

## Known issues

- TypeScript warnings about missing modules [[Urigo/angular-meteor#1402](https://github.com/Urigo/angular-meteor/issues/1402)]
