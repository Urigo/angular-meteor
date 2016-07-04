import {Component, provide, enableProdMode} from '@angular/core';

import {Tasks} from '../tasks';

import {TaskList} from './components/task-list';

import {bootstrap} from 'angular2-meteor-auto-bootstrap';

import {disableDeprecatedForms, provideForms} from '@angular/forms';

enableProdMode();

@Component({
  selector: 'app',
  templateUrl: 'client/app.html',
  directives: [TaskList]
})
export class Todos {
  addTask(text: string) {
    Meteor.call('tasks.addTask', text);
  }

  get todoCount() {
    return Tasks.find({
      checked: false
    }).count();
  }
}

bootstrap(Todos, [disableDeprecatedForms(), provideForms()]);
