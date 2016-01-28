/// <reference path="../typings/angular2-meteor/angular2-meteor.d.ts" />

import {Component, View, provide, enableProdMode} from 'angular2/core';

import {Tasks} from 'tasks';

import {TaskList} from './components/task-list';

import {bootstrap} from 'angular2-meteor';

enableProdMode();

@Component({
  selector: 'app'
})
@View({
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
