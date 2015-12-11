/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/socially.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';

import {NgIf} from 'angular2/common';

import {RouteParams} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
  selector: 'party-details'
})
@View({
  templateUrl: 'client/party-details/party-details.html',
  directives: [NgIf]
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
