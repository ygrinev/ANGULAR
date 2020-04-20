import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ResourcesService } from '../../../services/resources/resources.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    private userFirstName: string;
    userInfo: any;
    subscription: Subscription;
    allowAnonymous: boolean
    // Nav
    toggleState: boolean;

    r: any = {};

    constructor(private authenticationService: AuthenticationService, private router: Router, private resourcesService : ResourcesService) {
        resourcesService.getResources().subscribe(res => this.r = res);

        this.subscription = this.authenticationService.getUserInfo().subscribe(userInfo => { this.userInfo = userInfo; });

        this.router.events.subscribe((data) => {
            if (data instanceof RoutesRecognized) {
                this.allowAnonymous = data.state.root.firstChild.data.allowAnonymous === '1';
                this.checkAuthorization();
                this.toggleState = false;
            }
        });

    }

    ngOnInit() {

        // Nav toggle is closed by default
        this.toggleState = false;

    }

    checkAdditionalRoles(userRoles : object) {
        return JSON.stringify(userRoles).includes('true');
    }

    toggleNav() {
        this.toggleState = !this.toggleState;
    }

    checkAuthorization() {
        if (!this.userInfo.isLoggedIn && !this.allowAnonymous) {
            //TESTING - print debug info 
            //console.log('Kicked out. isLoggedIn=' + this.userInfo.isLoggedIn + ' allowAnonymous=' + this.allowAnonymous)
            this.router.navigate(['/login-register']);
        }
    }
}
