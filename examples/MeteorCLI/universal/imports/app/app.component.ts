import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app',
  templateUrl: 'app.html'
})
export class AppComponent implements OnInit, OnDestroy {
  //Dynamic title change along with router
  private titleChangeSubscription: Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) { }
  ngOnInit() {
    this.titleChangeSubscription =
      this.router.events
        .filter((event) => event instanceof NavigationEnd)
        .map(() => this.activatedRoute)
        .map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        .filter((route) => route.outlet === 'primary')
        .mergeMap((route) => route.data)
        .subscribe((event) => this.titleService.setTitle(event['title']));
  }
  ngOnDestroy() {
    this.titleChangeSubscription.unsubscribe();
  }
}
