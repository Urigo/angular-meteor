/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/socially.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View, ElementRef} from 'angular2/core';

import {NgIf, FORM_DIRECTIVES, Control, FormBuilder, ControlGroup, Validators} from 'angular2/common';

import {AccountsService, InjectUser} from 'meteor-accounts';

import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'login-form',
  providers: [AccountsService]
})
@View({
  templateUrl: 'client/login-form/login-form.html',
  directives: [FORM_DIRECTIVES, NgIf],
})
@InjectUser()
export class LoginForm extends MeteorComponent {
  loginForm: ControlGroup;
  user: Meteor.User;
  private _accounts: AccountsService;

  constructor(accounts: AccountsService) {
    super();
    this._accounts = accounts;
    var fb = new FormBuilder()
    this.loginForm = fb.group({
      user: ['', Validators.required],
      pwd: ['', Validators.required]
    });
  }

  login(event) {
    event.preventDefault();

    console.log(this.loginForm.valid);
    if (this.loginForm.valid) {
      var login = this.loginForm.value;
      this._accounts.login(login.user, login.pwd)
        .then(() => {
          (<Control>this.loginForm.controls['user']).updateValue('');
          (<Control>this.loginForm.controls['pwd']).updateValue('');
        })
        .catch(err => {
          alert(err);
        });
    }
  }

  logout() {
    this._accounts.logout();
  }
}
