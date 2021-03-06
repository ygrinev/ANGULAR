import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WeatherModule } from './weather/weather.module';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsModule } from './notifications/notifications.module';
import { NewsApiModule } from './news-api/news-api.module';
import { TrimOutletNamePipe } from './new-api/trim-outlet-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TrimOutletNamePipe
  ],
  imports: [
    BrowserModule,
    WeatherModule,
    HttpClientModule,
    NotificationsModule,
    NewsApiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
