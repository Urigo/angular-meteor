import {Component, View, NgModel, NgFor, IterableDiffers} from 'angular2/angular2';

import {routerDirectives} from 'angular2/router';

import {PartyForm} from 'client/party-form/party-form';

import {zoneAutorun} from 'angular2-meteor';

@Component({
  selector: 'parties'
})
@View({
  templateUrl: 'client/parties/parties.ng.html',
  directives: [NgFor, routerDirectives, NgModel, PartyForm]
})
export class PartiesCmp {
  parties: IParty[];
  location: ReactiveVar;

  constructor() {
    this.location = new ReactiveVar('Palo Alto');
    zoneAutorun(() => {
      this.parties = Parties.find({location: this.location.get()});
    });
  }

  searchLocation(location) {
    this.location.set(location);
  }
}
