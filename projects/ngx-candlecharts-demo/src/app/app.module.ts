import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxCandlechartsComponent } from 'projects/ngx-candlecharts/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxCandlechartsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
