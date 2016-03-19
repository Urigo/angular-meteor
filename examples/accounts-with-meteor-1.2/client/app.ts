import {Component, View} from 'angular2/core';
import {bootstrap} from 'angular2-meteor';
import {AccountsUI} from 'meteor-accounts-ui';

@Component({
  selector: 'app'
})
@View({
  templateUrl: 'client/app.html',
  directives: [AccountsUI]
})
class Main {
  constructor() {

  }
}

Meteor.startup(function() {
  bootstrap(Main);
});
