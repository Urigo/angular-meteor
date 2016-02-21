import {Component, View} from 'angular2/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap/bootstrap';

@Component({
  selector: 'app'
})
@View({
  templateUrl: 'client/app.html'
})
class Main {
  constructor() {

  }
}

Meteor.startup(function() {
  bootstrap(Main);
});
