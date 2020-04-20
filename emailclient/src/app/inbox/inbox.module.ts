import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

import { InboxRoutingModule } from './inbox-routing.module';
import { EmailCreateComponent } from './email-create/email-create.component';
import { EmailIndexComponent } from './email-index/email-index.component';
import { EmailReplyComponent } from './email-reply/email-reply.component';
import { EmailShowComponent } from './email-show/email-show.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { EmailFormComponent } from './email-form/email-form.component';


@NgModule({
  declarations: [
    EmailCreateComponent, 
    EmailIndexComponent, 
    EmailReplyComponent, 
    EmailShowComponent, 
    HomeComponent, 
    NotFoundComponent, 
    PlaceholderComponent, EmailFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InboxRoutingModule,
    HttpClientModule,
    SharedModule
  ]
})
export class InboxModule { }
