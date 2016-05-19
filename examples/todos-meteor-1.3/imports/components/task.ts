import {Component, Input} from '@angular/core';

import {MeteorComponent} from 'angular2-meteor';

import style from './task.less.css';
import templateUrl from './task.html';

@Component({
  selector: 'task',
  templateUrl: templateUrl,
  styles: [style]
})
export class TaskView extends MeteorComponent {
  @Input('data') task: Task;

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
