import {Component, View, Inject} from 'angular2/angular2';

import {routerDirectives, RouteParams} from 'angular2/router';

import {MongoObjectObserver} from 'angular2-meteor';

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

    this.party = new MongoObjectObserver(Parties, this.params.partyId);
  }
}
PartyDetailsCmp.parameters = [[RouteParams]];
