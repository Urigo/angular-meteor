import {Component, View, Inject} from 'angular2/angular2';

import {routerDirectives, RouteParams} from 'angular2/router';

@Component({
  selector: 'party-details',
  viewInjector: [RouteParams]
})
@View({
  templateUrl: 'client/party-details/party-details.ng.html',
  directives: [routerDirectives]
})
export class PartyDetailsCmp {
  party: IParty;
  params;

  constructor(routeParams: RouteParams) {
    this.params = routeParams.params;

    Tracker.autorun(() => {
      this.party = Parties.find(this.params.partyId).fetch()[0];
    });
  }
}
PartyDetailsCmp.parameters = [[RouteParams]];
