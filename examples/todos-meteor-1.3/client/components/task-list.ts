import {Component, Input, OnChanges} from '@angular/core';

import {TaskView} from './task';

import {MeteorComponent} from 'angular2-meteor';

import {Tasks} from '../../tasks';

import {Mongo} from 'meteor/mongo';

@Component({
  selector: 'task-list',
  templateUrl: 'client/components/task-list.html',
  directives: [TaskView]
})
export class TaskList extends MeteorComponent implements OnChanges {
  tasks: Mongo.Cursor<Task>;
  @Input() hideCompleted: boolean = false;
  isLoading: boolean;

  constructor() {
    super();
    this.isLoading = true;
    this.subscribe('tasks.public', () => {
      this.isLoading = false;
    }, true);
  }

  ngOnChanges() {
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
