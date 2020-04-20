"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var animations_1 = require("@angular/platform-browser/animations");
var angular2_bootstrap_switch_1 = require("angular2-bootstrap-switch");
var dialog_1 = require("@angular/material/dialog");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var tooltip_1 = require("@angular/material/tooltip");
var autocomplete_1 = require("@angular/material/autocomplete");
var angular2_markdown_1 = require("angular2-markdown");
var app_component_1 = require("./app.component");
var login_register_component_1 = require("./login-register/login-register.component");
var basic_info_component_1 = require("./basic-info/basic-info.component");
var http_client_service_1 = require("./services/http-client/http-client.service");
var forgot_password_component_1 = require("./forgot-password/forgot-password.component");
var reset_password_component_1 = require("./reset-password/reset-password.component");
var home_component_1 = require("./home/home.component");
var header_component_1 = require("./components/common/header/header.component");
var footer_component_1 = require("./components/common/footer/footer.component");
var status_toggle_component_1 = require("./components/common/status-toggle/status-toggle.component");
var new_request_component_1 = require("./new-request/new-request.component");
var list_of_all_requests_component_1 = require("./list-of-all-requests/list-of-all-requests.component");
var my_requests_component_1 = require("./my-requests/my-requests.component");
var team_requests_component_1 = require("./team-requests/team-requests.component");
var review_request_component_1 = require("./review-request/review-request.component");
var request_progress_component_1 = require("./request-progress/request-progress.component");
var all_requests_component_1 = require("./all-requests/all-requests.component");
var all_flightonly_requests_component_1 = require("./all-flightonly-requests/all-flightonly-requests.component");
var contentful_assets_1 = require("./contentful/contentful.assets");
var contentful_entries_1 = require("./contentful/contentful.entries");
var contentful_types_1 = require("./contentful/contentful.types");
var contentful_component_1 = require("./contentful/contentful.component");
var authentication_service_1 = require("./services/authentication/authentication.service");
var nav_menu_component_1 = require("./nav-menu/nav-menu.component");
var ng2_smart_table_1 = require("ng2-smart-table");
var auto_complete_1 = require("@ngui/auto-complete");
var angular2_text_mask_1 = require("angular2-text-mask");
var admin_review_component_1 = require("./admin-review/admin-review.component");
var payload_review_component_1 = require("./payload-review/payload-review.component");
var manager_review_component_1 = require("./manager-review/manager-review.component");
var resources_service_1 = require("./services/resources/resources.service");
var requests_nav_component_1 = require("./components/common/requests-nav/requests-nav.component");
var faq_component_1 = require("./faq/faq.component");
var edit_component_1 = require("./components/common/modals/edit/edit.component");
var message_component_1 = require("./components/common/modals/message/message.component");
// import { ConfirmComponent } from './components/common/modals/confirm/confirm.component';
var custom_date_pipe_1 = require("./pipes/custom-date.pipe");
var confirmation_component_1 = require("./components/common/modals/confirmation/confirmation.component");
var add_flight_component_1 = require("./components/common/modals/add-flight/add-flight.component");
var add_hotel_component_1 = require("./components/common/modals/add-hotel/add-hotel.component");
var access_roles_component_1 = require("./access-roles/access-roles.component");
var save_passport_component_1 = require("./save-passport/save-passport.component");
var passport_guard_1 = require("./passport.guard");
var passport_service_1 = require("./services/passport/passport.service");
var search_box_component_1 = require("./search-box/search-box.component");
var routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'login-register',
        component: login_register_component_1.LoginRegisterComponent,
        data: {
            view: 'home',
            allowAnonymous: '1'
        }
    },
    {
        path: 'forgot-password',
        component: forgot_password_component_1.ForgotPasswordComponent,
        data: {
            view: 'home',
            allowAnonymous: '1'
        }
    },
    {
        path: 'reset-password',
        component: reset_password_component_1.ResetPasswordComponent,
        data: {
            view: 'home',
            allowAnonymous: '1'
        }
    },
    {
        path: 'save-passport',
        component: save_passport_component_1.SavePassportComponent,
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent,
        canActivate: [passport_guard_1.PassportGuard]
    },
    {
        path: 'faq',
        component: faq_component_1.FaqComponent
    },
    {
        path: 'new-request',
        component: new_request_component_1.NewRequestComponent
    },
    {
        path: 'my-requests',
        component: my_requests_component_1.MyRequestsComponent
    },
    {
        path: 'team-requests',
        component: team_requests_component_1.TeamRequestsComponent
    },
    {
        path: 'all-requests',
        component: all_requests_component_1.AllRequestsComponent
    },
    {
        path: 'all-flightonly-requests',
        component: all_flightonly_requests_component_1.AllFlightonlyRequestsComponent
    },
    {
        path: 'review-request',
        component: review_request_component_1.ReviewRequestComponent
    },
    {
        path: 'request-progress/:requestId',
        component: request_progress_component_1.RequestProgressComponent
    },
    {
        path: 'manager-review/:requestId',
        component: manager_review_component_1.ManagerReviewComponent
    },
    {
        path: 'payload-review/:requestId',
        component: payload_review_component_1.PayloadReviewComponent
    },
    {
        path: 'admin-review/:requestId',
        component: admin_review_component_1.AdminReviewComponent
    },
    {
        path: 'access-roles',
        component: access_roles_component_1.AccessRolesComponent
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                login_register_component_1.LoginRegisterComponent,
                basic_info_component_1.BasicInfoComponent,
                forgot_password_component_1.ForgotPasswordComponent,
                reset_password_component_1.ResetPasswordComponent,
                home_component_1.HomeComponent,
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                status_toggle_component_1.StatusToggleComponent,
                new_request_component_1.NewRequestComponent,
                my_requests_component_1.MyRequestsComponent,
                review_request_component_1.ReviewRequestComponent,
                request_progress_component_1.RequestProgressComponent,
                contentful_assets_1.ContentfulAssets,
                contentful_entries_1.ContentfulEntries,
                contentful_types_1.ContentfulTypes,
                contentful_component_1.ContentfulComponent,
                nav_menu_component_1.NavMenuComponent,
                team_requests_component_1.TeamRequestsComponent,
                all_requests_component_1.AllRequestsComponent,
                list_of_all_requests_component_1.ListOfAllRequestsComponent,
                all_flightonly_requests_component_1.AllFlightonlyRequestsComponent,
                admin_review_component_1.AdminReviewComponent,
                payload_review_component_1.PayloadReviewComponent,
                manager_review_component_1.ManagerReviewComponent,
                requests_nav_component_1.RequestsNavComponent,
                faq_component_1.FaqComponent,
                edit_component_1.EditComponent,
                message_component_1.MessageComponent,
                custom_date_pipe_1.CustomDatePipe,
                confirmation_component_1.ConfirmationComponent,
                add_flight_component_1.AddFlightComponent,
                add_hotel_component_1.AddHotelComponent,
                access_roles_component_1.AccessRolesComponent,
                save_passport_component_1.SavePassportComponent,
                search_box_component_1.SearchBoxComponent
            ],
            entryComponents: [
                edit_component_1.EditComponent,
                message_component_1.MessageComponent,
                confirmation_component_1.ConfirmationComponent,
                add_flight_component_1.AddFlightComponent,
                add_hotel_component_1.AddHotelComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                ng2_smart_table_1.Ng2SmartTableModule,
                router_1.RouterModule.forRoot(routes),
                auto_complete_1.NguiAutoCompleteModule,
                angular2_text_mask_1.TextMaskModule,
                angular2_bootstrap_switch_1.BootstrapSwitchModule.forRoot(),
                dialog_1.MatDialogModule,
                progress_spinner_1.MatProgressSpinnerModule,
                tooltip_1.MatTooltipModule,
                autocomplete_1.MatAutocompleteModule,
                animations_1.BrowserAnimationsModule,
                angular2_markdown_1.MarkdownModule.forRoot()
            ],
            providers: [
                http_client_service_1.HttpClientService,
                authentication_service_1.AuthenticationService,
                resources_service_1.ResourcesService,
                passport_service_1.PassportService,
                passport_guard_1.PassportGuard
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map