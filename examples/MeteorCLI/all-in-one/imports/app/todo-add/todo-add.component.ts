import { Component } from '@angular/core';

import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'todo-add',
  templateUrl: 'todo-add.html'
})
export class TodoAddComponent {
  content: string;
  addTodo() {
    Meteor.call('addTodo', this.content);
    this.content = null;
  }
}
