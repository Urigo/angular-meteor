import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { TodoAddComponent } from './todo-add.component';

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild([
      { path: '', component: TodoAddComponent }
    ])
  ],
  declarations: [
    TodoAddComponent
  ]
})
export class TodoAddModule{}
