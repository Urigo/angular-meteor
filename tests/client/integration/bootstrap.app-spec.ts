import {Component, enableProdMode} from '@angular/core';

import {MeteorComponent} from 'angular2-meteor';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';

import {generateData, Tasks} from '../../generate_data';

enableProdMode();

@Component({
  selector: 'todos',
  template: `
  <ul *ngFor="let task of tasks">
    <li id="{{task._id}}">
      {{task.text}}
    </li>
  </ul>`
})
export class Todos extends MeteorComponent {
  constructor() {
    super();

    this.subscribe('tasks');

    this.tasks = Tasks.find();
  }
}

describe('bootstrap', () => {
  let el;
  beforeEach(function() {
    el = document.createElement('todos');
    document.body.appendChild(el);
  });

  afterEach(function() {
    document.body.removeChild(el);
  });

  it('MeteorComponent', done => {
    generateData().then(() => {
      bootstrap(Todos).then(done);
    })
  });
});
