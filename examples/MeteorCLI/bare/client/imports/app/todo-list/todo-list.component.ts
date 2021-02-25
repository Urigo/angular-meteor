import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable, zoneOperator } from 'meteor-rxjs';
import { Todo } from '../../../../imports/models/todo';
import { Todos } from '../../../../imports/collections/todos';

@Component( {
    selector: 'todo-list',
    templateUrl: 'todo-list.html',
    styleUrls: ['todo-list.scss']
} )
export class TodoListComponent implements OnInit, OnDestroy {
    todos: Observable<Todo[]>;
    todos2: Observable<Todo[]>;
    todos3: Observable<Todo[]>;
    todos4: Todo[];
    todoListSubscription: Subscription;

    constructor( private ngZone: NgZone ) {
    }

    ngOnInit() {
        //this.todoListSubscription = MeteorObservable.subscribe( 'todoList' ).subscribe();
        this.todoListSubscription = MeteorObservable.subscribe( 'todoList' ).subscribe( () => {
            this.todos = Todos.find();
        } );

        this.todos2 = Todos.find().pipe( zoneOperator() ) as Observable<Todo[]>;

        Tracker.autorun( () => {
            this.ngZone.run( () => {
                this.todos3 = Todos.find();
            } );
        } );

        Tracker.autorun( () => {
            this.ngZone.run( () => {
                this.todos4 = Todos.find().fetch();
            } );
        } );

    }

    ngOnDestroy() {
        if ( this.todoListSubscription ) {
            this.todoListSubscription.unsubscribe();
        }
    }

    removeTodo( _id: string ) {
        Meteor.call( 'removeTodo', _id );
    }
}
