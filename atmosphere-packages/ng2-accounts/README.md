# Meteor Accounts API for Angular 2.

Accounts services to be used in custom Angular 2 components.

Wraps over API of different Meteor accounts packages, including "accounts-base", "accounts-password", "accounts-facebook" etc.

Additionally, implements some login specific annotations for a convenience of API users.

## API

### AccountsService

Exposes and combines API of the "accounts-base" and "accounts-password" packages.

Makes API more compatible with the Angular 2 code style, e.g., by making methods return promises.

**`login(usernameOrEmail: string, password: string): Promise<any>`**

Simple username/password login.

**`register(newUser: AccountDetails): Promise<any>`**

Registers a new account. `AccountDetails` has a format as follows:

```ts
{
  username: string;
  email: string;
  password: string;
  profile?: Object;
}
```
For more info, please read [here](http://docs.meteor.com/#/full/accounts_createuser).

**`forgotPassword(email: string):Promise<any>`**

Sends out a token to reset current password.

**`resetPassword(token: string, newPassword: string): Promise<any>`**

Sets a new password with the token provided `forgotPassword`.

**`changePassword(oldPassword: string, newPassword: string): Promise<any>`**

Simply change current password, given the current password and a new one.

**`verifyEmail(token: string): Promise<any>`**

Verifies a user email, passed in the `register` method during the account registration.

### AccountsSocialService

Social services login.

**`loginWith(provider: string, loginOptions?: LoginOptions): Promise<any>`**

Login with the help of a particular account provider. Among them are Google, Facebook, Twitter, Github, Meteor etc.

To make a particular account provider available, you will need to install a corresponding package, for example:
```
meteor add accounts-facebook
```
if you want to allow logining with Facebook.

Original doc can be found [here](http://docs.meteor.com/#/full/meteor_loginwithexternalservice).

`loginOptions` is used to provide with the following info:

```ts
{
  requestPermissions?: Array<string>;
  loginStyle: string;
}
```

### Annotations

`@InjectUser(propName: string)`

Injects Meteor's user as a property to a Angular 2 component or directive.
Available in the component templates as well.

By default, property called `user`.

> Note that new property will be reactive only if you add `urigo:angular2-meteor` package.

If you want to change property name, pass in a particular name in the annotation.

Internally implementation bases on wrapping of `Meteor.user()`.

`@RequireUser()`

If placed above a component, will prohibit anonymous access to that component.
Only logged-in users (via any ways described above) will be able to load it.

## Examples

#### Services Usage

Imports one of the services and use it in a component as follows:

```ts

...

import {AccountsService} from 'meteor-accounts';

@Component({
  selector: 'foo',
  viewProviders: [AccountsService]
})
@View({
  template: '...'
})
class FooAccounts {
  constructor(private accounts: AccountsService) {}

  onLoginBtnClick(email, pwd) {
    this.accounts.login(email, pwd).then(() => alert('logged in'));
  }
}

```

#### Annotations Usage

```ts

import {InjectUser} from 'meteor-accounts';

@Component({
  selector: 'foo'
})
@View({
  template: '...'
})
@InjectUser('currentUser')
class FooAccounts {
  constructor() {
    // Logs out the current value of Meteor.user(),
    // property is reactive if urigo:angular2-meteor added,
    // can be used in templates as well.
    console.log(this.currentUser);
  }
}

```
