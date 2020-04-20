import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Router, RoutesRecognized, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthenticationService } from "./services/authentication/authentication.service";

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
    view: string;
    hideNav: boolean;
    userInfo: any;
    subscription: Subscription;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService) {

        this.subscription = this.authenticationService.getUserInfo().subscribe(userInfo => { this.userInfo = userInfo; });

        // Loop through router events to last recongized route to grab data from
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route) => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .subscribe((event) => {
                this.view = event.view;
            });

        this.router.events
            .subscribe(data => {
                if (data instanceof RoutesRecognized) {
                    this.checkStorage();
                }
            })
    }

    ngOnInit() {

        this.checkStorage();

    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    checkStorage() {
        this.authenticationService.updateUserInfo();
    }
}
