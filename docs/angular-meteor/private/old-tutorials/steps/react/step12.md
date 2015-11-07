{{#template name="react-step12"}}

# What's next?

Congratulations on your newly built Meteor app! Don't forget to deploy it again
so your friends can use the new features.

Your app currently supports collaborating on a single todo list. To see how you
could add more functionality, check out the Todos example &mdash; a more
complete app that can handle sharing multiple lists. Also, try Local Market, a
cross-platform customer engagement app that shows off native hardware
functionality and social features.

```bash
meteor create --example todos
meteor create --example localmarket
```

Here are some options for where you can go next:

1. Grab a [copy of Discover Meteor](https://www.discovermeteor.com/), the best Meteor book out there
2. Read about [the design of the Meteor platform](/projects) to see how all of the parts fit together
3. Check out the [complete documentation](https://docs.meteor.com)
4. Explore this set of [tools]({{pathFor 'tools.info'}}) and [resources]({{pathFor 'tools.resources'}}) to help you build Meteor apps
5. Try this tutorial using [AngularJS](/tutorials/angular)

<div class="row">
  <hr />
  <div class="col-md-6">
    <p>Don't forget to get on the mailing list - Meteor news, new releases, security alerts, and nothing else.</p>
  </div>
  <div class="col-md-6">
    {{> emailForm}}
  </div>
</div>

{{/template}}
