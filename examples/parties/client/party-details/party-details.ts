import {Component, View, Inject} from 'angular2/angular2';

import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
  selector: 'party-details',
  viewInjector: [RouteParams]
})
@View({
  templateUrl: 'client/party-details/party-details.ng.html',
  directives: [ROUTER_DIRECTIVES]
})
export class PartyDetailsCmp extends MeteorComponent {
  party: IParty = {};

  constructor(@Inject(RouteParams) routeParams: RouteParams) {
    super();
    var partyId = routeParams.params.partyId;
    this.subscribe('party', partyId, zone.bind(() => {
      this.party = Parties.findOne(partyId);
    }));
  }
}
