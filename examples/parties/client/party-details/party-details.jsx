import {Component, View, Inject} from 'angular2/angular2';

import {routerDirectives, RouteParams} from 'angular2/router';

import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'party-details',
  viewInjector: [RouteParams]
})
@View({
  templateUrl: 'client/party-details/party-details.ng.html',
  directives: [routerDirectives]
})
export class PartyDetailsCmp extends MeteorComponent {
  party: IParty;
  params;

  constructor(routeParams: RouteParams) {
    super();

    this.params = routeParams.params;
    this.autorun(() => {
      this.party = Parties.findOne(this.params.partyId);
    }, true);
  }
}
PartyDetailsCmp.parameters = [[RouteParams]];
