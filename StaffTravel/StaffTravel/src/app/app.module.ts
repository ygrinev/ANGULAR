import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MarkdownModule } from 'angular2-markdown';

import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { HttpClientService } from './services/http-client/http-client.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { StatusToggleComponent } from './components/common/status-toggle/status-toggle.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { ListOfAllRequestsComponent } from './list-of-all-requests/list-of-all-requests.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { TeamRequestsComponent } from './team-requests/team-requests.component';
import { ReviewRequestComponent } from './review-request/review-request.component';
import { RequestProgressComponent } from './request-progress/request-progress.component';
import { AllRequestsComponent } from './all-requests/all-requests.component';
import { AllFlightonlyRequestsComponent } from './all-flightonly-requests/all-flightonly-requests.component';

import { ContentfulAssets } from './contentful/contentful.assets';
import { ContentfulEntries } from './contentful/contentful.entries';
import { ContentfulTypes } from './contentful/contentful.types';
import { ContentfulComponent } from './contentful/contentful.component';
import { ContentfulService, } from './contentful/src/services/contentful.service';
import { ContentfulCommon, ContentfulContentType } from './contentful/src/contentful-types';

import { AuthenticationService } from './services/authentication/authentication.service';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { TextMaskModule } from 'angular2-text-mask';
import { AdminReviewComponent } from './admin-review/admin-review.component';
import { PayloadReviewComponent } from './payload-review/payload-review.component';
import { ManagerReviewComponent } from './manager-review/manager-review.component';
import { ResourcesService } from './services/resources/resources.service';
import { RequestsNavComponent } from './components/common/requests-nav/requests-nav.component';
import { FaqComponent } from './faq/faq.component';
import { EditComponent } from './components/common/modals/edit/edit.component';
import { MessageComponent } from './components/common/modals/message/message.component';
// import { ConfirmComponent } from './components/common/modals/confirm/confirm.component';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { ConfirmationComponent } from './components/common/modals/confirmation/confirmation.component';
import { AddFlightComponent } from './components/common/modals/add-flight/add-flight.component';
import { AddHotelComponent } from './components/common/modals/add-hotel/add-hotel.component';
import { AccessRolesComponent } from './access-roles/access-roles.component';
import { SavePassportComponent } from './save-passport/save-passport.component';
import { PassportGuard } from './passport.guard';
import { PassportService } from './services/passport/passport.service';
import { SearchBoxComponent } from './search-box/search-box.component';

let routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'login-register',
        component: LoginRegisterComponent,
        data: {
            view: 'home',
            allowAnonymous: '1'
        }
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
            view: 'home',
            allowAnonymous: '1'
        }
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: {
            view: 'home',
            allowAnonymous: '1'
        }
    },
    {
        path: 'save-passport',
        component: SavePassportComponent,
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [PassportGuard]
    },
    {
        path: 'faq',
        component: FaqComponent
    },
    {
        path: 'new-request',
        component: NewRequestComponent
    },
    {
        path: 'my-requests',
        component: MyRequestsComponent
    },
    {
        path: 'team-requests',
        component: TeamRequestsComponent
    },
    {
        path: 'all-requests',
        component: AllRequestsComponent
    },
    {
        path: 'all-flightonly-requests',
        component: AllFlightonlyRequestsComponent
    },
    {
        path: 'review-request',
        component: ReviewRequestComponent
    },
    {
        path: 'request-progress/:requestId',
        component: RequestProgressComponent
    },
    {
        path: 'manager-review/:requestId',
        component: ManagerReviewComponent
    },
    {
        path: 'payload-review/:requestId',
        component: PayloadReviewComponent
    },
    {
        path: 'admin-review/:requestId',
        component: AdminReviewComponent
    },
    {
        path: 'access-roles',
        component: AccessRolesComponent
    },
    {
        path: '**',
            redirectTo: '/home',
            pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginRegisterComponent,
        BasicInfoComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        HomeComponent,
        HeaderComponent,
        FooterComponent,
        StatusToggleComponent,
        NewRequestComponent,
        MyRequestsComponent,
        ReviewRequestComponent,
        RequestProgressComponent,
        ContentfulAssets,
        ContentfulEntries,
        ContentfulTypes,
        ContentfulComponent,
        NavMenuComponent,
        TeamRequestsComponent,
        AllRequestsComponent,
        ListOfAllRequestsComponent,
        AllFlightonlyRequestsComponent,
        AdminReviewComponent,
        PayloadReviewComponent,
        ManagerReviewComponent,
        RequestsNavComponent,
        FaqComponent,
        EditComponent,
        MessageComponent,
        CustomDatePipe,
        ConfirmationComponent,
        AddFlightComponent,
        AddHotelComponent,
        AccessRolesComponent,
        SavePassportComponent,
        SearchBoxComponent
    ],
    entryComponents: [
        EditComponent,
        MessageComponent,
        ConfirmationComponent,
        AddFlightComponent,
        AddHotelComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        Ng2SmartTableModule,
        RouterModule.forRoot(routes),
        NguiAutoCompleteModule,
        TextMaskModule,
        BootstrapSwitchModule.forRoot(),
        MatDialogModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        MarkdownModule.forRoot()
    ],
    providers: [
        HttpClientService,
        AuthenticationService,
        ResourcesService,
        PassportService,
        PassportGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
