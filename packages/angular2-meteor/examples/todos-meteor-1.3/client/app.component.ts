'use strict';

import {Component} from '@angular/core';

import {Tasks} from '../tasks';

import template from './app.component.html';

import {Observable} from 'rxjs';

import 'rxjs/add/operator/debounce';

@Component({
  selector: 'app',
  template: template
})
export class Todos {

  todoCount = Tasks.find({ checked: false })
    .debounce(() => Observable.interval(50))
    .map(tasks => tasks.length).zone();

  addTask(text: string) {
    Meteor.call('tasks.addTask', text);
  }
}
