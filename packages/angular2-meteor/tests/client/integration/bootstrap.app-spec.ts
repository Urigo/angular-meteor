import {NgModule, Component, enableProdMode, NgZone} from '@angular/core';

import {MeteorReactive, METEOR_PROVIDERS} from 'angular2-meteor';

import {BrowserModule} from '@angular/platform-browser';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { $ } from 'meteor/jquery';

import {generateData, Tasks} from '../../generate_data';

enableProdMode();

@Component({
  selector: 'todos',
  template: `
  <ul *ngFor="let task of tasks">
    <li class="task" id="{{task._id}}">
      {{task.text}}
    </li>
  </ul>`
})
class Todos extends MeteorReactive {
  constructor() {
    super();

    this.subscribe('tasks', () => {
      console.log('subscribe');
    });

    this.tasks = Tasks.find();
  }
}

@NgModule({
  imports: [BrowserModule],
  declarations: [Todos],
  providers: METEOR_PROVIDERS,
  bootstrap: [Todos]
})
class AppModule {}

function onStable(ngZone, cb) {
  if (!ngZone.hasPendingMacrotasks &&
      !ngZone.hasPendingMicrotasks) {
    cb();
    return;
  }

  let sub = ngZone.onStable.subscribe({ next: () => {
      if (!ngZone.hasPendingMacrotasks) {
        sub.unsubscribe();
        cb();
      }
    }
  });
};

function onSubsReady(cb: Function): void {
  new Promise((resolve, reject) => {
    const poll = Meteor.setInterval(() => {
      if (DDP._allSubscriptionsReady()) {
        Meteor.clearInterval(poll);
        resolve();
      }
    }, 100);
  }).then(() => cb());
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
      platformBrowserDynamic().bootstrapModule(AppModule).then(moduleRef => {
        let ngZone = moduleRef.injector.get(NgZone);

        onSubsReady(() => {
          onStable(ngZone, () => {
            expect($('.task', el).size()).to.equal(10);
            done();
          });
        });
      });
    });
  });
});
