import { Component, OnInit } from '@angular/core';
import { Todos } from 'api/server/collections';
import { Todo } from 'api/server/models';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MeteorObservable } from 'meteor-rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularCLI Meteor Boilerplate';
  todos: Observable<Todo[]>;
  todoContent: string;
  ngOnInit() {
    this.todos = MeteorObservable.subscribe('todos')
      .pipe(switchMap(() => Todos.find()));
  }
  addTodo($event: MouseEvent) {
    $event.preventDefault();
    MeteorObservable.call('addTodo', this.todoContent).subscribe(
      res => console.log(res),
      err => console.error(err)
    );
  }
}
