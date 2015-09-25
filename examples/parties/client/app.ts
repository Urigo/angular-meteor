/// <reference path="../typings/all.d.ts" />

import {Component, View, bind} from 'angular2/angular2';

import {Router, ROUTER_BINDINGS, RouterOutlet, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {LocationStrategy, Location, HashLocationStrategy} from 'angular2/router';

import {PartiesCmp} from './parties/parties';
import {PartyDetailsCmp} from './party-details/party-details';

import {bootstrap} from 'angular2-meteor';

@Component({
  selector: 'socially'
})
@View({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES, PartiesCmp, PartyDetailsCmp]
})
@RouteConfig([
  {path: '/',  component: PartiesCmp},
  {path: '/party/:partyId', as: 'party-details', component: PartyDetailsCmp}
])
class Socially {}

bootstrap(Socially, [
  ROUTER_BINDINGS,
  bind(LocationStrategy).toClass(HashLocationStrategy)
]);
