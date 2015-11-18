/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/task.d.ts" />

import {Component, View, NgFor, Input, OnChanges} from 'angular2/angular2';

import {TaskView} from './task';

import {MeteorComponent} from 'angular2-meteor';

import {Tasks} from 'tasks';

@Component({
  selector: 'task-list'
})
@View({
  templateUrl: 'client/components/task-list.html',
  directives: [NgFor, TaskView]
})
export class TaskList extends MeteorComponent implements OnChanges {
  tasks: Mongo.Cursor<Task>;
  @Input() hideCompleted: boolean = false;

  constructor() {
    super();
    this.subscribe('tasks');
  }

  onChanges() {
    this.tasks = this._getTasks(this.hideCompleted);
  }

  _getTasks(hideCompleted) {
    if (hideCompleted) {
      return Tasks.find({
        checked: false
      });
    }
    return Tasks.find({});
  }
}
