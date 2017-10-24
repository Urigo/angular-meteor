import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'todoList',
        component: TodoListComponent,
        data: {
          title: 'Todo List'
        }
      },
      {
        path: 'todoAdd',
        loadChildren: './todo-add/todo-add.module#TodoAddModule',
        data: {
          title: 'Add Todo'
        }
      },
      // Home Page
      {
        path: '',
        redirectTo: '/todoList',
        pathMatch: 'full'
      },
      // 404 Page
      {
        path: '**',
        component: PageNotFoundComponent,
        data: {
          title: '404 Page Not Found'
        }
      }
    ])
  ],
  declarations: [
    AppComponent,
    TodoListComponent,
    PageNotFoundComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
