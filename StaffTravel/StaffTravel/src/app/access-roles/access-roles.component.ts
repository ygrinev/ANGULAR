import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services/http-client/http-client.service';
import { ResourcesService } from '../services/resources/resources.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-access-roles',
    templateUrl: './access-roles.component.html',
    styleUrls: ['./access-roles.component.scss']
})
export class AccessRolesComponent implements OnInit {

    r: any = {};
    userEmail: string = '';
    newRole: string = '';
    systemRoles: Array<string> = new Array<string>();
    userRoles: Array<string> = new Array<string>();
    getSystemRolesAPI: string = 'api/Account/GetSystemRoles';
    getUserRolesByEmailAPI: string = 'api/Account/GetUserRolesByEmail?email={0}';
    grantUserRoleAPI: string = 'api/Account/GrantUserRole';
    revokeUserRoleAPI: string = 'api/Account/RevokeUserRole';
    grantButtonDisabled: boolean = false;
    revokeButtonDisabled: boolean = false;
    searchButtonDisabled: boolean = false;

    constructor(private httpClient: HttpClientService, private router: Router, private resourcesService: ResourcesService) {
        resourcesService.getResources().subscribe(res => {
            this.r = res;
        });
    }

    ngOnInit() {
        this.searchButtonDisabled = true;
        this.httpClient.get(this.getSystemRolesAPI)
            .toPromise()
            .then(res => {
                this.systemRoles = res.json() as Array<string>;
                this.searchButtonDisabled = false;
            })
            .catch(e =>{
                this.router.navigate(['/home']);
                console.log("Failed: " + e);                
                return false;
            });
    }

    getUserRoles() {
        if (!this.userEmail)
            return false;
        
        this.searchButtonDisabled = true;
        
        this.httpClient.get(this.getUserRolesByEmailAPI.replace('{0}', this.userEmail))
            .toPromise()
            .then(res => {
                this.userRoles = res.json() as Array<string>;
                this.searchButtonDisabled = false;
            })
            .catch(e => {
                this.searchButtonDisabled = false;
                alert('Failed: ' + e.json().Message);
            });
    }

    grantUserRole() {
        if (!this.newRole)
            return false;

        let body = {
            email: this.userEmail,
            role: this.newRole
        };

        this.grantButtonDisabled = true;
        this.httpClient.post(this.grantUserRoleAPI, body)
            .toPromise()
            .then(res => {
                alert('Succeeded');
                this.getUserRoles();
                this.grantButtonDisabled = false;
            })
            .catch(e => {
                this.grantButtonDisabled = false;
                alert('Failed: ' + e.json().Message);
            });
    }

    revokeUserRole(userRole: string) {
        if (!this.userEmail || !userRole)
            return false;

        let body = {
            email: this.userEmail,
            role: userRole
        };

        this.revokeButtonDisabled = true;
        this.httpClient.post(this.revokeUserRoleAPI, body)
            .toPromise()
            .then(res => {
                alert('Succeeded');
                this.getUserRoles();
                this.revokeButtonDisabled = false;
            })
            .catch(e => {
                this.revokeButtonDisabled = false;
                alert('Failed: ' + e.json().Message());                
            });
    }
}
