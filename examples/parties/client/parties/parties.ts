'use strict';

import {Component, View} from 'angular2/core';

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
  directives: [ROUTER_DIRECTIVES, PartyForm, LoginForm]
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
