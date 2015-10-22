/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/socially.d.ts" />

import {Component, View, Inject} from 'angular2/angular2';

import {RouteParams} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
  selector: 'party-details'
})
@View({
  templateUrl: 'client/party-details/party-details.html'
})
export class PartyDetailsCmp extends MeteorComponent {
  party: Party = {name: ''};

  constructor(routeParams: RouteParams) {
    super();
    var partyId = routeParams.get('partyId');
    this.subscribe('party', partyId, () => {
      this.party = Parties.findOne(partyId);
    }, true);
  }
}
