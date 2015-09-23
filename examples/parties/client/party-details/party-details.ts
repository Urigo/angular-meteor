/// <reference path="../../typings/all.d.ts" />

import {Component, View, Inject} from 'angular2/angular2';

import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
  selector: 'party-details'
})
@View({
  templateUrl: 'client/party-details/party-details.html',
  directives: [ROUTER_DIRECTIVES]
})
export class PartyDetailsCmp extends MeteorComponent {
  party: Party = { name: '' };

  constructor(@Inject(RouteParams) routeParams: RouteParams) {
    super();
    var partyId = routeParams.params['partyId'];
    this.subscribe('party', partyId, () => {
      this.party = Parties.findOne(partyId);
    }, true);
  }
}
