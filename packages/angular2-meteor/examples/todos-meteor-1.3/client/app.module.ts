/// <reference types="meteor-typings" />
/// <reference types="angular2-compilers-typings" />

'use strict';

import {NgModule, enableProdMode} from '@angular/core';

import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {METEOR_PROVIDERS} from 'angular2-meteor';

import {Todos} from './app.component';
import {TaskList} from '/client/components';
import {TaskView} from '../imports/components';

enableProdMode();

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [Todos, TaskList, TaskView],
  providers: METEOR_PROVIDERS,
  bootstrap: [Todos]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
