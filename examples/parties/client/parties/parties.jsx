import {Component, View, NgModel, NgFor, IterableDiffers} from 'angular2/angular2';

import {routerDirectives} from 'angular2/router';

import {PartyForm} from 'client/party-form/party-form';

import {MongoCollectionDifferFactory, MongoCollectionObserver} from 'angular2-meteor';

@Component({
  selector: 'parties'
})
@View({
  templateUrl: 'client/parties/parties.ng.html',
  directives: [NgFor, routerDirectives, NgModel, PartyForm]
})
export class PartiesCmp {
  parties: IParty[];

  constructor() {
    this.parties = new MongoCollectionObserver(function() {
      return Parties.find({location: this.get('location')});
    });
  }

  searchLocation(location) {
    this.parties.location = location;
  }
}
