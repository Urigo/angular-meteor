{{#template name="migration.angular1.method.md"}}

## Method

When we migrate our app from blaze to angular, we can choose between two approaches.

But first, Let's have a brief look at the `todos` app client design:

<img src="/migration-images/todos.jpg" style="height: 500px; width: auto"/>

> It's not the whole app, only the main parts.

### 2-step migration

This approach consists of two major stages. You will start the migration by putting your logic in angular components and
make them work with blaze templates. Secondly, you will convert the blaze templates to angular templates.

<img src="/migration-images/steps.jpg" style="height: 500px; width: auto"/>

The checklist would be:

- [ ] import the packages that we need.
- [ ] create a bridge between iron-router and ui-router.
- [ ] create an angular component for `join` (1).
- [ ] attach the new component to the routers (1).
- [ ] attach the new component to the blaze template (1).
- [ ] repeat process for each component (2,3,4,5).
- [ ] write an angular template for the `todos-item` component (6).
- [ ] connect the angular template to the component and remove the blaze template (6).
- [ ] repeat process for each component (7, 8, 9, 10).
- [ ] merge the iron-router code with the ui-router code.
- [ ] remove all packages that handle blaze.
- [ ] code cleanup (as needed).

### bottom-up migration

You will convert each component completely to angular (both logic and view) at a time.
The order of witch components are being migrated is not important, but my recommendation is to follow the app components tree.
Start with the leaves, and make your way up to the main branch:

<img src="/migration-images/bottom-up.jpg" style="height: 500px; width: auto"/>

The checklist would be:

- [ ] import the packages that we need.
- [ ] create the `todos-item` component (1).
- [ ] create the `todos-item` template (1).
- [ ] attach the new component to `list` (1).
- [ ] repeat process for each of the components (2, 3, 4, 5).
- [ ] replace `iron-router` with `ui-router``.
- [ ] remove all packages that handle blaze.
- [ ] code cleanup (as needed).

Another recommendation is to start with simple components, so when you migrate a complex component you will already be
familiar with the process.

{{/template}}
