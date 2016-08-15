'use strict';

import {Component} from '@angular/core';

import {Tasks} from '../tasks';

import {TaskList} from '/client/components';

import template from './app.component.html';

@Component({
  selector: 'app',
  template: template,
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
