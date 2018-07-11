import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { Todos } from '../../collections/todos';
import { Todo } from '../../models/todo';

@Component({
  selector: 'todo-list',
  templateUrl: 'todo-list.html',
  styleUrls: ['todo-list.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Observable<Todo[]>;
  todoListSubscription: Subscription;
  ngOnInit() {
    this.todos = Todos.find();
    // Subscribe and connect it to Angular's change detection system
    // while running on client
    if (Meteor.isClient)
      this.todoListSubscription = MeteorObservable.subscribe('todoList').subscribe();
  }
  ngOnDestroy() {
    if (this.todoListSubscription)
      this.todoListSubscription.unsubscribe();
  }
  removeTodo(_id: string) {
    Meteor.call('removeTodo', _id);
  }
}
