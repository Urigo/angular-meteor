'use strict';

import {Component, View} from 'angular2/core';

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
  party: Party;

  constructor(routeParams: RouteParams) {
    super();
    var partyId = routeParams.get('partyId');
    this.subscribe('party', partyId, () => {
      this.party = Parties.findOne(partyId);
    }, true);
  }
}
