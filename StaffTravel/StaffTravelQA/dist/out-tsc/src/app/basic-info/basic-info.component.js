"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_client_service_1 = require("../services/http-client/http-client.service");
require("rxjs/add/operator/toPromise");
var authentication_service_1 = require("../services/authentication/authentication.service");
var resources_service_1 = require("../services/resources/resources.service");
var moment = require("moment");
var BasicInfoComponent = /** @class */ (function () {
    function BasicInfoComponent(httpClient, router, route, ngZone, authenticationService, resourcesService) {
        var _this = this;
        this.httpClient = httpClient;
        this.router = router;
        this.route = route;
        this.ngZone = ngZone;
        this.authenticationService = authenticationService;
        this.resourcesService = resourcesService;
        this.r = {};
        resourcesService.getResources().subscribe(function (res) {
            _this.r = res;
            _this.route.params.subscribe(function (params) {
                _this.httpClient.get('api/passesInfo/GetExpiryDateBonus')
                    .toPromise()
                    .then(function (res) {
                    _this.expirydate = JSON.parse(res.text());
                    var strExpiry = /expiryDate/gi;
                    _this.typeOfPassInfo10 = _this.r.typeOfPassInfo1.replace(strExpiry, _this.expirydate);
                })
                    .catch(function (e) {
                    console.log('error ' + e);
                });
            });
            _this.initCanvas();
        });
    }
    BasicInfoComponent.prototype.ngOnInit = function () {
        this.currentDate = moment();
    };
    BasicInfoComponent.prototype.initCanvas = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.requestId = _this.route.snapshot.params['requestId'];
            // If an employee ID is passed in
            if (!_this.requestId) {
                _this.subscription = _this.authenticationService.getUserInfo().subscribe(function (userInfo) { _this.basicInfo = userInfo.basicInfo; });
                _this.ngZone.onStable.first().subscribe(function () {
                    _this.drawCanvas();
                });
            }
            else {
                _this.httpClient.get('api/passesInfo/GetBasicInfoByRequestId?RequestId=' + _this.requestId)
                    .toPromise()
                    .then(function (res) {
                    _this.basicInfo = JSON.parse(res.text());
                    _this.ngZone.onStable.first().subscribe(function () {
                        _this.drawCanvas();
                    });
                })
                    .catch(function (e) {
                    console.log('error ' + e);
                });
            }
        });
    };
    BasicInfoComponent.prototype.degreesToRadians = function (degree) {
        return degree * Math.PI / 180;
    };
    BasicInfoComponent.prototype.drawCanvas = function () {
        var passes = Array.from(document.querySelectorAll('canvas[data-passes]'));
        var _loop_1 = function (passIndex) {
            passes[passIndex].setAttribute('id', passIndex);
            var pass = document.getElementById(passIndex);
            var c = pass.getContext('2d');
            var ctxWidth = pass.width;
            var ctxHeight = pass.height;
            var ctxCenter = void 0;
            if (ctxWidth === ctxHeight) {
                ctxCenter = ctxWidth / 2;
            }
            else {
                ctxCenter = 100;
            }
            // Reset Canvas
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.clearRect(0, 0, ctxWidth, ctxHeight);
            c.translate(ctxCenter, ctxCenter - 10);
            var strTotalPasses = pass.getAttribute('data-total-passes');
            var totalPasses = parseInt(strTotalPasses);
            var available = c.strokeStyle = "#396582";
            var strAvailablePasses = pass.getAttribute('data-available-passes');
            var availablePasses = parseInt(strAvailablePasses);
            var strPendingPasses = pass.getAttribute('data-pending-passes');
            var pendingPasses = parseInt(strPendingPasses);
            var strShownAvailablePasses = void 0;
            if (pendingPasses <= availablePasses) {
                var shownAvailablePasses = availablePasses - pendingPasses;
                strShownAvailablePasses = shownAvailablePasses.toString();
            }
            else {
                strShownAvailablePasses = '0';
            }
            var used = c.strokeStyle = "#fff";
            var strUsedPasses = pass.getAttribute('data-used-passes');
            var usedPasses = parseInt(strUsedPasses);
            c.lineWidth = 25;
            c.lineJoin = "miter";
            var radius = ctxCenter - c.lineWidth;
            var defaultStartingAngle = -90;
            // Cache last position the arc ended on
            var lastEndingAngle = -90;
            var startAngle = void 0, endAngle = void 0;
            var drawLineDash = function (segments) {
                try {
                    if (segments) {
                        c.setLineDash([5, 5]);
                    }
                    else {
                        c.setLineDash([]);
                    }
                    c.strokeStyle = '#fff';
                }
                catch (e) {
                    c.strokeStyle = '#ddd';
                }
            };
            // If there are infinite amount of passes available (usecase = Last Mintue Confirmed Passes)
            if (!Number.isFinite(totalPasses)) {
                // Create available ring (Dark blue)
                c.strokeStyle = available;
                c.beginPath();
                c.arc(0, 0, radius, 0, 2 * Math.PI);
                c.stroke();
            }
            else {
                // If there are available passes
                if (totalPasses > 0) {
                    // Create used (unavailable) sections (White)
                    // Loop through used passes
                    c.strokeStyle = used;
                    if (usedPasses) {
                        startAngle = lastEndingAngle;
                        endAngle = ((usedPasses / totalPasses) * 360) + startAngle;
                        c.beginPath();
                        c.arc(0, 0, radius, this_1.degreesToRadians(startAngle), this_1.degreesToRadians(endAngle));
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
                        c.arc(0, 0, radius, this_1.degreesToRadians(startAngle), this_1.degreesToRadians(endAngle));
                        c.stroke();
                        // Draw pending passes
                        drawLineDash(true);
                        c.beginPath();
                        c.arc(0, 0, radius, this_1.degreesToRadians(startAngle), this_1.degreesToRadians(endAngle));
                        c.stroke();
                        lastEndingAngle = endAngle;
                        lastEndingAngle = endAngle;
                    }
                    else {
                        // Draw pending passes first
                        startAngle = lastEndingAngle;
                        endAngle = (pendingPasses / totalPasses * 360) + startAngle;
                        // Draw pending background first
                        c.strokeStyle = available;
                        c.beginPath();
                        c.arc(0, 0, radius, this_1.degreesToRadians(startAngle), this_1.degreesToRadians(endAngle));
                        c.stroke();
                        // Draw pending passes
                        drawLineDash(true);
                        c.beginPath();
                        c.arc(0, 0, radius, this_1.degreesToRadians(startAngle), this_1.degreesToRadians(endAngle));
                        c.stroke();
                        lastEndingAngle = endAngle;
                        // Draw remaining passes
                        drawLineDash(false);
                        c.strokeStyle = available;
                        startAngle = lastEndingAngle;
                        endAngle = ((availablePasses - pendingPasses) / totalPasses * 360) + startAngle;
                        c.beginPath();
                        c.arc(0, 0, radius, this_1.degreesToRadians(startAngle), this_1.degreesToRadians(endAngle));
                        c.stroke();
                        lastEndingAngle = endAngle;
                    }
                }
                else {
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
            }
            else {
                c.fillText(strShownAvailablePasses, 0, 15);
            }
            c.font = "normal 20px PT Sans, Arial, sans serif";
            c.fillText(this_1.r.available, 0, 40);
            // Add "#" Used Text at the bottom right corner of the canvas
            // Move origin point to bottom right
            c.translate(ctxCenter, ctxCenter);
            c.textAlign = "right";
            c.font = "bold 30px PT Sans, Arial, sans serif";
            c.fillText(strUsedPasses, -5, -15);
            c.font = "normal 20px PT Sans, Arial, sans serif";
            c.fillText(this_1.r.used, -5, 5);
            if (pendingPasses > 0) {
                // Add "#" Used Text at the bottom right corner of the canvas
                // Move origin point to bottom left
                c.translate(-ctxCenter * 2, 0);
                c.textAlign = "left";
                c.font = "bold 30px PT Sans, Arial, sans serif";
                c.fillText(strPendingPasses, 5, -15);
                c.font = "normal 20px PT Sans, Arial, sans serif";
                c.fillText(this_1.r.pending, 5, 5);
            }
        };
        var this_1 = this;
        for (var passIndex = 0; passIndex < passes.length; passIndex++) {
            _loop_1(passIndex);
        }
        ;
    };
    BasicInfoComponent = __decorate([
        core_1.Component({
            selector: 'basic-info',
            templateUrl: './basic-info.component.html',
            styleUrls: ['./basic-info.component.scss']
        }),
        __metadata("design:paramtypes", [http_client_service_1.HttpClientService, router_1.Router, router_1.ActivatedRoute, core_1.NgZone, authentication_service_1.AuthenticationService, resources_service_1.ResourcesService])
    ], BasicInfoComponent);
    return BasicInfoComponent;
}());
exports.BasicInfoComponent = BasicInfoComponent;
//# sourceMappingURL=basic-info.component.js.map