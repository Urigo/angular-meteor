'use strict';

import {Injectable} from 'angular2/core';

type AccountDetails = {
  name: string;
  password: string;
  profile?: Object;
};

type LoginOptions = {
  requestPermissions?: Array<string>;
  loginStyle: string;
};

export let AuthProvider = {
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
  TWITTER: 'twitter',
  GITHUB: 'github',
  MEETUP: 'meetup',
  WEIBO: 'weibo',
  METEOR: 'meteor'
};

class BasicAccountsService {
  logout(): Promise<any> {
    // Delayes resolve after logout to make sure Meteor.user() is null.
    return this.runWithPromise(Meteor.logout, true);
  }

  protected runWithPromise(accountFn: Function, inTimeout?: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      accountFn(this.getResolver(resolve, reject, inTimeout));
    });
  }

  protected getResolver(resolve, reject, inTimeout?: boolean): (error?: any) => void {
    var newResolve = inTimeout ? () => setTimeout(() => resolve()) : resolve;
    return error => {
      if (error) reject(error); else newResolve();
    }
  }
}

@Injectable()
export class AccountsService extends BasicAccountsService {
  constructor() {
    super();
    if (!Meteor.loginWithPassword) {
      var errorMsg = '[AccountsService]: accounts-password pkg is not installed';
      throw new Error(errorMsg);
    }
  }

  login(usernameOrEmail, password): Promise<any> {
    var accountFn = Meteor.loginWithPassword.bind(null,
      usernameOrEmail, password);
    return this.runWithPromise(accountFn);
  }

  register(newUser: AccountDetails): Promise<any> {
    var accountFn = Accounts.createUser.bind(null, newUser);
    return this.runWithPromise(accountFn);
  }

  forgotPassword(email: string): Promise<any> {
    var accountFn = Accounts.forgotPassword.bind(null, { email });
    return this.runWithPromise(accountFn);
  }

  resetPassword(token: string, newPassword: string): Promise<any> {
    var accountFn = Accounts.resetPassword.bind(null, token, newPassword);
    return this.runWithPromise(accountFn);
  }

  changePassword(oldPassword: string, newPassword: string): Promise<any> {
    var accountFn = Accounts.changePassword.bind(null, oldPassword, newPassword);
    return this.runWithPromise(accountFn);
  }

  verifyEmail(token: string): Promise<any> {
    var accountFn = Accounts.verifyEmail.bind(null, token);
    return this.runWithPromise(accountFn);
  }
}

@Injectable()
export class AccountsSocialService extends BasicAccountsService {
  _getDefaultOptions(provider: string): LoginOptions {
    var loginOptions = <LoginOptions>({ loginStyle: 'popup' });
    // Providers below don't support permissions as now.
    if (provider !== AuthProvider.TWITTER &&
        provider !== AuthProvider.WEIBO &&
        provider !== AuthProvider.METEOR) {
      loginOptions.requestPermissions = ['email'];
    }
    return loginOptions;
  }

  loginWith(provider: string, loginOptions?: LoginOptions): Promise<any> {   
    let options = loginOptions || {};
    _.defaults(options, this._getDefaultOptions(provider));

    var errorMsg = `[AccountsSocialService]: accounts-${provider} pkg is not installed`;
    var accountFn;
    switch (provider) {
      case AuthProvider.FACEBOOK:
        if (!Meteor.loginWithFacebook) {
          throw new Error(errorMsg);
        }
        accountFn = Meteor.loginWithFacebook.bind(null, options);
        break;
      case AuthProvider.GOOGLE:
        if (!Meteor.loginWithGoogle) {
          throw new Error(errorMsg);
        }
        accountFn = Meteor.loginWithGoogle.bind(null, options);
        break;
      case AuthProvider.TWITTER:
        if (!Meteor.loginWithTwitter) {
          throw new Error(errorMsg);
        }
        accountFn = Meteor.loginWithTwitter.bind(null, options);
        break;
      case AuthProvider.GITHUB:
        if (!Meteor.loginWithGithub) {
            throw new Error(errorMsg);
        }
        accountFn = Meteor.loginWithGithub.bind(null, options);
        break;
      case AuthProvider.MEETUP:
        if (!Meteor.loginWithMeetup) {
          throw new Error(errorMsg);
        }
        accountFn = Meteor.loginWithMeetup.bind(null, options);
        break;
      case AuthProvider.WEIBO:
        if (!Meteor.loginWithWeibo) {
          throw new Error(errorMsg);
        }
        accountFn = Meteor.loginWithWeibo.bind(null, options);
        break;
      case AuthProvider.METEOR:
        if (!Meteor.loginWithMeteorDeveloperAccount) {
          throw new Error(errorMsg);
        }
        accountFn = Meteor.loginWithMeteorDeveloperAccount.bind(null, options);
        break;
      default:
        throw new Error('Unknown authentication provider');
    }
    return this.runWithPromise(accountFn);
  }
}
