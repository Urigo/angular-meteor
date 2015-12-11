/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/socially.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';

import {NgModel, NgFor} from 'angular2/common';

import {ROUTER_DIRECTIVES} from 'angular2/router';

import {PartyForm} from 'client/party-form/party-form';

import {LoginForm} from 'client/login-form/login-form';

import {MeteorComponent} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
  selector: 'parties'
})
@View({
  templateUrl: 'client/parties/parties.html',
  directives: [NgFor, ROUTER_DIRECTIVES, NgModel, PartyForm, LoginForm]
})
export class PartiesCmp extends MeteorComponent {
  parties: Mongo.Cursor<Party>;
  location: ReactiveVar<String>;

  constructor() {
    super();
    this.subscribe('parties', 'Palo Alto');
    this.location = new ReactiveVar('Palo Alto');

    this.autorun(() => {
      var selector = { location: this.location.get() };
      this.parties = Parties.find(selector);
    }, true);
  }

  searchLocation(location) {
    this.subscribe('parties', location, () => {
      if (!this.parties.count()) {
        alert('Nothing found');
      }
    });
    this.location.set(location);
  }
}
