/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/task.d.ts" />

import {Component, View, Input, NgClass} from 'angular2/angular2';

import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'task'
})
@View({
    templateUrl: 'client/components/task.html',
  directives: [NgClass]
})
export class TaskView extends MeteorComponent {
  @Input('data') task: Task;

  constructor() {
    super();
  }

  setChecked(checked) {
    Meteor.call('setChecked', this.task._id,
      checked);
  }

  setAccess() {
    Meteor.call('setPrivate', this.task._id,
      !this.task.private);
  }

  deleteTask() {
    Meteor.call('deleteTask', this.task._id);
  }
}
