'use strict';

import {NgModule, enableProdMode} from '@angular/core';

import {FormsModule} from '@angular/forms';

import {BrowserModule} from '@angular/platform-browser';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {MeteorModule} from 'angular2-meteor';

import {Todos} from './app.component';

enableProdMode();

@NgModule({
  imports: [BrowserModule, MeteorModule, FormsModule],
  declarations: [Todos],
  bootstrap: [Todos]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
