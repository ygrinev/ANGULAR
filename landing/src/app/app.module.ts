import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WeatherModule } from './weather/weather.module';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsModule } from './notifications/notifications.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WeatherModule,
    HttpClientModule,
    NotificationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
