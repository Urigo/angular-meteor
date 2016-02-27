/// <reference path="../angular2/angular2.d.ts" />
/// <reference path="../meteor/meteor.d.ts" />
/// <reference path="../es6-promise/es6-promise.d.ts" />

declare module ngMeteorAccounts {
  class MeteorComponent {
    subscribe(name: string, ...rest: any[]);
    autorun(runFunc: Function, autoBind: boolean): void;
  }

  type AccountDetails = {
    name: string;
    password: string;
    profile?: Object;
  }

  type LoginOptions = {
    requestPermissions?: Array<string>;
    loginStyle: string;
  };

  enum AuthProvider {
    FACEBOOK, GOOGLE, TWITTER, GITHUB, MEETUP, WEIBO, METEOR
  }

  class BasicAccountsService {
    logout(): Promise<any>;
  }

  class AccountsService extends BasicAccountsService {
    login(usernameOrEmail: string, password: string): Promise<any>;

    register(newUser: AccountDetails): Promise<any>;

    forgotPassword(email: string): Promise<any>;

    resetPassword(token: string, newPassword: string): Promise<any>;

    changePassword(oldPassword: string, newPassword: string): Promise<any>;

    verifyEmail(token: string): Promise<any>;
  }

  class AccountsSocialService extends BasicAccountsService {
    loginWith(provider: string, loginOptions?: LoginOptions): Promise<any>;
  }

  class InjectUserAnnotation {
    propName: string;
  }

  interface InjectUserFactory {
    new (propName?: string): InjectUserAnnotation;

    (propName?: string): any;
  }

  var InjectUser: InjectUserFactory;

  class RequireUserAnnotation {
    propName: string;
  }

  interface RequireUserFactory {
    new (): RequireUserAnnotation;

    (): any;
  }

  var RequireUser: RequireUserFactory;
}

declare module "meteor-accounts" {
  export = ngMeteorAccounts;
}
