import { NgModule } from '@angular/core';

import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    // Import ServerModule while running on server
    ServerModule,
    AppModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class ServerAppModule { }
