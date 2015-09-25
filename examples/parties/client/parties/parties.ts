/// <reference path="../../typings/all.d.ts" />

import {Component, View, NgModel, NgFor} from 'angular2/angular2';

import {ROUTER_DIRECTIVES} from 'angular2/router';

import {PartyForm} from 'client/party-form/party-form';

import {MeteorComponent} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
  selector: 'parties'
})
@View({
  templateUrl: 'client/parties/parties.html',
  directives: [NgFor, ROUTER_DIRECTIVES, NgModel, PartyForm]
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
    this.subscribe('parties', location);
    this.location.set(location);
  }
}
