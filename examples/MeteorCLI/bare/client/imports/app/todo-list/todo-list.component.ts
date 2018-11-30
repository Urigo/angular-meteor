import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { Todos } from '../../../../imports/collections/todos';
import { Todo } from '../../../../imports/models/todo';

@Component({
  selector: 'todo-list',
  templateUrl: 'todo-list.html',
  styleUrls: ['todo-list.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Observable<Todo[]>;
  todoListSubscription: Subscription;
  ngOnInit() {
    this.todoListSubscription = MeteorObservable.subscribe('todoList').subscribe(() => {
      this.todos = Todos.find();
    });
  }
  ngOnDestroy() {
    if (this.todoListSubscription) {
      this.todoListSubscription.unsubscribe();
    }
  }
  removeTodo(_id: string) {
    Meteor.call('removeTodo', _id);
  }
}
