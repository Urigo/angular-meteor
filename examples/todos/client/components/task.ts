/// <reference path="../../typings/main.d.ts" />
/// <reference path="../../typings/angular2-meteor/angular2-meteor.d.ts" />
/// <reference path="../../typings/task.d.ts" />

import {Component, View, Input} from 'angular2/core';

import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'task'
})
@View({
  templateUrl: 'client/components/task.html',
})
export class TaskView extends MeteorComponent {
  @Input('data') task: Task;

  setChecked(checked) {
    this.call('setChecked', this.task._id,
      checked);
  }

  setAccess() {
    this.call('setPrivate', this.task._id,
      !this.task.private);
  }

  deleteTask() {
    this.call('deleteTask', this.task._id);
  }
}
