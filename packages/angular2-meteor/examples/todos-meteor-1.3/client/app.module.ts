'use strict';

import {NgModule, enableProdMode} from '@angular/core';

import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {MeteorModule} from 'angular2-meteor';

import {Todos} from './app.component';
import {TaskList} from '/client/components';
import {TaskView} from '../imports/components';

enableProdMode();

@NgModule({
  imports: [BrowserModule, FormsModule, MeteorModule],
  declarations: [Todos, TaskList, TaskView],
  bootstrap: [Todos]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
