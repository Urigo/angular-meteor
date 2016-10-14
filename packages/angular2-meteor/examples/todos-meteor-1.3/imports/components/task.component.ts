'use strict';

import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

import {MeteorReactive} from 'angular2-meteor';

import style from './task.component.less';
import template from './task.component.html';

import {TodoTask} from '../../tasks';

@Component({
  selector: 'task',
  template: template,
  styles: [style],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskView extends MeteorReactive {
  @Input() task: TodoTask;

  setChecked(checked) {
    this.call('tasks.setChecked', this.task._id,
      checked);
  }

  setAccess() {
    this.call('tasks.setPrivate', this.task._id,
      !this.task.private);
  }

  deleteTask() {
    this.call('tasks.deleteTask', this.task._id);
  }
}
