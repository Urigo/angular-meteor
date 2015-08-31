import {Component, View, bind} from 'angular2/angular2';

import {Router, routerInjectables, RouterOutlet, routerDirectives, RouteConfig} from 'angular2/router';

import {LocationStrategy, Location, HashLocationStrategy} from 'angular2/router';

import {PartiesCmp} from './parties/parties';
import {PartyDetailsCmp} from './party-details/party-details';

import {bootstrap} from 'angular2-meteor';

@Component({
  selector: 'socially'
})
@View({
  template: '<router-outlet></router-outlet>',
  directives: [routerDirectives, PartiesCmp, PartyDetailsCmp]
})
@RouteConfig([
  {path: '/',  component: PartiesCmp},
  {path: '/party/:partyId', as: 'party-details', component: PartyDetailsCmp}
])
class Socially {}

bootstrap(Socially, [
  routerInjectables,
  bind(LocationStrategy).toClass(HashLocationStrategy)
]);
