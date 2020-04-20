import { Component, OnInit, NgZone, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BasicInfo } from '../models/basic-info';
import { HttpClientService } from '../services/http-client/http-client.service';
import 'rxjs/add/operator/toPromise';
import { Subscription } from "rxjs/Subscription";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { ResourcesService } from '../services/resources/resources.service';

import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';

@Component({
    selector: 'basic-info',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
    basicInfo: BasicInfo;
    currentDate: moment.Moment;
    requestId: number;
    expirydate: string;
    typeOfPassInfo10: string;
    subscription: Subscription;

    r: any = {};

    constructor(private httpClient: HttpClientService, private router: Router, private route: ActivatedRoute, private ngZone: NgZone, private authenticationService: AuthenticationService, private resourcesService: ResourcesService) {

        
        resourcesService.getResources().subscribe(res => {
            this.r = res;

            this.route.params.subscribe(params => {
                this.httpClient.get('api/passesInfo/GetExpiryDateBonus')
                    .toPromise()
                    .then(res => {
                        this.expirydate = JSON.parse(res.text());
                        var strExpiry = /expiryDate/gi;
                        this.typeOfPassInfo10 = this.r.typeOfPassInfo1.replace(strExpiry, this.expirydate);
                    })
                    .catch(e => {
                        console.log('error ' + e);
                    });
            });

            
            this.initCanvas();
        });

    }

    ngOnInit(): void {
        this.currentDate = moment();

    }

    initCanvas() {
        this.route.params.subscribe(params => {

            this.requestId = this.route.snapshot.params['requestId'];

            // If an employee ID is passed in
            if (!this.requestId) {
                this.subscription = this.authenticationService.getUserInfo().subscribe(userInfo => { this.basicInfo = userInfo.basicInfo; });
                this.ngZone.onStable.first().subscribe(() => {
                    this.drawCanvas();
                });
            } else {
                this.httpClient.get('api/passesInfo/GetBasicInfoByRequestId?RequestId=' + this.requestId)
                    .toPromise()
                    .then(res => {
                        this.basicInfo = JSON.parse(res.text()) as BasicInfo;
                        this.ngZone.onStable.first().subscribe(() => {
                            this.drawCanvas();
                        });
                    })
                    .catch(e => {
                        console.log('error ' + e);
                    });
            }

        });
    }

    degreesToRadians(degree) {
        return degree * Math.PI / 180;
    }

    drawCanvas() {
        let passes = Array.from(document.querySelectorAll('canvas[data-passes]'));

        for (let passIndex = 0; passIndex < passes.length; passIndex++) {
            passes[passIndex].setAttribute('id', passIndex as any as string);

            let pass = <HTMLCanvasElement>document.getElementById(passIndex as any as string);
            let c = pass.getContext('2d');
            let ctxWidth = pass.width;
            let ctxHeight = pass.height;
            let ctxCenter;

            if (ctxWidth === ctxHeight) {
                ctxCenter = ctxWidth / 2;
            } else {
                ctxCenter = 100;
            }

            // Reset Canvas
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.clearRect(0, 0, ctxWidth, ctxHeight);

            c.translate(ctxCenter, ctxCenter - 10);

            let strTotalPasses: string = pass.getAttribute('data-total-passes');
            let totalPasses: number = parseInt(strTotalPasses);

            const available = c.strokeStyle = "#396582";
            let strAvailablePasses: string = pass.getAttribute('data-available-passes');
            let availablePasses: number = parseInt(strAvailablePasses);

            let strPendingPasses: string = pass.getAttribute('data-pending-passes');
            let pendingPasses: number = parseInt(strPendingPasses);

            let strShownAvailablePasses: string;
            if (pendingPasses <= availablePasses) {
                let shownAvailablePasses: number = availablePasses - pendingPasses;
                strShownAvailablePasses = shownAvailablePasses.toString();
            } else {
                strShownAvailablePasses = '0';
            }

            const used = c.strokeStyle = "#fff";
            let strUsedPasses: string = pass.getAttribute('data-used-passes');
            let usedPasses: number = parseInt(strUsedPasses);

            c.lineWidth = 25;
            c.lineJoin = "miter";
            let radius = ctxCenter - c.lineWidth;

            const defaultStartingAngle = -90;
            // Cache last position the arc ended on
            let lastEndingAngle = -90;
            let startAngle, endAngle;

            let drawLineDash = (segments : boolean) => {
                try {
                    if (segments) {
                        c.setLineDash([5, 5]);
                    } else {
                        c.setLineDash([]);
                    }
                    c.strokeStyle = '#fff';
                }
                catch (e) {
                    c.strokeStyle = '#ddd';
                }
            }

            // If there are infinite amount of passes available (usecase = Last Mintue Confirmed Passes)
            if (!Number.isFinite(totalPasses)) {
                // Create available ring (Dark blue)
                c.strokeStyle = available;

                c.beginPath();
                c.arc(0, 0, radius, 0, 2 * Math.PI);
                c.stroke();
            } else {
                // If there are available passes
                if (totalPasses > 0) {

                    // Create used (unavailable) sections (White)
                    // Loop through used passes
                    c.strokeStyle = used;

                    if (usedPasses) {
                        startAngle = lastEndingAngle;
                        endAngle = ((usedPasses / totalPasses) * 360) + startAngle;

                        c.beginPath();
                        c.arc(0, 0, radius, this.degreesToRadians(startAngle), this.degreesToRadians(endAngle));
                        c.stroke();
                        lastEndingAngle = endAngle;
                    }

                    if (pendingPasses >= availablePasses) {
                        c.strokeStyle = '#fff';

                        startAngle = lastEndingAngle;
                        endAngle = ((availablePasses / totalPasses) * 360) + startAngle;

                        // Draw pending background first
                        c.strokeStyle = available;
                        c.beginPath();
                        c.arc(0, 0, radius, this.degreesToRadians(startAngle), this.degreesToRadians(endAngle));
                        c.stroke();

                        // Draw pending passes
                        drawLineDash(true);

                        c.beginPath();
                        c.arc(0, 0, radius, this.degreesToRadians(startAngle), this.degreesToRadians(endAngle));
                        c.stroke();

                        lastEndingAngle = endAngle;


                        lastEndingAngle = endAngle;

                    } else {
                        // Draw pending passes first
                        startAngle = lastEndingAngle;
                        endAngle = (pendingPasses / totalPasses * 360) + startAngle;

                        // Draw pending background first
                        c.strokeStyle = available;
                        c.beginPath();
                        c.arc(0, 0, radius, this.degreesToRadians(startAngle), this.degreesToRadians(endAngle));
                        c.stroke();

                        // Draw pending passes
                        drawLineDash(true);

                        c.beginPath();
                        c.arc(0, 0, radius, this.degreesToRadians(startAngle), this.degreesToRadians(endAngle));
                        c.stroke();

                        lastEndingAngle = endAngle;

                        // Draw remaining passes

                        drawLineDash(false);
                        c.strokeStyle = available;

                        startAngle = lastEndingAngle;
                        endAngle = ((availablePasses - pendingPasses) / totalPasses * 360) + startAngle;

                        c.beginPath();
                        c.arc(0, 0, radius, this.degreesToRadians(startAngle), this.degreesToRadians(endAngle));
                        c.stroke();

                        lastEndingAngle = endAngle;

                    }

                } else {
                    // There are no available passes - create used (unavailable) sections (White)
                    c.strokeStyle = used;

                    c.beginPath();
                    c.arc(0, 0, radius, 0, 2 * Math.PI);
                    c.stroke();
                }
            }

            // Add "#" Available Text in the Middle of the Circle
            c.textAlign = "center";

            c.font = "bold 90px PT Sans, Arial, sans serif";
            // If the number of available passes is inifite
            if (!Number.isFinite(availablePasses)) {
                c.font = "bold 120px Arial";
                c.fillText("\u221E", 0, 35);
            } else {
                c.fillText(strShownAvailablePasses, 0, 15);
            }

            c.font = "normal 20px PT Sans, Arial, sans serif";
            c.fillText(this.r.available, 0, 40);

            // Add "#" Used Text at the bottom right corner of the canvas
            // Move origin point to bottom right
            c.translate(ctxCenter, ctxCenter);

            c.textAlign = "right";

            c.font = "bold 30px PT Sans, Arial, sans serif";
            c.fillText(strUsedPasses, -5, -15);

            c.font = "normal 20px PT Sans, Arial, sans serif";
            c.fillText(this.r.used, -5, 5);

            if (pendingPasses > 0) {
                // Add "#" Used Text at the bottom right corner of the canvas
                // Move origin point to bottom left
                c.translate(-ctxCenter * 2, 0);

                c.textAlign = "left";

                c.font = "bold 30px PT Sans, Arial, sans serif";
                c.fillText(strPendingPasses, 5, -15);

                c.font = "normal 20px PT Sans, Arial, sans serif";
                c.fillText(this.r.pending, 5, 5);
            }

        };
    }
}
