{{#template name="tutorials.socially.angular1.step_09.md"}}
{{> downloadPreviousStep stepName="step_08"}}


Publish and subscribe to data is very different from other methods, such as using REST APIs. So don't miss the articles in the section below for deeper understanding how they work. 


Right now our app has no privacy, every user can see all the parties on the screen.

So let's add a `public` flag on parties - if a party is public we will let anyone see it, but if a party is private, only the owner can see it.

First we need to remove the `autopublish` Meteor package.

`autopublish` is added to any new Meteor project. It pushes a full copy of the database to each client.
It helped us until now, but it's not so good for privacy...

Write this command in the console:

    meteor remove autopublish


Now run the app.   You can't see any parties.

So now we need to tell Meteor what parties should it publish to the clients.

To do that we will use Meteor's [publish function](http://docs.meteor.com/#/full/meteor_publish).

Publish functions should go only in the server so the client won't have access to them.

Let's create a new file named `parties.js` inside the server folder.

Inside the file insert this code:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.2"}}

Let's see what's happening here:

* We have `Meteor.publish` - a function to define what to publish from the server to the client
* The first parameter is the name of the subscription. The client will subscribe to that name
* The second parameter is a function that defines what will be returned in the subscription

You can find out more about MonngoDB `find()` method [here](http://docs.mongodb.org/manual/reference/method/db.collection.find/)

That function will determine what data will be returned and the permissions needed.

In our case the first name parameter is **"parties"**. So we will need to subscribe to the **"parties"** collection in the client, so let's do it, using `this.subscribe` method:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.3"}}

> Our publish function can also take parameters.  In that case, we would also need to pass the parameters from the client.

> For more information about the `subscribe` service [click here](/api/reactive-context)

In the second parameter of the publish function, we define a function uses the Mongo API to return the wanted documents (document are the JSON-style data structure of MongoDB).

So we create a query on the Parties collection.

Inside the find method we use the [$or](http://docs.mongodb.org/manual/reference/operator/query/or/), [$and](http://docs.mongodb.org/manual/reference/operator/query/and/) and [$exists](http://docs.mongodb.org/manual/reference/operator/query/exists/) Mongo operators to pull our wanted parties:

Either that the owner parameter exists and it's the current logged in user (which we have access to with the command `this.userId`), or that the party's public flag exists and it's set as true.

So now let's add the public flag to the parties and see how it affects the parties the client gets.

Let's add a checkbox to the new party form in `parties-list.html`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.4"}}

Notice how easy it is to bind a checkbox to a model with Angular 1!

Let's add the same to the `party-details.html` page:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.5"}}

And we will add the ability to set this flag when updating a party details:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.6"}}

Now let's run the app.

Log in with 2 different users in 2 different browsers (you can use 2 different browsers, such as Chrome and Firefox, or use the anonymous mode on the same browser - e.g. incognito mode on Chrome, private browsing in Firefox or inPrivate mode in Edge).

In each of the users create a few public parties and a few private ones.

Now log out and see which user sees which parties.


In the next step, we will want to invite users to private parties. For that, we will need to get all the users, but only their emails without other data which will hurt their privacy.

So let's create another publish method for getting only the needed data on the user.

Notice the we don't need to create a new Meteor collection like we did with parties. **Meteor.users** is a pre-defined collection which is defined by the [meteor-accounts](http://docs.meteor.com/#accounts_api) package.

So let's start with defining our publish function.

Create a new file under the `server` folder named `users.js` and place the following code in:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.7"}}

So here again we use the Mongo API to return all the users (find with an empty object) but we select to return only the emails and profile fields.

* Notice that each object (i.e. each user) will automatically contain its `_id` field.

The emails field holds all the user's email addresses, and the profile might hold more optional information like the user's name
(in our case, if the user logged in with the Facebook login, the accounts-facebook package puts the user's name from Facebook automatically into that field).

Now let's subscribe to that publish Method.  In the `partyDetails` component file add the following line inside the controller:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.8"}}

* We subscribed to the `users` publication
* We added a helper function to the `users` collection

Now let's add the list of users to the view to make sure it works.

Add this ng-repeat list to the end of `party-details.html`:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.10"}}

Also, let's add a subscription to the `parties` in this Component as well, in case we will laod the app directly from this Component before loading the parties-list Component:

{{> DiffBox tutorialName="meteor-angular1-socially" step="9.9"}}

Run the app and see the list of all the users' emails that created a login and password and did not use a service to login.

# Working with Users collection in the client side

Note that the structure of the Users collection is different between regular email-password, Facebook, Google etc.

The Document structure looks like this (notice where the email is in each one):

__`Email-Password`:__

    {
      "_id" : "8qJt6dRSNDHBuqpXu",
      "createdAt" : ISODate("2015-05-26T00:29:05.109-07:00"),
      "services" : {
        "password" : {
          "bcrypt" : "$2a$10$oSykELjSzcoFWXZTwI5.lOl4BsB1EfcR8RbEm/KsS3zA4x5vlwne6"
        },
        "resume" : {
          "loginTokens" : [
            {
              "when" : ISODate("2015-05-26T00:29:05.112-07:00"),
              "hashedToken" : "6edmW0Wby2xheFxyiUOqDYYFZmOtYHg7VmtXUxEceHg="
            }
          ]
        }
      },
      "emails" : [
        {
          "address" : "email@email.com",
          "verified" : false
        }
      ]
    }

__`Facebook`:__

    {
      "_id" : "etKoiD8MxkQTjTQRY",
      "createdAt" : ISODate("2015-05-25T17:42:16.850-07:00"),
      "services" : {
        "facebook" : {
          "accessToken" : "CAAM10fSvI...",
          "expiresAt" : 1437770457288.0000000000000000,
          "id" : "10153317814289291",
          "email" : "email@email.com",
          "name" : "FirstName LastName",
          "first_name" : "FirstName",
          "last_name" : "LastName",
          "link" : "https://www.facebook.com/app_scoped_user_id/foo"
          "gender" : "male",
          "locale" : "en_US"
        },
        "resume" : {
          "loginTokens" : []
        }
      },
      "profile" : {
        "name" : "First Name LastName"
      }
    }

__`Google`:__

    {
      "_id" : "337r4wwSRWe5B6CCw",
      "createdAt" : ISODate("2015-05-25T22:53:32.172-07:00"),
      "services" : {
        "google" : {
          "accessToken" : "ya29.fwHSzHvC...",
          "idToken" : "eyJhbGciOiJSUzI1NiIs...",
          "expiresAt" : 1432624691685.0000000000000000,
          "id" : "107497376789285885122",
          "email" : "email@email.com",
          "verified_email" : true,
          "name" : "FirstName LastName",
          "given_name" : "FirstName",
          "family_name" : "LastName",
          "picture" : "https://lh5.googleusercontent.com/-foo.jpeg"
          "locale" : "en",
          "gender" : "male"
        },
        "resume" : {
          "loginTokens" : [
            {
              "when" : ISODate("2015-05-25T23:18:11.788-07:00"),
              "hashedToken" : "NaKS2Zeermw+bPlMLhaihsNu6jPaW5+ucFDF2BXT4WQ="
            }
          ]
        }
      },
      "profile" : {
        "name" : "First Name LastName"
      }
    }


Right now it means that the emails of the users that logged in with with email-password will be displayed.

In the chapter of Angular 1 filters we will change the display code to show all emails.


# Understanding Meteor's Publish-Subscribe

It is very important to understand Meteor's Publish-Subscribe mechanism so you don't get confused and use it to filter things in the view!

Meteor accumulates all the data from the different subscription of a collection in the client, so adding a different subscription in a different
view won't delete the data that is already in the client.

More information about publications and subscription in [this blog article](https://medium.com/angular-meteor/coll-pub-sub-with-angular-meteor-cb13fe48f570) and this  [meteorpedia article](http://www.meteorpedia.com/read/Understanding_Meteor_Publish_and_Subscribe).

# Summary

We've added the support of privacy to our parties app.

We also learned how to use the `Meteor.publish` command to control permissions and the data sent to the client
and how to subscribe to it with the $meteor.collection subscribe function.

In the next step we will learn how to deploy. You will see that Meteor makes it easy to put the application online.

{{/template}}
