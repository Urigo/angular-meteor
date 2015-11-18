/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, provide, FORM_DIRECTIVES} from 'angular2/angular2';

import {Tasks} from 'tasks';

import {TaskList} from './components/task-list';

import {bootstrap} from 'angular2-meteor';

@Component({
  selector: 'app'
})
@View({
  templateUrl: 'client/app.html',
  directives: [FORM_DIRECTIVES, TaskList]
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
