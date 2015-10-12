/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, bind} from 'angular2/angular2';

import {Router, routerBindings, RouterOutlet, APP_BASE_HREF, ROUTER_DIRECTIVES, RouteConfig} from 'angular2/router';

import {LocationStrategy, Location, HashLocationStrategy} from 'angular2/router';

import {PartiesCmp} from './parties/parties';

import {PartyDetailsCmp} from './party-details/party-details';

import {bootstrap} from 'angular2-meteor';

@Component({
  selector: 'socially'
})
@View({
  template: '<router-outlet></router-outlet>',
  directives: [ROUTER_DIRECTIVES, PartiesCmp]
})
@RouteConfig([
  {path: '/', component: PartiesCmp},
  {path: '/party/:partyId', as: 'PartyDetails', component: PartyDetailsCmp}
])
export class Socially {}

bootstrap(Socially, [
  routerBindings(Socially),
  bind(APP_BASE_HREF).toValue('/')
]);
