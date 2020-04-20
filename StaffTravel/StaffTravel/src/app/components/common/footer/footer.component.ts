import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../../services/resources/resources.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    public r: any;
    userInfo: any;
    subscription: Subscription;

    constructor(private authenticationService: AuthenticationService, private resourcesService: ResourcesService) {
        this.r = {};
        resourcesService.getResources().subscribe(res => this.r = res);

        this.subscription = this.authenticationService.getUserInfo().subscribe(userInfo => { this.userInfo = userInfo; });
    }

    ngOnInit() {}

    switchLanguage() {
        if (this.resourcesService.cultrue == 'en-CA')
            this.resourcesService.setCookie('culture', 'fr-CA', 365);
        else
            this.resourcesService.setCookie('culture', 'en-CA', 365);

        document.location.reload();
    }
}
