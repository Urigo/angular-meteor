import {Component, provide, enableProdMode} from '@angular/core';

import {Tasks} from '../tasks';

import {TaskList} from './components/task-list';

import {bootstrap} from 'angular2-meteor-auto-bootstrap';

enableProdMode();

@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [TaskList]
})
export class Todos {
  addTask(text) {
    Tasks.insert({
      text: text,
      checked: false,
      private: false
    });
  }

  get todoCount() {
    return Tasks.find({
      checked: false
    }).count();
  };
}

bootstrap(Todos);
