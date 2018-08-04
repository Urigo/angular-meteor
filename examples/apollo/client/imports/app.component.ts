import {Apollo} from 'apollo-angular';
import { Component } from '@angular/core';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app',
    templateUrl: 'app.html'
})
export class AppComponent {
  say$: Observable<any>;
  constructor(apollo: Apollo) {
    this.say$ = apollo
      .query<any>({
        query: gql`
          {
            hello
          }
        `,
      }).pipe(
          map(result => result.data.hello)
      )
  }
}