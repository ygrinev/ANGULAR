import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OutputGraphComponent } from './output-graph/output-graph.component';
import { OutputTableComponent } from './output-table/output-table.component';

@NgModule({
  declarations: [		
    AppComponent,
    OutputGraphComponent,
      OutputTableComponent,
      OutputTableComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
